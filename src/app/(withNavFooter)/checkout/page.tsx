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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== Left: Order Summary ===== */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-100">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                      {item.image ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item?.image || "img"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-semibold truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-gray-900 font-bold">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 pt-6 border-t-2 border-purple-100">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>NY Sales Tax (8.8875%):</span>
                  <span className="font-semibold">${(subTotal * 0.088875).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t-2 border-purple-100">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ${(total + subTotal * 0.088875).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Right: Checkout Form ===== */}
          <div className="order-1 lg:order-2">
            <ConfigProvider
              theme={{
                components: {
                  Form: { borderRadius: 8 },
                  Input: { borderRadius: 8 },
                },
              }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Shipping Information
                  </h2>
                  <p className="text-gray-600">
                    Please provide your delivery details
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
                    label={<span className="text-gray-900 font-semibold">Full Name</span>}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your Full Name",
                      },
                    ]}
                  >
                    <Input 
                      placeholder="Your full name" 
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<span className="text-gray-900 font-semibold">Email</span>}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Enter a valid email" },
                    ]}
                  >
                    <Input 
                      placeholder="you@example.com" 
                      size="large"
                      className="rounded-lg"
                    />
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
                label={<span className="text-gray-900 font-semibold">Phone Number</span>}
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input 
                  placeholder="Phone Number" 
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              {/* UI portion where you show status under address field */}

              <Form.Item
                name="streetAddress"
                label={<span className="text-gray-900 font-semibold">Street Address</span>}
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
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              {geoLoading && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-600">
                    🔍 Fetching coordinates…
                  </p>
                </div>
              )}

              {!geoLoading &&
                coordinates.lat === null &&
                form.getFieldValue("streetAddress")?.trim() && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      ⚠️ Could not locate this address. Please check spelling or try again.
                    </p>
                  </div>
                )}

              <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl space-y-2">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">🏬 Shop Address:</strong>{" "}
                  {ownerLocation?.data?.address
                    ? ownerLocation?.data?.address
                    : "Loading address..."}
                </p>

                {distance !== null && (
                  <p
                    className={`text-sm font-semibold ${isWithinRange ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    🚗 Distance from shop: {distance.toFixed(2)} miles
                  </p>
                )}

                {distance !== null && (
                  <p
                    className={`text-sm font-medium ${isWithinRange ? "text-green-600" : "text-red-600"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="city" label={<span className="text-gray-900 font-semibold">City</span>} initialValue="Manhattan">
                  <Input disabled size="large" className="rounded-lg bg-gray-100" />
                </Form.Item>
                <Form.Item name="state" label={<span className="text-gray-900 font-semibold">State</span>} initialValue="NY">
                  <Input disabled size="large" className="rounded-lg bg-gray-100" />
                </Form.Item>
                <Form.Item
                  name="zipCode"
                  label={<span className="text-gray-900 font-semibold">Zip Code</span>}
                  rules={[
                    { required: true, message: "Please enter your ZIP code" },
                    {
                      pattern: /^\d{5}$/,
                      message: "ZIP code must be exactly 5 digits",
                    },
                  ]}
                >
                  <Input placeholder="e.g. 10016" maxLength={5} size="large" className="rounded-lg" />
                </Form.Item>
              </div>

              <Form.Item className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-4 px-6 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || cart.length === 0 || !isWithinRange}
                >
                  {loading ? (
                    <ConfigProvider
                      theme={{
                        components: {
                          Spin: {
                            colorPrimary: "#1f2937",
                          },
                        },
                      }}
                    >
                      <Spin size="small" />
                    </ConfigProvider>
                  ) : (
                    "Pay with Stripe"
                  )}
                </button>
                </Form.Item>
                </Form>
                
                <button
                  onClick={() => handleCashOndelivary(form.getFieldsValue())}
                  className="w-full mt-4 bg-white border-2 border-purple-500 text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cashLoading || cart.length === 0 || !isWithinRange}
                >
                  {cashLoading ? (
                    <ConfigProvider
                      theme={{
                        components: {
                          Spin: {
                            colorPrimary: "#9333ea",
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
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
