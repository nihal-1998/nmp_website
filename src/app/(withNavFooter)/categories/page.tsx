/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useGetCatDropDownQuery } from "@/redux/features/categoryApi/categoryApi";
import React, { useState, useEffect } from "react";
import { useGetProductsQuery } from "@/redux/features/productsApi/productsApi";

const CategoryPage = () => {
  const { data: categoryData } = useGetCatDropDownQuery(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData, isLoading } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchText,
    category: selectedCategory, 
  });

  useEffect(() => {
    if (categoryData?.data?.length && !selectedCategory) {
      setSelectedCategory(categoryData.data[0]._id); 
    }
  }, [categoryData, selectedCategory]);


  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category._id);
    setCurrentPage(1); 
  };

  const products = productsData?.data || [];
  const totalProducts = productsData?.meta?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-start items-center gap-3 mb-8">
          {categoryData?.data?.map((item: any) => (
            <button
              key={item._id}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === item._id
                  ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              }`}
              onClick={() => handleCategoryClick(item)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-gray-500 mt-10 py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {!isLoading && products.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
                >
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-lg">
                      {product.discount}
                    </span>
                  )}

                  {/* Image */}
                  <div className="flex justify-center my-3 bg-gradient-to-br from-gray-50 to-purple-50 p-4">
                    <Image
                      src={product?.image||"img"}
                      height={200}
                      width={200}
                      alt={product.name}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h1 className="font-bold mt-2 text-gray-900 text-center text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h1>

                    <p className="text-gray-600 text-sm text-center mb-3">
                      {product.brand} | {product.flavor}
                    </p>

                    <div className="flex justify-between items-center gap-3 mb-3">
                      <div className="flex justify-start items-center gap-2">
                        <p className="text-lg font-bold text-gray-900">
                          ${product.currentPrice}
                        </p>
                        {product.originalPrice > 0 && (
                          <p className="text-gray-500 line-through text-sm">
                            ${product.originalPrice}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(Math.floor(product?.ratings ?? 0))].map(
                          (_, i) => (
                            <FaStar key={i} className="text-sm" />
                          )
                        )}
                        <span className="text-gray-500 text-xs ml-1">
                          ({product.totalReview})
                        </span>
                      </div>
                    </div>

                    <p
                      className={`mb-4 text-sm font-medium ${
                        product.stockStatus === "in_stock"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stockStatus === "in_stock"
                        ? "In Stock"
                        : "Out of Stock"}
                    </p>

                    <div className="flex justify-between items-center gap-2">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-md hover:shadow-lg text-sm">
                        Add to Cart
                      </button>
                      <button className="flex-1 px-4 py-2 bg-white border-2 border-purple-500 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all duration-300 text-sm">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length < totalProducts && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPageSize(pageSize + 6)}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background: "linear-gradient(to right, #fbbf24, #f59e0b, #f59e0b)",
                  }}
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center text-gray-500 mt-10 py-12">
              <p className="text-lg">No products found for this category</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
