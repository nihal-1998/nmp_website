/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React from "react";
import image from "../../../assets/image/Rectangle 145.png";
import { ConfigProvider, Form, Input } from "antd";
import { useConatctUsMutation } from "@/redux/features/profileApi/profileApi";
import toast from "react-hot-toast";

interface ContactFormValues {
  name: string;
  email: string;
  contact: string;
  message?: string;
}

const ConatctUs = () => {
  const [form] = Form.useForm();
  const [conatctUs, { isLoading }] = useConatctUsMutation();

  const onFinish = async (values: ContactFormValues) => {
    const data = {
      name: values.name,
      email: values.email,
      phone: values.contact,
      message: values.message,
    };

    try {
      const res = await conatctUs(data).unwrap();
      toast.success(res?.message || "Message sent successfully!");
      form.resetFields();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={image}
                alt="Contact Us"
                height={600}
                width={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="order-1 lg:order-2">
            <ConfigProvider
              theme={{
                components: {
                  Form: { borderRadius: 8 },
                  Input: { borderRadius: 8 },
                  Button: { borderRadius: 8 },
                },
              }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-100">
                    Contact Us
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Feel free to contact us. We&apos;d love to hear from you!
                  </p>
                </div>

                <Form<ContactFormValues>
                  form={form}
                  name="contact-us"
                  onFinish={onFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    label={<span className="text-gray-900 font-semibold">Full Name</span>}
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input
                      placeholder="Your Name"
                      size="large"
                      className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<span className="text-gray-900 font-semibold">Email</span>}
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      placeholder="Your Email"
                      size="large"
                      className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </Form.Item>

                  <Form.Item
                    name="contact"
                    label={<span className="text-gray-900 font-semibold">Phone Number</span>}
                    rules={[
                      { required: true, message: "Please enter your phone number" },
                    ]}
                  >
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      size="large"
                      className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={<span className="text-gray-900 font-semibold">Message</span>}
                  >
                    <Input.TextArea
                      placeholder="Your Message"
                      rows={5}
                      className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </Form.Item>

                  <Form.Item className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-4 px-6 rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(to right, #fbbf24, #f59e0b, #f59e0b)",
                      }}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </Form.Item>
                </Form>
              </div>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConatctUs;
