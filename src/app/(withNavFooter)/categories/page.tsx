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
    <div className="container mx-auto my-16">
      <div className="flex flex-wrap justify-start items-center gap-5 mb-6">
        {categoryData?.data?.map((item: any) => (
          <button
            key={item._id}
            className={`px-4 py-2 rounded ${
              selectedCategory === item._id
                ? "text-orange-400 border-b-2 border-orange-400"
                : "text-black"
            }`}
            onClick={() => handleCategoryClick(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 mt-10">Loading...</div>
      )}

      {!isLoading && products.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="relative bg-white shadow-lg rounded-lg p-4 text-blue-500"
              >
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md">
                    {product.discount}
                  </span>
                )}

                {/* Image */}
                <div className="flex justify-center my-3">
                  <Image
                    src={product?.image||"img"}
                    height={200}
                    width={200}
                    alt={product.name}
                    className="rounded-md"
                  />
                </div>

                <h1 className="font-bold mt-4 text-blue-500 text-center text-xl my-2">
                  {product.name}
                </h1>

                <p className="text-gray-600 text-sm text-center">
                  {product.brand} | {product.flavor}
                </p>

                <div className="flex justify-between items-center gap-5 mt-2">
                  <div className="flex justify-start items-center gap-3">
                    <p className="text-md font-semibold">
                      ${product.currentPrice}
                    </p>
                    {product.originalPrice > 0 && (
                      <p className="text-gray-500 line-through text-sm">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(Math.floor(product?.ratings ?? 0))].map(
                      (_, i) => (
                        <FaStar key={i} />
                      )
                    )}

                    <span className="text-gray-500 text-sm ml-1">
                      ({product.totalReview})
                    </span>
                  </div>
                </div>

                <p
                  className={`mt-2 text-sm font-medium ${
                    product.stockStatus === "in_stock"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {product.stockStatus === "in_stock"
                    ? "In Stock"
                    : "Out of Stock"}
                </p>

                <div className="mt-4 flex justify-between items-center gap-3">
                  <button className="px-4 py-2 border border-blue-500 rounded-md">
                    Add to Cart
                  </button>
                  <button className="px-4 py-2 border border-blue-500 rounded-md">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length < totalProducts && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPageSize(pageSize + 6)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        !isLoading && (
          <div className="text-center text-gray-500 mt-10">
            No products found for this category
          </div>
        )
      )}
    </div>
  );
};

export default CategoryPage;
