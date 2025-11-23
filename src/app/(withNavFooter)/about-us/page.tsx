/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// import Image from "next/image";
import React from "react";
// import { FaLeaf, FaCloud, FaRegSmile } from "react-icons/fa";
// import image from "../../../assets/image/image 19.png";
// import Facts from "@/components/pages/AboutUs/Facts";
import { useAboutUsQuery } from "@/redux/features/subscribeApi/subscribeApi";

const AboutUs = () => {
  const { data: aboutUsData } = useAboutUsQuery(undefined);
  const rawHtml = aboutUsData?.data?.content || "";

  // ✅ Remove tags but keep structure
  const cleanText = rawHtml.replace(/<[^>]*>/g, "");

  // ✅ Split into sentences/paragraphs
  const paragraphs = cleanText
    .split(
      /(?=\b[A-Z][a-z]+\s(?:Overview|Collection|Methods|Purposes|Sharing|Cookies|Tracking|Rights|Retention|Measures|Privacy|Contact))/
    )
    .filter((p: string) => p.trim() !== "");

  return (
    <div className="container mx-auto my-20 ">
      <div className="grid md:grid-cols-1 gap-28 justify-between p-2 md:p-0">
        {/* Left: Text */}
        <div>
          <h1 className="text-4xl font-bold mb-6 text-gray-900">About Us</h1>

          {/* <div className="space-y-4 text-gray-700 leading-relaxed">
            {paragraphs.map(
              (para: string, idx: React.Key | null | undefined) => {
                // ✅ Bold the first phrase before the first question mark/colon
                const match = para.match(/^([^?:(]+[:?])/);
                let boldPart = "";
                let rest = para;

                if (match) {
                  boldPart = match[0];
                  rest = para.replace(match[0], "");
                }

                return (
                  <p key={idx} className="text-base md:text-lg">
                    {boldPart && (
                      <strong className="font-semibold">{boldPart}</strong>
                    )}
                    {rest}
                  </p>
                );
              }
            )}
          </div> */}
           <div
            className="text-gray-700 leading-relaxed "
            dangerouslySetInnerHTML={{
              __html: aboutUsData?.data?.content || "No information found.",
            }}
          />

          {/* Features Section */}
        </div>

        {/* Right: Image */}
        {/* <div className="">
          <Image
            src={image}
            alt="About "
            height={0}
            width={0}
            className="rounded-xl shadow-lg h-auto w-full items-end"
          />
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-500 shadow-sm">
                <FaLeaf size={20} />
              </div>
              <p className="text-gray-700">
                Made with carefully selected, safe ingredients.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-500 shadow-sm">
                <FaCloud size={20} />
              </div>
              <p className="text-gray-700">
                Smooth, flavorful clouds every time.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-500 shadow-sm">
                <FaRegSmile size={20} />
              </div>
              <p className="text-gray-700">
                Designed for comfort, style, and satisfaction.
              </p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Facts Section */}
      {/* <div className="mt-16">
        <Facts />
      </div> */}
    </div>
  );
};

export default AboutUs;
