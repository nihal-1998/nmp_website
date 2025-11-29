"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";
import { FaGift } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const LimitedOffer: React.FC = () => {
  const { data: infoData } = useGetBannerQuery(undefined);

  const rawDate = infoData?.data?.countDownDate;
  const targetDate = rawDate
    ? new Date(rawDate.replace("Z", "")).getTime()
    : null;

  const calculateTimeLeft = () => {
    if (!targetDate) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      ),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0"
      ),
      minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
        2,
        "0"
      ),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Section - Countdown */}
          <div className="flex-1 w-full lg:max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center lg:text-left">
              Offer Ends Soon
            </h2>

            {/* Countdown Timer */}
            <div className="flex gap-3 md:gap-4 justify-center lg:justify-start mb-8">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center bg-gray-100 rounded-xl px-4 md:px-6 py-4 md:py-6 min-w-[70px] md:min-w-[80px] shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {unit.value}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Shop Now Button */}
            <div className="flex justify-center lg:justify-start">
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

          {/* Right Section - Free Delivery Promotion */}
          <div className="w-full lg:w-[500px] lg:flex-shrink-0 relative">
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-violet-700 rounded-2xl p-8 md:p-10 lg:p-12 min-h-[300px] md:min-h-[350px] lg:min-h-[400px] overflow-hidden free-delivery-card">
              {/* Animated Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float-1"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-2"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl animate-float-3"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-pink-400/15 rounded-full blur-2xl animate-float-4"></div>
              </div>

              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-glow"></div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8 animate-slide-in">
                  {/* Gift Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 shadow-lg animate-bounce-slow">
                    <FaGift className="text-white text-2xl md:text-3xl lg:text-4xl" />
                  </div>
                  
                  {/* Main Text */}
                  <div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 animate-fade-in-up">
                      FREE DELIVERY
                    </h3>
                  </div>
                </div>

                {/* Sub Text */}
                <div className="space-y-3 animate-fade-in-up-delay">
                  <p className="text-white/90 text-sm md:text-base lg:text-lg font-medium">
                    FOR ANY ORDER WITHIN 1 MILE
                  </p>
                  <p className="text-white/80 text-xs md:text-sm lg:text-base">
                    TILL DECEMBER 1ST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Floating Background Animations */
        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -30px) scale(1.1);
            opacity: 0.5;
          }
        }
        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-15px, 20px) scale(0.9);
            opacity: 0.4;
          }
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-45%, -55%) scale(1.2);
            opacity: 0.3;
          }
        }
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(10px, -15px) scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-float-4 {
          animation: float-4 5s ease-in-out infinite;
        }

        /* Glow Animation */
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
            border-color: rgba(255, 255, 255, 0.5);
          }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }

        /* Slide In Animation */
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 1s ease-out;
        }

        /* Bounce Slow Animation */
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* Fade In Up Animation */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 1s ease-out 0.6s both;
        }

        /* Card Hover Effect */
        .free-delivery-card {
          transition: transform 0.3s ease;
        }
        .free-delivery-card:hover {
          transform: translateY(-5px);
        }

        /* Shop Now Button Styles - Matching Banner */
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

export default LimitedOffer;
