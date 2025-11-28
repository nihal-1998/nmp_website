"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";
import { useGetDelivaryInformationQuery } from "@/redux/features/subscribeApi/subscribeApi";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { MdAccessTime, MdFlashOn } from "react-icons/md";

const Banner = () => {
  const { data: bannerData, isLoading } = useGetBannerQuery(undefined);
  const { data: deliveryData } = useGetDelivaryInformationQuery(undefined);
  
  // Rotating text lines
  const textLines = [
    "Experience lightning-fast delivery and premium quality products",
    "Fresh, Fast, and Always at Your Door Within Minutes.",
    "NYC's Quickest Delivery - Every Order, Every Time."
  ];
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textLines.length);
        setIsVisible(true);
      }, 500); // Half of transition time for smooth blink
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [textLines.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-auto min-h-[600px] md:min-h-[700px] lg:h-screen overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-violet-900 to-purple-800 animate-pulse" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto h-full relative px-4 sm:px-6 lg:px-8 py-20">
          <div className="h-12 w-3/4 bg-white/20 animate-pulse rounded-lg mb-4"></div>
          <div className="h-6 w-2/3 bg-white/20 animate-pulse rounded-lg mb-6"></div>
          <div className="h-14 w-48 bg-white/20 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Parse time from delivery data or use defaults
  const zoneAddress = deliveryData?.data?.address || "425 3rd Ave, New York, NY 10016";
  const workingHours = "12:30 PM - 10:00 PM";

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] lg:h-screen overflow-hidden">
      {/* Violet Gradient Background - No text elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-purple-800">
        {/* Animated Blob Background - Only shapes, no text */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-violet-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Optional: Show background image with heavy overlay to completely hide any text */}
        {bannerData?.data?.heroImg && (
          <>
            <Image
              src={bannerData?.data?.heroImg}
              alt="banner"
              fill
              className="object-cover w-full h-full opacity-0"
              priority
              quality={90}
            />
            {/* Strong overlay to completely hide any text in background image */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-purple-800"></div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto relative px-4 sm:px-6 lg:px-8 z-20 py-12 md:py-16 lg:py-0">
        <div className="min-h-[500px] md:min-h-[600px] lg:h-screen flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Side - Main Content */}
            <div className="flex-1 w-full lg:max-w-2xl xl:max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-medium">Fast Delivery Available</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 animate-slide-up">
                <span className="bg-gradient-to-r from-white via-purple-200 to-violet-200 bg-clip-text text-transparent">
                  {bannerData?.data?.title || "Welcome to Qwikr"}
                </span>
              </h1>

              {/* Subtitle - Rotating Text */}
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed text-white/90 animate-slide-up-delay min-h-[3rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center">
                <p className={`rotating-text ${isVisible ? 'text-visible' : 'text-hidden'}`}>
                  {textLines[currentTextIndex]}
                </p>
              </div>

              {/* CTA Button */}
              <div className="animate-slide-up-delay-2">
                <Link href="/product-type" className="shop-now-link">
                  <button className="shop-now-button group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-xl shadow-2xl shadow-yellow-500/60 transition-all duration-300 overflow-hidden w-full sm:w-auto">
                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                    <span className="relative flex items-center gap-2 z-10">
                      Shop Now
                      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Zone and Time Cards */}
            <div className="w-full lg:w-auto lg:max-w-sm flex flex-col gap-4 mt-8 lg:mt-0 animate-slide-in-right">
              {/* Zone Card */}
              <div className="group relative bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-white/20 hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg">
                    <FaMapMarkerAlt className="text-white text-lg sm:text-xl" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm sm:text-base mb-1">
                      ZONE: WITHIN 1 MILE RADIUS
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm leading-relaxed break-words">
                      Centered on {zoneAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Card */}
              <div className="group relative bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-white/20 hover:border-violet-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/30">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Icon with Lightning */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <MdAccessTime className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                      <MdFlashOn className="text-white text-xs" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm sm:text-base mb-1">
                      TIME: {workingHours}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm leading-relaxed">
                      Open Every Day
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.2s both;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 1.2s ease-out 0.4s both;
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.6s both;
        }
        
        /* Rotating Text Blink Effect */
        .rotating-text {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }
        .text-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .text-hidden {
          opacity: 0;
          transform: translateY(10px);
        }
        
        /* Shop Now Button Styles */
        .shop-now-link {
          display: inline-block;
          isolation: isolate;
        }
        .shop-now-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          isolation: isolate;
        }
        .shop-now-button:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(251, 191, 36, 0.5), 0 10px 20px rgba(245, 158, 11, 0.3);
        }
        .shop-now-button:active {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Banner;
