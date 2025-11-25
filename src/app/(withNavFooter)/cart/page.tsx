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
  // console.log(cartItems);
  // Load cart from localStorage on first render
  useEffect(() => {
    const cartString =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    setCartItems(cartString ? JSON.parse(cartString) : []);
  }, []);

  // Total calculations
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item?.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalNumberOfProduct = cartItems?.map((item) => item?.totalQty);
  // console.log("totalNumberOfProduct,", totalNumberOfProduct);
  // DELETE from LocalStorage
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter((item) => item?._id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        Swal.fire("Deleted!", "The item has been removed.", "success");
      }
    });
  };

  // UPDATE quantity in LocalStorage
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

  return (
    <div className="container mx-auto p-5 min-h-[70vh]">
      <div className="flex justify-between items-center my-5">
        <h1 className="text-lg font-bold">Your Cart</h1>
        <p className="text-gray-600 font-bold">{cartItems.length} Items</p>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-3 md:grid-cols-5 text-gray-400 font-medium border-b border-b-gray-400 pb-2 mb-3">
        <p>Products</p>
        <p className="text-center">Quantity</p>
        <p className="hidden md:block text-right col-span-2">Price</p>
        <p className="text-center">Action</p>
      </div>

      {/* Cart Items */}
      {cartItems?.map((item: any) => (
        <div
          key={item?._id}
          className="md:grid grid-cols-3 md:grid-cols-5 md:items-center gap-4 border-b border-b-gray-400 py-4"
        >
          {/* Product Info */}
          <div className="flex items-center gap-3">
            <Image
              src={item?.image}
              alt={item?.name}
              width={60}
              height={60}
              className="rounded"
            />
            <div>
              <p className="font-medium">{item?.name}</p>
              <div className="flex gap-2 items-center">
                <span className="text-orange-500 font-semibold">
                  ${item?.price}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex md:items-center justify-center gap-2">
            <button
              onClick={() =>
                updateQuantity(item?._id, "decrease", item?.quantity)
              }
              className="border px-2"
            >
              −
            </button>
            <span className="border px-3 py-1">{item?.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item?._id, "increase", item?.quantity)
              }
              className="border px-2"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="hidden md:block col-span-2 text-right font-medium">
            ${item?.price * item?.quantity}
          </div>

          {/* Delete Button */}
          <div className="flex mt-2 md:mt-0 justify-center">
            <button
              onClick={() => handleDelete(item?._id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {cartItems.length > 0 ? (
        <div className="flex flex-col items-end mt-5">
          <div className="w-full md:w-1/3 border p-4 rounded-md mb-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">NY Sales Tax (8.8875%):</span>
              <span className="font-semibold">${(totalPrice * 0.088875).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold text-[#3f67bc]">
                ${(totalPrice + totalPrice * 0.088875).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center w-full">
            <Link href="/product-type">
              <button className="text-[#3f67bc] font-bold cursor-pointer">
                ← Continue shopping
              </button>
            </Link>
            <div className="text-white">
              <button
                onClick={handleCheckout}
                className="bg-[#3f67bc] px-6 py-2 rounded-lg "
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-gray-600 font-semibold text-lg">
            🛒 No items in your cart
          </p>
          <Link href="/product-type" className="text-white">
            <button className="mt-4 bg-[#3f67bc]  px-6 py-2 rounded-lg">
              Browse Products
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
