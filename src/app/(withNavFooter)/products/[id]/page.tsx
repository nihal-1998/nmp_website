/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import { useGetSingleProductQuery } from "@/redux/features/productsApi/productsApi";
import { useAddToCartMutation } from "@/redux/features/cartApi/cartApi";
import toast from "react-hot-toast";
import { useGetAllReviewQuery } from "@/redux/features/reviewApi/reviewApi";
import { userCurrentToken } from "@/redux/features/auth/authSlice";

const ProductDetails = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = useSelector(userCurrentToken);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addToCart] = useAddToCartMutation();
  const { data: singleProduct } = useGetSingleProductQuery(id);
  const { data: reviewData } = useGetAllReviewQuery(id as string);
  const [quantity, setQuantity] = useState(1);
  const totalQuantityOfProduct = singleProduct?.data?.quantity;
  localStorage.setItem("totalQuantity", totalQuantityOfProduct);

  const increaseQty = () => {
    if (quantity < totalQuantityOfProduct) {
      setQuantity((prev) => prev + 1);
    } else {
      toast("Stock not available! You cannot add more of this product.");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (!singleProduct?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[40%] h-96 bg-gray-200 rounded-xl"></div>
            <div className="w-full md:w-[60%] flex flex-col gap-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const product = singleProduct.data;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (totalQuantityOfProduct != 0) {
      const existingItem = cart.find((item: any) => item._id === product._id);
      if (existingItem) {
        toast.error("Product already in cart");
        return;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.currentPrice,
          quantity: quantity,
          totalQty: product?.quantity,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Product added to cart");
      }
    } else {
      toast.error("This product is out of Stock");
    }
  };

  const reviews = reviewData?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 md:p-8 lg:p-12">
            {/* Product Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="rounded-lg object-contain"
                />
              </div>
              
              {/* Description */}
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  ${product.currentPrice}
                </p>
                {product.originalPrice > 0 && (
                  <span className="text-xl line-through text-gray-400">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < product.ratings
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.totalReview} Reviews
                </span>
              </div>

              {/* Product Details */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 min-w-[120px]">Category:</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  {product?.brand && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Brand:</span>
                      <span className="text-gray-900">{product.brand}</span>
                    </div>
                  )}
                  {product?.flavor && (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 min-w-[120px]">Flavor:</span>
                      <span className="text-gray-900">{product.flavor}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 min-w-[120px]">Stock Status:</span>
                    <span
                      className={`font-semibold ${
                        product.stockStatus === "In Stock"
                          ? "text-green-600"
                          : product.stockStatus === "Limited Stock"
                          ? "text-yellow-600"
                          : product.stockStatus === "Out of Stock"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {product.stockStatus.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 min-w-[120px]">Available Quantity:</span>
                    <span className="text-gray-900 font-medium">{product.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQty}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-bold text-xl transition-all duration-300 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="min-w-[60px] text-center text-2xl font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-bold text-xl transition-all duration-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg group"
              >
                <IoIosCart className="text-2xl group-hover:scale-110 transition-transform" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-purple-100">
              Ratings & Reviews
            </h2>

            <div className="flex flex-col gap-6">
              {reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <div className="flex-shrink-0 flex justify-center md:justify-start">
                    <Image
                      src={review.profile_img || "/default-avatar.png"}
                      alt={review.fullName || "Reviewer"}
                      height={80}
                      width={80}
                      className="rounded-full border-4 border-white shadow-md"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < (review.rating || product.ratings)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {review.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{review.email}</p>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
