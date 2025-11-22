"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";

const LimitedOffer: React.FC = () => {
  const { data: infoData } = useGetBannerQuery(undefined);

  const rawDate = infoData?.data?.countDownDate;
  // console.log("info", infoData);
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

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between bg-gray-50 p-6 md:p-8 rounded-lg shadow-lg gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            Offer Ends Soon
          </h1>

          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start my-6 md:my-16">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div
                key={label}
                className="bg-blue-50 text-center px-4 md:px-6 py-3 md:py-4 rounded-lg min-w-[70px]"
              >
                <p className="text-2xl md:text-3xl font-bold">{value}</p>
                <p className="text-sm capitalize">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center md:justify-start mt-4 text-white">
            <Link href="/product-type">
              <button className="bg-[#3f67bc]  px-6 py-2 rounded-md transition hover:bg-[#3550a1]">
                Shop Now
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-[325px] h-[300px] md:h-[450px] relative">
          {infoData?.data?.countDownImg ? (
            <Image
              src={infoData?.data?.countDownImg || ""}
              alt="Product"
              fill
              className="object-contain"
              priority
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LimitedOffer;
