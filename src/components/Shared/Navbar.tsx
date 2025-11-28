"use client";

import { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { ConfigProvider, Drawer } from "antd";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser, FaUser, FaHistory } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useGetProfileQuery } from "@/redux/features/profileApi/profileApi";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const token = localStorage.getItem("token");
  const { data: profileData, refetch } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  const updateCartCount = () => {
    const cartString = localStorage.getItem("cart");
    const cart = cartString ? JSON.parse(cartString) : [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dispatch = useDispatch();

  const labels: Label[] = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/product-type" },
    { name: "About Us", link: "/about-us" },
    { name: "Contact Us", link: "/contact-us" },
  ];

  const handleMobileMenuClick = () => {
    setDrawerVisible(!drawerVisible);
  };

  const select = () => {
    setDrawerVisible(false);
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
        <div className="relative group">
          <div className="cursor-pointer">
            {profileData?.data?.profile_img ? (
              <Image
                src={profileData.data.profile_img}
                alt="profile"
                height={40}
                width={40}
                className="h-10 w-10 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
              />
            ) : (
              <Image
                src={user}
                className="h-10 w-10 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                alt="user"
              />
            )}
          </div>
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-[#0c0111] border border-purple-500/30 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-md">
            <div className="py-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200 text-sm font-medium"
              >
                <FaUser className="text-base text-white" />
                <span className="text-white">My Profile</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200 text-sm font-medium"
              >
                <FaHistory className="text-base text-white" />
                <span className="text-white">Order History</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-white hover:bg-gradient-to-r hover:from-red-600/30 hover:to-pink-600/30 transition-all duration-200 text-sm font-medium"
              >
                <IoLogOut className="text-base text-white" />
                <span className="text-white">Logout</span>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <Link
          href="/sign-in"
          className="p-2.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
          title="Sign In"
        >
          <FaRegUser className="text-xl text-white group-hover:text-blue-400 transition-colors" />
        </Link>
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Drawer: {
            colorBgElevated: "#1a0a2e",
          },
        },
      }}
    >
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0c0111]/95 backdrop-blur-md shadow-lg shadow-purple-900/20"
            : "bg-[#0c0111]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group flex-shrink-0"
            >
              <div className="relative">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-blue-300 transition-all duration-300 tracking-tight">
                  Qwikr
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {labels.map((item, index) => {
                const isActive = pathname === item.link;
                return (
                  <Link href={item.link} key={index}>
                    <div
                      className={`relative px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 group ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg blur-sm"></div>
                      )}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-3/4 transition-all duration-300"></div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Icons - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/cart"
                className="relative p-2.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                title="Shopping Cart"
              >
                <IoCartOutline className="text-2xl text-white group-hover:text-purple-400 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              {renderUserSection()}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                title="Shopping Cart"
              >
                <IoCartOutline className="text-2xl text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleMobileMenuClick}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                aria-label="Menu"
              >
                <RxHamburgerMenu className="text-2xl text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                Qwikr
              </span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          className="custom-drawer"
          styles={{
            body: {
              padding: "24px",
              background: "linear-gradient(135deg, #0c0111 0%, #1a0a2e 100%)",
            },
            header: {
              background: "linear-gradient(135deg, #0c0111 0%, #1a0a2e 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <div className="flex flex-col space-y-2">
            {labels.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  href={item.link}
                  key={index}
                  onClick={() => select()}
                >
                  <div
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border-l-4 border-purple-500"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}
            {profileData?.data && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  {profileData?.data?.profile_img ? (
                    <Image
                      src={profileData.data.profile_img}
                      alt="profile"
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full ring-2 ring-purple-500/50"
                    />
                  ) : (
                    <Image
                      src={user}
                      className="h-10 w-10 rounded-full ring-2 ring-purple-500/50"
                      alt="user"
                    />
                  )}
                  <span className="text-white font-medium">
                    {profileData.data.fullName || "User"}
                  </span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDrawerVisible(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white transition-all duration-200"
                >
                  <FaUser className="text-base text-white" />
                  <span className="text-white">My Profile</span>
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setDrawerVisible(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30 hover:text-white transition-all duration-200"
                >
                  <FaHistory className="text-base text-white" />
                  <span className="text-white">Order History</span>
                </Link>
                <button
                  onClick={() => {
                    setDrawerVisible(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-red-600/30 hover:to-pink-600/30 hover:text-white transition-all duration-200"
                >
                  <IoLogOut className="text-base text-white" />
                  <span className="text-white">Logout</span>
                </button>
              </div>
            )}
            {!profileData?.data && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <Link
                  href="/sign-in"
                  onClick={() => setDrawerVisible(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <FaRegUser className="text-base text-white" />
                  <span className="text-white">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      </nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </ConfigProvider>
  );
};

export default NavBar;
