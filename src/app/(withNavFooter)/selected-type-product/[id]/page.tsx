/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Search from "antd/es/input/Search";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import {
  useGetProductsQuery,
  useGetSingleProductQuery,
} from "@/redux/features/productsApi/productsApi";
import {
  useGetCatDropDownQuery,
  useGetFilterDropdownByIdQuery,
} from "@/redux/features/categoryApi/categoryApi";
import { Pagination, ConfigProvider } from "antd";
import { useParams } from "next/navigation";
import { IoIosCart } from "react-icons/io";
import { useGetAllReviewQuery } from "@/redux/features/reviewApi/reviewApi";
import toast from "react-hot-toast";

// ---------------- Filter Section ----------------
const FilterSection: React.FC<{
  title: string;
  options: { name: string; id: string }[]; // Include category ID with name
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ title, options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (item: { name: string; id: string }) => {
    // console.log("selected item:", item);
    setSelected((prev) =>
      prev.includes(item.id)
        ? prev.filter((c) => c !== item.id)
        : [...prev, item.id]
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-neutral-200 mb-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-3 border-b border-neutral-200 px-4 py-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-gray-800 font-bold">{title}</h2>
        {isOpen ? (
          <MdKeyboardArrowUp className="text-xl" />
        ) : (
          <MdKeyboardArrowDown className="text-xl" />
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2 p-4">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-blue-500"
                checked={selected.includes(option.id)}
                onChange={() => handleChange(option)}
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const SelectedType = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const params = useParams();
  const id = params.id;

  // console.log("seleceted categories,", selectedCategories.join(","));
  // console.log("seleceted selectedFlavours,", selectedFlavours);
  // console.log("seleceted selectedBrands,", selectedBrands);

  const { data: productsData, isLoading } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchText,
    typedId: id,
    categoryId: selectedCategories.join(","),
    flavorId: selectedFlavours.join(","),
    brandId: selectedBrands.join(","),
  });

  // console.log("productsdata:", productsData?.data);
  const { data: categoryDropdata } = useGetCatDropDownQuery(undefined);
  const { data: filterData } = useGetFilterDropdownByIdQuery(id);

  const products = productsData?.data ?? [];
  const total = productsData?.meta?.total ?? 0;

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  // Dynamically fetch categories, brands, and flavours from the dropdown
  const categories =
    filterData?.data?.categoryDropDown?.map((c: any) => ({
      name: c.name,
      id: c._id,
    })) ?? [];

  const brands =
    filterData?.data?.brandDropDown?.map((b: any) => ({
      name: b.name,
      id: b._id,
    })) ?? [];

  const flavours =
    filterData?.data?.flavorDropDown?.map((f: any) => ({
      name: f.name,
      id: f._id,
    })) ?? [];

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      const matchesFlavour =
        selectedFlavours.length === 0 ||
        selectedFlavours.includes(product.flavor);

      const matchesSearch =
        searchText === "" ||
        product.name.toLowerCase().includes(searchText.toLowerCase());

      return matchesCategory && matchesBrand && matchesFlavour && matchesSearch;
    });
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedFlavours,
    searchText,
  ]);


const handleAddToCart = (product: any) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (product.quantity !== 0) {
    const existingItem = cart.find((item: any) => item._id === product._id);

    if (existingItem) {
      toast.error("Product already in cart");
      return;
    }

    cart.push({
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.currentPrice,
      quantity: 1,
      totalQty: product.quantity,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Product added to cart");
  } else {
    toast.error("This product is out of Stock");
  }
};


  return (
    <div className="container mx-auto my-10 min-h-screen">
      <div className="w-full flex flex-col md:flex-row justify-start items-start gap-10 px-2 md:px-0 ">
        <div className="w-full md:w-[20%]">
          <h1 className="text-lg font-semibold mb-2">Filter By</h1>

          {filterData?.data?.categoryDropDown?.length > 0 && (
            <FilterSection
              title="Category"
              options={categories}
              selected={selectedCategories}
              setSelected={setSelectedCategories}
            />
          )}

          {filterData?.data?.brandDropDown?.length > 0 && (
            <FilterSection
              title="Brand"
              options={brands}
              selected={selectedBrands}
              setSelected={setSelectedBrands}
            />
          )}

          {filterData?.data?.flavorDropDown?.length > 0 && (
            <FilterSection
              title="Flavour"
              options={flavours}
              selected={selectedFlavours}
              setSelected={setSelectedFlavours}
            />
          )}
        </div>

        <div className="w-full md:w-[80%]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <h1 className="text-2xl font-bold">All Products</h1>
            <div className="mt-4 md:mt-0">
              <Search
                allowClear
                placeholder="Search products..."
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
                enterButton
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 justify-center items-center">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-lg rounded-lg p-4 animate-pulse"
                >
                  <div className="flex justify-center my-3">
                    <div className="w-40 h-40 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto my-4"></div>
                  <div className="space-y-2 h-20">
                    <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/6 mx-auto"></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : productsData?.data.length > 0 ? (
              productsData?.data?.map((product: any) => (
                <div
                  key={product._id}
                  className="relative bg-white shadow-lg rounded-lg p-4 text-blue-500"
                >
                  {product?.discount && product.discount !== "" && (
                    <span className="absolute top-5 left-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-md">
                      {product.discount}
                    </span>
                  )}
                  <Link href={`/products/${product._id}`}>
                    <div className="flex justify-center my-3">
                      <Image
                        src={product.image}
                        height={200}
                        width={200}
                        alt={product.name}
                        className="rounded-md h-40 w-full object-contain"
                      />
                    </div>
                    <h1 className="font-bold mt-4 text-blue-500 text-center text-xl my-2">
                      {product.name}
                    </h1>

                    <div className="text-gray-600 text-sm text-center space-y-1 h-20">
                      <p>Category: {product.category}</p>
                      {product?.brand ? <p>Brand: {product.brand}</p> : ""}
                      {product?.flavor ? <p>Flavour: {product.flavor}</p> : ""}
                    </div>
                  </Link>
                  <div className=" flex justify-between items-baseline p-2 ">
                    <div className=" flex gap-3 items-baseline">
                      <p className="text-lg font-semibold">
                        ${product.currentPrice}
                      </p>
                      {product.originalPrice > 0 && (
                        <p className="text-gray-500 line-through text-sm">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <button
                      onClick={() => handleAddToCart(product)}
                        className="flex justify-center items-center gap-2 bg-blue-100 px-2 py-2 text-blue-600 hover:bg-blue-200 rounded"
                      >
                        <IoIosCart />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${
                              i < product.ratings
                                ? "text-orange-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      <span className="text-gray-500 text-sm ml-1">
                        ({product.totalReview} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>

          <div className="flex justify-center items-center my-6">
            <ConfigProvider
              theme={{
                components: {
                  Pagination: {
                    itemActiveBg: "rgb(105,112,77)",
                    colorPrimary: "rgb(255,255,255)",
                    colorPrimaryHover: "rgb(255,255,255)",
                  },
                },
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedType;
