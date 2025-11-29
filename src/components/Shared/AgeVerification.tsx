/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetBannerQuery } from "@/redux/features/heroApi/heroApi";
import toast from "react-hot-toast";
import { userCurrentToken } from "@/redux/features/auth/authSlice";

const AgeVerification: React.FC = () => {
  const { data: infoData } = useGetBannerQuery(undefined);
  const [showPopup, setShowPopup] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // console.log("infoData", infoData?.data?.age)
  const age = infoData?.data?.age;
  const token = useSelector(userCurrentToken);

  useEffect(() => {
    // Check localStorage on every render
      if (age === undefined) return;
    const storedVerification = localStorage.getItem("ageVerified");

    // If age is not set or is zero, skip the popup and allow access
    if (!age || age === 0) {
      setIsVerified(true);
      setShowPopup(false);
      return;
    }

    // If not verified and localStorage doesn't have the verification, show the popup
    if (storedVerification !== "true") {
      setShowPopup(true);
    } else {
      setIsVerified(true);
      setShowPopup(false);
    }
  }, [age]);  // Check whenever 'age' changes

  const handleVerify = () => {
    // Store verification state in localStorage
    localStorage.setItem("ageVerified", "true");
    setIsVerified(true); // User is verified
    setShowPopup(false); // Close the popup
  };

  const handleReject = () => {
    toast.error("Sorry, you are not allowed to enter.", {
      duration: 4000,
      position: "top-center",
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        color: "#fff",
        fontWeight: "600",
        fontSize: "16px",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "12px",
        padding: "16px 24px",
      },
    });
  };

  return (
    <AnimatePresence>
      {showPopup && !isVerified && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white/20 backdrop-blur-2xl border border-white/30 py-16 px-12 rounded-3xl shadow-[0_8px_50px_rgba(0,0,0,0.6)] max-w-2xl w-[90%] text-center"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
          >
            <h2 className="text-5xl font-extrabold mb-8 text-white tracking-wide drop-shadow-xl">
              Age Verification
            </h2>

            <p className="mb-14 text-2xl text-gray-100 leading-relaxed max-w-xl mx-auto">
              You must be <span className="font-bold text-white">{age}+</span>{" "}
              years old to access this content. Please confirm your age to
              continue.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-white">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerify}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold text-lg shadow-lg hover:shadow-yellow-500/50 transition-all"
              >
                Yes, I am {age}+
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                className="px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-lg shadow-lg hover:bg-white/30 transition-all"
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerification;
