/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cartString =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    setCartItems(cartString ? JSON.parse(cartString) : []);
  }, []);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item?.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  );

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      buttonsStyling: true,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter((item) => item?._id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire({
          title: "Deleted!",
          text: "The item has been removed.",
          icon: "success",
          confirmButtonColor: "#fbbf24",
          buttonsStyling: true,
        });
      }
    });
  };

  const updateQuantity = (
    id: string,
    type: "increase" | "decrease",
    currentQty: number
  ) => {
    const updatedCart = cartItems.map((item) => {
      if (item?._id === id) {
        let newQty = type === "increase" ? currentQty + 1 : currentQty - 1;

        if (newQty > item.totalQty) {
          toast.error(
            `Only ${item.totalQty} in stock! You cannot add more of this product.`
          );
          newQty = item.totalQty;
        } else {
          toast.success("Cart updated successfully");
        }

        if (newQty < 1) {
          toast.error("Quantity cannot be less than 1");
          newQty = 1;
        }

        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = () => {
    router.push(`/checkout?total=${totalPrice}&quantity=${totalQuantity}`);
  };

  const subtotal = totalPrice;
  const tax = totalPrice * 0.088875;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your Cart
          </h1>
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold">
            {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-4 border-b-2 border-purple-100">
                  <div className="col-span-5 font-bold text-gray-900">Product</div>
                  <div className="col-span-3 text-center font-bold text-gray-900">Quantity</div>
                  <div className="col-span-2 text-right font-bold text-gray-900">Price</div>
                  <div className="col-span-2 text-center font-bold text-gray-900">Action</div>
                </div>

                {/* Cart Items */}
                {cartItems?.map((item: any) => (
                  <div
                    key={item?._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          fill
                          className="rounded-lg object-cover border-2 border-gray-200"
                        />
                      </div>
                      <div>
                        <Link href={`/products/${item._id}`}>
                          <p className="font-bold text-gray-900 hover:text-purple-600 transition-colors mb-1">
                            {item?.name}
                          </p>
                        </Link>
                        <p className="text-lg font-bold text-purple-600">
                          ${item?.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item?._id, "decrease", item?.quantity)
                        }
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-bold transition-all duration-300 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="min-w-[50px] text-center font-bold text-gray-900 text-lg border-2 border-gray-200 rounded-lg py-2 px-4">
                        {item?.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item?._id, "increase", item?.quantity)
                        }
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-bold transition-all duration-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 md:col-span-2 text-right md:text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item?.price * item?.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 md:col-span-2 flex justify-center md:justify-center">
                      <button
                        onClick={() => handleDelete(item?._id)}
                        className="w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-300 flex items-center justify-center"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-100">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>NY Sales Tax (8.8875%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t-2 border-purple-100">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-4 px-6 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                  >
                    Proceed to Checkout
                  </button>

                  <Link href="/product-type" className="block mt-6">
                    <button className="w-full bg-white border-2 border-purple-500 text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg text-lg">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </p>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link href="/product-type">
              <button className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-4 px-8 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                Browse Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
