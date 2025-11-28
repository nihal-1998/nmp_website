/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetDelivaryInformationQuery,
  usePrivacyPolicyQuery,
  useSentSbuscribeMutation,
  useTermsAndConditionQuery,
} from "@/redux/features/subscribeApi/subscribeApi";
import React, { useState } from "react";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";
import { Modal, Spin } from "antd";
import Link from "next/link";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sentSbuscribe] = useSentSbuscribeMutation();

  const { data: privacyData, isLoading: privacyLoading } =
    usePrivacyPolicyQuery(undefined);
  const { data: termsData, isLoading: termsLoading } =
    useTermsAndConditionQuery(undefined);
  const { data: delivaryData, isLoading: deliveryLoading } =
    useGetDelivaryInformationQuery(undefined);

  // Separate modal states
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const res = await sentSbuscribe({ email }).unwrap();
      toast.success(res?.message || "Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Subscription failed");
    }
  };

  return (
    <>
      <Modal
        open={isPrivacyOpen}
        onCancel={() => setIsPrivacyOpen(false)}
        footer={null}
        centered
        width="90%"
        style={{ maxWidth: 800 }}
        className="custom-modal"
        styles={{
          content: {
            borderRadius: "16px",
          },
        }}
      >
        {privacyLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-100">
              Privacy Policy
            </h2>
            <div
              className="text-gray-700 leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:mb-4
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: privacyData?.data?.content || "No information found.",
              }}
            />
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isTermsOpen}
        onCancel={() => setIsTermsOpen(false)}
        footer={null}
        centered
        width="90%"
        style={{ maxWidth: 800 }}
        className="custom-modal"
        styles={{
          content: {
            borderRadius: "16px",
          },
        }}
      >
        {termsLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-100">
              Terms & Conditions
            </h2>
            <div
              className="text-gray-700 leading-relaxed max-h-[500px] overflow-y-auto prose prose-sm max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:mb-4
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: termsData?.data?.content || "No information found.",
              }}
            />
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isDeliveryOpen}
        onCancel={() => setIsDeliveryOpen(false)}
        footer={null}
        centered
        width="90%"
        style={{ maxWidth: 600 }}
        className="custom-modal"
        styles={{
          content: {
            borderRadius: "16px",
          },
        }}
      >
        {deliveryLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-100">
              Delivery Information
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <strong className="text-gray-900 font-semibold min-w-[80px]">Address:</strong>
                <span className="text-gray-700">{delivaryData?.data?.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <strong className="text-gray-900 font-semibold min-w-[80px]">Email:</strong>
                <a
                  href={`mailto:${delivaryData?.data?.email}`}
                  className="text-purple-600 hover:text-purple-700 hover:underline"
                >
                  {delivaryData?.data?.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <strong className="text-gray-900 font-semibold min-w-[80px]">Phone:</strong>
                <a
                  href={`tel:${delivaryData?.data?.phone}`}
                  className="text-purple-600 hover:text-purple-700 hover:underline"
                >
                  {delivaryData?.data?.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <strong className="text-gray-900 font-semibold min-w-[80px]">Instagram:</strong>
                <a
                  href={delivaryData?.data?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 hover:underline"
                >
                  {delivaryData?.data?.instagram}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <strong className="text-gray-900 font-semibold min-w-[80px]">Telegram:</strong>
                <a
                  href={delivaryData?.data?.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 hover:underline"
                >
                  {delivaryData?.data?.telegram}
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsDeliveryOpen(false)}
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <footer className="bg-[#0c0111] text-white border-t border-purple-900/30">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Qwikr
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Fast, fresh, and always at your door within minutes. NYC&apos;s quickest delivery service.
              </p>
              {/* Social Media */}
              <div className="flex gap-4">
                <Link
                  href="http://www.linkedin.com/company/qwikr-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  title="LinkedIn"
                >
                  <FaLinkedin className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link
                  href="https://x.com/Qwikr_us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  title="X (Twitter)"
                >
                  <FaXTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                </Link>
                <Link
                  href="https://www.instagram.com/qwikr.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  title="Instagram"
                >
                  <FaInstagram className="text-gray-400 group-hover:text-pink-400 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Company & Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Company & Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about-us"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyOpen(true);
                    }}
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Customer Service</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/terms-condition"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsOpen(true);
                    }}
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <FiMail className="text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <span>team@qwikr.us</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 text-sm group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <FiPhone className="text-gray-400 group-hover:text-purple-400" />
                  </div>
                  <span>+1(917)-530-1674</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} All rights reserved to Qwikr
              </p>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Made with</span>
                <span className="text-red-500 animate-pulse">❤️</span>
                <span>for fast delivery</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
