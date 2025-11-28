"use client";
import SectionTitle from "@/components/Shared/SectionTitle";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetProductTypeQuery } from "@/redux/features/productsApi/productsApi";
import Link from "next/link";
import React from "react";

const ProductType = () => {
  const { data: typeData, isLoading } = useGetProductTypeQuery(undefined);

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center animate-pulse border border-gray-100">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-6"></div>
      <div className="h-6 w-40 bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 w-32 bg-gray-100 rounded"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle heading="Select Product Type" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : typeData?.data?.map((type: any) => (
                <Link
                  key={type._id}
                  href={`/selected-type-product/${type._id}`}
                  className="group cursor-pointer bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {type.name[0]}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {type.name}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">Click to select</p>
                  
                  {/* Hover Arrow Indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500"></div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductType;
