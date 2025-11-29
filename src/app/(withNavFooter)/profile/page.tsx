/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input, Spin, ConfigProvider } from "antd";
import {
  useGetProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/redux/features/profileApi/profileApi";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const { data: profileData, isLoading } = useGetProfileQuery();
  const profile = profileData?.data;

  const [updateProfile] = useUpdateProfileMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        password: "********",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <Spin size="large" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!data.phone) {
      return toast.error("Phone is required");
    }

    setLoadingUpdate(true);
    try {
      const updatedData = {
        fullName: data.fullName,
        phone: data.phone,
      };
      await updateProfile(updatedData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileImageUpdate = async () => {
    if (!selectedImage) {
      return toast.error("Please select an image first");
    }

    const formData = new FormData();
    formData.append("file", selectedImage);

    setLoadingImage(true);
    try {
      await updateProfileImage(formData).unwrap();
      toast.success("Profile image updated successfully!");
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile image");
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                borderRadius: 8,
              },
              Button: {
                borderRadius: 8,
              },
            },
          }}
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 md:px-8 py-6 border-b border-purple-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                    {previewImage || profile.profile_img ? (
                      <Image
                        src={previewImage || profile.profile_img}
                        alt="Profile Avatar"
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center border-4 border-white shadow-lg">
                        <FaUser className="text-white text-2xl md:text-3xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {profile.fullName}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link href="/orders" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-white border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300">
                      Order History
                    </button>
                  </Link>
                  <button
                    onClick={handleSave}
                    disabled={loadingUpdate}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingUpdate ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Image Upload Section */}
            <div className="px-6 md:px-8 py-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Profile Picture
              </h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-upload"
                />
                <label
                  htmlFor="profile-upload"
                  className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Choose Image
                </label>
                <button
                  onClick={handleProfileImageUpdate}
                  disabled={loadingImage || !selectedImage}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingImage ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
                {selectedImage && (
                  <span className="text-sm text-gray-600">
                    Image selected. Click Upload to save.
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="px-6 md:px-8 py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-gray-900 font-semibold mb-2">
                    Full Name
                  </label>
                  <Input
                    name="fullName"
                    value={data.fullName}
                    onChange={handleChange}
                    size="large"
                    className="rounded-lg border-gray-300 hover:border-purple-400 focus:border-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 font-semibold mb-2">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    size="large"
                    className="rounded-lg border-gray-300 hover:border-purple-400 focus:border-purple-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 font-semibold mb-2">
                    Email
                  </label>
                  <Input
                    name="email"
                    value={data.email}
                    disabled
                    size="large"
                    className="rounded-lg bg-gray-50 border-gray-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-900 font-semibold mb-2">
                    Password
                  </label>
                  <Input.Password
                    name="password"
                    value={data.password}
                    disabled
                    size="large"
                    className="rounded-lg bg-gray-50 border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ProfilePage;
