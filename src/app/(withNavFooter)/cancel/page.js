"use client";

import Link from "next/link";
import { FaCircleXmark } from "react-icons/fa6";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaCircleXmark className="h-32 w-32 md:h-40 md:w-40 text-red-500" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Your payment was cancelled. Don&apos;t worry — no money has been deducted.  
              You can try again or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/">
                <button
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(to right, #fbbf24, #f59e0b, #f59e0b)",
                  }}
                >
                  Go to Homepage
                </button>
              </Link>

              <Link href="/checkout">
                <button
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-purple-500 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg text-lg transform hover:scale-[1.02]"
                >
                  Try Again
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
