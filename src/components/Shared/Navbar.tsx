"use client";

import { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Button, ConfigProvider, Drawer } from "antd";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { useGetProfileQuery } from "@/redux/features/profileApi/profileApi";
import Image from "next/image";
import { Tooltip } from "antd";
// import { useGetCartQuery } from "@/redux/features/cartApi/cartApi";
import { LuLogOut } from "react-icons/lu";
import user from "../../assets/image/user.jpeg";
import { logout } from "@/redux/features/auth/authSlice";
import { persistor } from "@/redux/store";
import { useDispatch } from "react-redux";
interface Label {
  name: string;
  link: string;
}

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const { data: profileData, refetch } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);
  // const { data: cartData } = useGetCartQuery(undefined);
  // const cartItems = cartData?.data || [];
  const updateCartCount = () => {
    const cartString = localStorage.getItem("cart");
    const cart = cartString ? JSON.parse(cartString) : [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    // Initial load
    updateCartCount();

    // Listen for cart changes
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // console.log("profileData", profileData);
  const dispatch = useDispatch();

  // console.log("cartItems", cartCount);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const labels: Label[] = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/product-type" },
    { name: "About Us", link: "/about-us" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const handleMobileMenuClick = () => {
    setDrawerVisible(!drawerVisible);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const select = (_index: number) => {
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    dispatch(logout());
    persistor.purge();
    window.location.replace("/");
  };

  const renderUserSection = () => {
    if (profileData?.data) {
      return (
        <div className="flex items-center gap-2">
          <Tooltip title={profileData.data.fullName || "User"}>
            <Link href="/profile">
              {profileData?.data?.profile_img ? (
                <Image
                  src={profileData.data.profile_img}
                  alt="profile"
                  height={40}
                  width={40}
                  className="h-12 w-12 rounded-full cursor-pointer"
                />
              ) : (
                <Image
                  src={user}
                  className="h-10 w-10 rounded-full"
                  alt=" user"
                ></Image>
              )}
            </Link>
          </Tooltip>
          <button
            className="px-2 py-1 text-sm cursor-pointer"
            onClick={handleLogout}
          >
            <LuLogOut className="h-6 w-6" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          {/* <Link href="/cart" className="relative flex items-center">
            <IoCartOutline className="text-3xl  transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link> */}
          <Link href="/sign-in">
            <FaRegUser className="text-2xl" />
          </Link>
        </div>
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            contentFontSize: 20,
            paddingBlock: 10,
            borderRadius: 2,
          },
        },
      }}
    >
      <div className="w-full bg-[#0c0111] text-white">
        <div className="container mx-auto flex items-center justify-center py-4 px-6 lg:px-8">
          <div className="flex items-center w-full h-full">
            {/* <Link href="/">
              <Image
                src={img}
                alt="logo"
                className="lg:h-11 h-16 w-auto rounded-full"
              />
            </Link> */}

            <div className="lg:hidden ml-auto flex gap-5">
              <div className="flex justify-between items-center gap-3 ml-2">
                <Link href="/cart" className="relative flex items-center">
                  <IoCartOutline className="text-3xl  transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {/* {renderUserSection()} */}
              </div>
              <Button
                icon={<RxHamburgerMenu className="text-white" />}
                onClick={handleMobileMenuClick}
              />
            </div>

            <div className="hidden lg:flex items-center ml-auto space-x-4 mb-0">
              {labels.map((item, index) => (
                <Link href={item.link} key={index}>
                  <button className="px-4 font-medium text-lg cursor-pointer">
                    {item.name}
                  </button>
                </Link>
              ))}

              <div className="flex justify-between items-center gap-3">
                <Link href="/cart" className="relative flex items-center">
                  <IoCartOutline className="text-3xl  transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {renderUserSection()}
              </div>
            </div>
          </div>
        </div>

        <Drawer
          title=""
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <div className="flex flex-col items-center space-y-4">
            {labels.map((item, index) => (
              <Link href={item.link} key={index}>
                <button
                  className="px-4 font-medium text-lg cursor-pointer w-full text-left"
                  onClick={() => select(index)}
                >
                  {item.name}
                </button>
              </Link>
            ))}
            <div className="flex justify-between items-center gap-3 mt-4">
              {/* {profileData?.data && (
                <Link href="/cart" className="relative flex items-center">
                  <IoCartOutline className="text-2xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )} */}
              {renderUserSection()}
            </div>
          </div>
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default NavBar;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function dispatch(arg0: { payload: undefined; type: "auth/logout" }) {
  throw new Error("Function not implemented.");
}
