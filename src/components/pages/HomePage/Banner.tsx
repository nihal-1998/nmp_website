"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";

const Banner = () => {
  const { data: bannerData, isLoading } = useGetBannerQuery(undefined);

  if (isLoading) {
    return (
      <div className="relative w-full h-80 sm:h-96 md:h-screen overflow-hidden">
        <div className="w-full h-full bg-gray-300 animate-pulse" />
        <div className="container mx-auto h-full relative px-4 sm:px-6 lg:px-8">
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 max-w-2xl">
            <div className="h-10 w-3/4 bg-gray-400 animate-pulse rounded mb-4 sm:mb-6"></div>
            <div className="h-6 w-2/3 bg-gray-400 animate-pulse rounded mb-6 sm:mb-8"></div>
            <div className="h-12 w-40 bg-gray-500 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 md:h-screen overflow-hidden">
      {bannerData?.data?.heroImg && (
        <Image
          src={bannerData?.data?.heroImg}
          alt="banner"
          fill
          className="object-contain object-top md:object-fill  w-full h-full"
          priority
        />
      )}

      <div className="container mx-auto h-full relative px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/2  transform -translate-y-1/2 -translate-x-0 sm:-translate-x-1/4 max-w-2xl text-white drop-shadow-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-wide uppercase">
            {bannerData?.data?.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed opacity-90">
            {bannerData?.data?.subTitle}
          </p>
          <Link href="/product-type">
            <button className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out text-white font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg shadow-indigo-500/50 hover:shadow-indigo-600/70 uppercase tracking-wide w-full sm:w-auto text-center">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
