"use client";
import { useGetDelivaryInformationQuery } from "@/redux/features/subscribeApi/subscribeApi";
import { Spin } from "antd";
import React from "react";

const DelivaryInformation = () => {
  const { data: delivaryData, isLoading: deliveryLoading } =
    useGetDelivaryInformationQuery(undefined);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            {deliveryLoading ? (
              <div className="flex justify-center items-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-100">
                  Delivery Information
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <p className="mb-2">
                      <strong className="text-gray-900">Address:</strong>{" "}
                      <span className="text-gray-700">{delivaryData?.data?.address}</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <p className="mb-2">
                      <strong className="text-gray-900">Email:</strong>{" "}
                      <span className="text-gray-700">{delivaryData?.data?.email}</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <p className="mb-2">
                      <strong className="text-gray-900">Phone:</strong>{" "}
                      <span className="text-gray-700">{delivaryData?.data?.phone}</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <p className="mb-2">
                      <strong className="text-gray-900">Instagram:</strong>{" "}
                      <a
                        href={delivaryData?.data?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 underline font-medium"
                      >
                        {delivaryData?.data?.instagram}
                      </a>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                    <p className="mb-2">
                      <strong className="text-gray-900">Telegram:</strong>{" "}
                      <a
                        href={delivaryData?.data?.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 underline font-medium"
                      >
                        {delivaryData?.data?.telegram}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelivaryInformation;
