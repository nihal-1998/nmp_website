/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useAboutUsQuery } from "@/redux/features/subscribeApi/subscribeApi";

const AboutUs = () => {
  const { data: aboutUsData } = useAboutUsQuery(undefined);
  const rawHtml = aboutUsData?.data?.content || "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 pb-6 border-b-2 border-purple-100">
              About Us
            </h1>

            <div
              className="text-gray-700 leading-relaxed prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:mb-4
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:mb-2
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: aboutUsData?.data?.content || "No information found.",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
