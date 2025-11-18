"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";

const Banner = () => {
  const { data: bannerData, isLoading } = useGetBannerQuery(undefined);

  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <div className="w-full h-full bg-gray-300 animate-pulse" />

        <div className="container mx-auto h-full relative">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 max-w-2xl px-2 md:px-0">
            <div className="h-10 w-3/4 bg-gray-400 animate-pulse rounded mb-6"></div>
            <div className="h-6 w-2/3 bg-gray-400 animate-pulse rounded mb-8"></div>
            <div className="h-12 w-40 bg-gray-500 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {bannerData?.data?.heroImg ? (
        <Image
          src={bannerData?.data?.heroImg || ""}
          alt="banner"
          fill
          className="w-full object-cover "
          priority
        />
      ) : null}

      <div className="container mx-auto h-full relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 max-w-2xl text-white drop-shadow-lg px-2 md:px-0">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 tracking-wide uppercase">
            {bannerData?.data?.title}
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed opacity-90">
            {bannerData?.data?.subTitle}
          </p>
          <Link href="/product-type">
            <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out text-white font-bold text-lg md:text-xl px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/50 hover:shadow-indigo-600/70 uppercase tracking-wide">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
