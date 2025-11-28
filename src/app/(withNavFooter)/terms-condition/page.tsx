"use client";

import { useTermsAndConditionQuery } from "@/redux/features/subscribeApi/subscribeApi";
import { Spin } from "antd";
import React from "react";

const TermsCondition = () => {
  const { data: termsData, isLoading: termsLoading } =
    useTermsAndConditionQuery(undefined);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            {termsLoading ? (
              <div className="flex justify-center items-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 pb-4 border-b-2 border-purple-100">
                  Terms & Conditions
                </h2>
                <div
                  className="text-gray-700 leading-relaxed prose prose-purple max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: termsData?.data?.content || "No information found.",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
