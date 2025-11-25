/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Form, Input, Spin } from "antd";
import type { FormProps } from "antd";
import {
  useCashOnDelivaryMutation,
  useCreateOrderMutation,
  useGetLocationApiQuery,
  useGetNearbyLocationQuery,
  useGetShippingCostQuery,
} from "@/redux/features/ordersApi/ordersApi";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Mode = "guest" | "logged-in";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UserLike {
  fullName?: string;
  email?: string;
  phone?: string;
}

interface ContactFormValues {
  fullName?: string;
  email?: string;
  streetAddress: string;
  phone?: string;
  city: string;
  state: string;
  zipCode: string;
}

// ✅ Function to get coordinates using Nominatim API
// async function getManhattanCoordinates(addressPart: string) {
//   try {
//     const fullAddress = `${addressPart}, Manhattan, NY 10016`;
//     const encoded = encodeURIComponent(fullAddress);
//     const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

//     const res = await fetch(url, {
//       headers: { "User-Agent": "MyApp/1.0 (example@domain.com)" },
//     });

//     const data = await res.json();
//     if (data.length > 0) {
//       return {
//         lat: data[0].lat,
//         lon: data[0].lon,
//       };
//     } else {
//       return { lat: null, lon: null };
//     }
//   } catch (err) {
//     console.error("Geocoding error:", err);
//     return { lat: null, lon: null };
//   }
// }

const safeParse = <T,>(val: string | null, fallback: T): T => {
  try {
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
};

const getCartFromStorage = (): CartItem[] =>
  typeof window !== "undefined"
    ? safeParse<CartItem[]>(localStorage.getItem("cart"), [])
    : [];

const buildCartProducts = (items: CartItem[]) =>
  items
    .filter((i) => i && i._id && Number.isFinite(i.quantity) && i.quantity > 0)
    .map((i) => ({ productId: i._id, quantity: i.quantity, price: i.price }));

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = atob(padded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("");
    return JSON.parse(decodeURIComponent(json));
  } catch {
    return null;
  }
};

const extractUserFromToken = (
  claims: Record<string, unknown> | null
): UserLike | null => {
  if (!claims) return null;
  const email =
    (claims["email"] as string) || (claims["upn"] as string) || undefined;

  const fullName =
    (claims["fullName"] as string) ||
    (claims["name"] as string) ||
    (claims["given_name"] && claims["family_name"]
      ? `${claims["given_name"] as string} ${claims["family_name"] as string
        }`.trim()
      : undefined);

  if (!email && !fullName) return null;
  return { email, fullName };
};

const CheckoutPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>("guest");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tokenUser, setTokenUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);
  const [form] = Form.useForm<ContactFormValues>();
  const [createOrder] = useCreateOrderMutation();
  const [cashOnDelivary] = useCashOnDelivaryMutation();
  const router = useRouter();
  const [distance, setDistance] = useState<number | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(true);

  // For coordinates display
  const [coordinates, setCoordinates] = useState<{
    lat: string | null;
    lon: string | null;
  }>({
    lat: null,
    lon: null,
  });
  // console.log("coordinates", coordinates);
  const [geoLoading, setGeoLoading] = useState(false);
  const { data: ownerLocation } = useGetLocationApiQuery({});
  const { data: customerLocation } = useGetNearbyLocationQuery({
    long: coordinates?.lon,
    lat: coordinates?.lat,
  });
  // console.log("ownerLocation?.data",ownerLocation?.data);
  // console.log("customerLocation,", customerLocation);

  // Load cart and decode token once on mount
  useEffect(() => {
    setCart(getCartFromStorage());
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const claims = decodeJwtPayload(token);
        const u = extractUserFromToken(claims);
        if (u) {
          setTokenUser(u);
          setMode("logged-in");
          form.setFieldsValue({ fullName: u.fullName, email: u.email });
        }
      }
    }
  }, [form]);

  const subTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const qty = Math.max(0, Number(item.quantity) || 0);
        const price = Number(item.price) || 0;
        return sum + qty * price;
      }, 0),
    [cart]
  );

  const { data: shippingData } = useGetShippingCostQuery(
    { subTotal: String(subTotal) },
    { skip: !Number.isFinite(subTotal) }
  );

  const shippingCost = Number(shippingData?.data?.shippingCost ?? 0);
  const total = subTotal + shippingCost;

  // Fetch coordinates automatically when streetAddress changes
  // handle address input change
  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    form.setFieldsValue({ streetAddress: value });
    if (!value.trim()) {
      setCoordinates({ lat: null, lon: null });
      return;
    }
    setGeoLoading(true);
    const result = await getCoordinates(value);
    setCoordinates({
      lat: result.lat?.toString() ?? null,
      lon: result.lon?.toString() ?? null,
    });
    setGeoLoading(false);
  };

  //  Fetch coordinates from OpenStreetMap (Nominatim)
  // Geocoding function (forward)
  async function getCoordinates(address: string) {
    try {
      const cleanAddress = address.trim().replace(/,+$/, "");
      const encoded = encodeURIComponent(cleanAddress);
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "MyApp/1.0 (example@domain.com)" },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return { lat: null, lon: null };
    } catch (err) {
      console.error("Geocoding error:", err);
      return { lat: null, lon: null };
    }
  }

  //  Haversine formula to calculate distance between two lat/lon points
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    return distanceInKm * 0.621371; // return distance in miles
  }

  // 🔍 Check distance whenever coordinates or ownerLocation change
  // Distance check effect
  useEffect(() => {
    // if no valid coordinates then reset distance
    if (!coordinates.lat || !coordinates.lon) {
      setDistance(null);
      setIsWithinRange(true);
      return;
    }

    if (ownerLocation?.data?.latitude && ownerLocation?.data?.longitude) {
      const dist = calculateDistance(
        Number(ownerLocation.data.latitude),
        Number(ownerLocation.data.longitude),
        Number(coordinates.lat),
        Number(coordinates.lon)
      );
      // console.log("Distance check:", {
      //   owner: ownerLocation.data,
      //   customer: coordinates,
      //   dist,
      // });
      setDistance(dist);
      setIsWithinRange(dist <= 5);
    }
  }, [ownerLocation, coordinates]);

  const onFinish: FormProps<ContactFormValues>["onFinish"] = async (values) => {
    try {
      setLoading(true);

      const cartProducts = buildCartProducts(cart);
      if (cartProducts.length === 0) {
        toast.error("Your cart is empty or quantities are invalid.");
        return;
      }

      const userData = tokenUser
        ? {
          fullName: (tokenUser.fullName || "").trim(),
          email: (tokenUser.email || "").trim(),
          phone: (values.phone || "").trim(),
        }
        : {
          fullName: (values.fullName || "").trim(),
          email: (values.email || "").trim(),
          phone: values.phone,
        };

      if (!userData.fullName || !userData.email) {
        toast.error("Please provide your full name and email.");
        return;
      }

      // Fetch coordinates before sending payload
      const cleanStreet = values.streetAddress.trim().replace(/,+$/, "");
      const coordinates = await getCoordinates(cleanStreet);
      // console.log("Coordinates:", coordinates);

      const payload = {
        userData,
        shippingAddress: {
          streetAddress: values.streetAddress,
          city: "Manhattan",
          state: "NY",
          zipCode: values.zipCode,
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        },
        cartProducts,
      };

      // console.log("payload", payload);

      // return 0;

      const res = await createOrder(payload).unwrap();

      if (res?.success && res?.data?.url) {
        toast.success(res?.message || "Redirecting to payment…");
        window.location.href = res.data.url;
        localStorage.removeItem("cart");
      } else {
        toast.error(res?.message || "Payment link not found!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCashOndelivary = async (values: ContactFormValues) => {
    try {
      setCashLoading(true);
      const cartProducts = buildCartProducts(cart);

      if (cartProducts.length === 0) {
        toast.error("Your cart is empty or quantities are invalid.");
        return;
      }

      const userData = tokenUser
        ? {
          fullName: (tokenUser.fullName || "").trim(),
          email: (tokenUser.email || "").trim(),
          phone: (values.phone || "").trim(),
        }
        : {
          fullName: (values.fullName || "").trim(),
          email: (values.email || "").trim(),
          phone: values.phone,
        };

      if (!userData.fullName || !userData.email) {
        toast.error("Please provide your full name and email.");
        return;
      }

      const payload = {
        userData,
        shippingAddress: {
          streetAddress: values.streetAddress,
          phone: values.phone,
          city: "Manhattan",
          state: "NY",
          zipCode: "10016",
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        },
        cartProducts,
      };

      const res = await cashOnDelivary(payload).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Order placed successfully!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/successfull-order");
      } else {
        toast.error(res?.message || "Failed to place cash on delivery order.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setCashLoading(false);
    }
  };

  // async function getAddressFromLatLon(lat: number, lon: number) {
  //   try {
  //     const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  //     const res = await fetch(url, {
  //       headers: { "User-Agent": "MyApp/1.0 (example@domain.com)" },
  //     });
  //     const data = await res.json();
  //     return data.display_name || "Unknown address";
  //   } catch (err) {
  //     console.error("Reverse geocoding error:", err);
  //     return "Address not found";
  //   }
  // }

  // const [shopAddress, setShopAddress] = useState<string>("");

  // useEffect(() => {
  //   if (ownerLocation?.data?.latitude && ownerLocation?.data?.longitude) {
  //     getAddressFromLatLon(
  //       Number(ownerLocation.data.latitude),
  //       Number(ownerLocation.data.longitude)
  //     ).then((addr) => setShopAddress(addr));
  //   }
  // }, [ownerLocation]);

  return (
    <div className="container mx-auto my-12 px-2 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-28">
        {/* ===== Left: Order Summary ===== */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-600">Order Summary</h1>
          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-neutral-400">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border border-neutral-200 rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <Image
                        src={item?.image || "img"}
                        alt={item.name}
                        height={20}
                        width={20}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-200 rounded-md" />
                    )}
                    <div>
                      <p className="text-neutral-700 font-medium">
                        {item.name}
                      </p>
                      <p className="text-neutral-400 text-sm">
                        Qty: {item.quantity} • ${Number(item.price).toFixed(2)}{" "}
                        each
                      </p>
                    </div>
                  </div>
                  <div className="text-neutral-700 font-semibold">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-b-2 border-b-neutral-300 pb-5 mt-6">
            <div className="text-neutral-400 flex justify-between">
              <h1>SUBTOTAL</h1>
              <p>${subTotal.toFixed(2)}</p>
            </div>
            <div className="text-neutral-400 flex justify-between">
              <h1>SHIPPING</h1>
              <p>${shippingCost.toFixed(2)}</p>
            </div>
            <div className="text-neutral-400 flex justify-between">
              <h1>NY Sales Tax (8.8875%)</h1>
              <p className="font-semibold text-neutral-600">${(subTotal * 0.088875).toFixed(2)}</p>
            </div>
          </div>
          <div className="text-neutral-600 flex justify-between mt-5 font-semibold">
            <h1>TOTAL</h1>
            <p>${(total + subTotal * 0.088875).toFixed(2)}</p>
          </div>
        </div>

        {/* ===== Right: Checkout Form ===== */}
        <ConfigProvider
          theme={{
            components: {
              Form: { borderRadius: 0 },
              Input: { borderRadius: 5 },
            },
          }}
        >
          <div className="py-10 mx-4 md:mx-0 px-6 md:px-10 border border-neutral-200 rounded-lg">
            <div className="mb-4 text-center">
              <h2 className="text-neutral-700 text-2xl font-bold mb-2 uppercase">
                Checkout
              </h2>
              <p className="text-neutral-400 lg:text-lg font-bold">
                Shipping Information
              </p>
            </div>

            <Form<ContactFormValues>
              form={form}
              name="checkout"
              onFinish={onFinish}
              layout="vertical"
            >
              {mode === "guest" && !tokenUser && (
                <>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    labelCol={{
                      style: {
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#444",
                      },
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your Full Name",
                      },
                    ]}
                  >
                    <Input placeholder="Your full name" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    labelCol={{
                      style: {
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#444",
                      },
                    }}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input placeholder="you@example.com" />
                  </Form.Item>
                </>
              )}
              {/* <Form.Item
                name="phone"
                label={<p className="text-md">Phone Number</p>}
                rules={[
                  { required: true, message: "Please enter your Phone Number" },
                ]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item> */}

              <Form.Item
                name="phone"
                label="Phone Number"
                labelCol={{
                  style: { fontSize: "16px", fontWeight: 500, color: "#444" },
                }}
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>

              {/* UI portion where you show status under address field */}

              <Form.Item
                name="streetAddress"
                label="Street Address"
                labelCol={{
                  style: { fontSize: "16px", fontWeight: 500, color: "#444" },
                }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your Street Address",
                  },
                ]}
              >
                <Input
                  placeholder="e.g. 200 Central Park West"
                  onChange={handleAddressChange}
                />
              </Form.Item>

              {geoLoading && (
                <p className="text-xs text-blue-500 mb-3">
                  Fetching coordinates…
                </p>
              )}

              {!geoLoading &&
                coordinates.lat === null &&
                form.getFieldValue("streetAddress")?.trim() && (
                  <p className="text-xs text-red-500 mb-3">
                    Could not locate this address. Please check spelling or try
                    again.
                  </p>
                )}

              <div className="my-2 space-y-1">
                <p className="text-sm text-gray-700">
                  🏬 <strong>Shop Address:</strong>{" "}
                  {ownerLocation?.data?.address
                    ? ownerLocation?.data?.address
                    : "Loading address..."}
                </p>

                {/* {ownerLocation?.data?.latitude &&
                  ownerLocation?.data?.longitude && (
                    <p className="text-xs text-gray-500">
                      (Lat: {ownerLocation.data.latitude}, Lon:{" "}
                      {ownerLocation.data.longitude})
                    </p>
                  )} */}

                {distance !== null && (
                  <p
                    className={`text-sm ${isWithinRange ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    🚗 Distance from shop: {distance.toFixed(2)} miles
                  </p>
                )}

                {distance !== null && (
                  <p
                    className={`text-xs font-medium ${isWithinRange ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {isWithinRange
                      ? `✅ You are within the ${distance.toFixed(
                        2
                      )} mile range.`
                      : `❌ Please order within the ${ownerLocation?.data?.distance} mile range.`}
                  </p>
                )}
              </div>

              {/* <Form.Item
                name="phone"
                label={<p className="text-md">Phone Number</p>}
                rules={[
                  { required: true, message: "Please enter your Phone Number" },
                ]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item> */}

              {/* City, State, ZIP fixed */}
              <Form.Item name="city" label="City" initialValue="Manhattan">
                <Input disabled />
              </Form.Item>
              <Form.Item name="state" label="State" initialValue="NY">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="zipCode"
                label="Zip Code"
                rules={[
                  { required: true, message: "Please enter your ZIP code" },
                  {
                    pattern: /^\d{5}$/,
                    message: "ZIP code must be exactly 5 digits",
                  },
                ]}
              >
                <Input placeholder="e.g. 10016" maxLength={5} />
              </Form.Item>

              <Form.Item className="text-center">
                <div className="text-white">
                  <button
                    type="submit"
                    className="w-full py-3 font-bold text-2xl bg-[#3f67bc] text-white rounded-md shadow-lg disabled:opacity-70"
                    disabled={loading || cart.length === 0 || !isWithinRange}
                  >
                    {loading ? (
                      <ConfigProvider
                        theme={{
                          components: {
                            Spin: {
                              colorPrimary: "rgb(255,255,255)",
                            },
                          },
                        }}
                      >
                        <Spin size="small" />
                      </ConfigProvider>
                    ) : (
                      "Pay with Stripe"
                    )}

                    {/* {loading ? <Spin size="small" /> : "Pay with Stripe"} */}
                  </button>
                </div>
              </Form.Item>
            </Form>
            <div className="text-white">
              <button
                onClick={() => handleCashOndelivary(form.getFieldsValue())}
                className="w-full mt-2 text-xs py-3 font-bold bg-[#3f67bc] text-white rounded-md shadow-lg disabled:opacity-70"
                disabled={cashLoading || cart.length === 0 || !isWithinRange}
              >
                {cashLoading ? (
                  <ConfigProvider
                    theme={{
                      components: {
                        Spin: {
                          colorPrimary: "rgb(255,255,255)",
                        },
                      },
                    }}
                  >
                    <Spin size="small" />
                  </ConfigProvider>
                ) : (
                  "Cash On Delivery"
                )}
              </button>
            </div>
          </div>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CheckoutPage;
