/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SectionTitle from "@/components/Shared/SectionTitle";
import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";
import { useGetFeatureProductsQuery } from "@/redux/features/productsApi/productsApi";
import { useAddToCartMutation } from "@/redux/features/cartApi/cartApi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { userCurrentToken } from "@/redux/features/auth/authSlice";
import { IoIosCart } from "react-icons/io";

const FeatureProducts = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = useSelector(userCurrentToken);
  const { data: productsData } = useGetFeatureProductsQuery(undefined);
  const products = productsData?.data || [];
  const [addToCart] = useAddToCartMutation();
  const router = useRouter();

  const handleAddToCart = async (productId: string) => {
    try {
      const payload = {
        productId,
        quantity: 1,
      };
      const res = await addToCart(payload).unwrap();
      toast.success(res?.message || "Added to cart!");
      router.push("/cart");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  if (!products.length) return null;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle heading={"Featured Products"} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="group relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
            >
              {/* Discount Badge */}
              {product?.discount > 0 && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                  -{product.discount}%
                </span>
              )}

              {/* Product Image */}
              <Link href={`/products/${product._id}`}>
                <div className="flex justify-center bg-gray-50 p-6 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-violet-50 transition-colors">
                  <Image
                    src={product.image}
                    height={220}
                    width={220}
                    alt={product.name}
                    className="rounded-lg group-hover:scale-105 transition-transform duration-300 h-48 w-full object-contain"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6">
                <Link href={`/products/${product._id}`}>
                  <h2 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h2>
                </Link>
                
                <p className="text-sm text-gray-600 mb-3">
                  {product.brand} • {product.category}
                </p>
                {product.flavor && (
                  <p className="text-sm text-gray-500 mb-4">Flavor: {product.flavor}</p>
                )}

                {/* Price and Rating */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-gray-900">
                      ${product.currentPrice}
                    </p>
                    {product.originalPrice > 0 && (
                      <p className="text-gray-400 line-through text-sm">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < product.ratings
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.totalReview})
                    </span>
                  </div>
                </div>

                {/* Stock Status */}
                <p
                  className={`mb-4 text-sm font-semibold ${
                    product.stockStatus === "in_stock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stockStatus === "in_stock" ? "✓ In Stock" : "✗ Out of Stock"}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stockStatus !== "in_stock"}
                    className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IoIosCart className="text-lg" />
                    <span>Add to Cart</span>
                  </button>
                  <Link href={`/products/${product._id}`} className="flex-1">
                    <button className="w-full bg-white border-2 border-purple-500 text-purple-600 font-bold py-3 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center my-12">
          <Link href="/products">
            <button className="group flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold px-8 py-4 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl">
              <span>See More Products</span>
              <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureProducts;
