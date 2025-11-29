/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Search from "antd/es/input/Search";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useGetProductsQuery } from "@/redux/features/productsApi/productsApi";
import {
  useGetBrandDropDownQuery,
  useGetCatDropDownQuery,
  useGetFlavourDropDownQuery,
} from "@/redux/features/categoryApi/categoryApi";
import { Pagination, ConfigProvider } from "antd";
import { IoIosCart } from "react-icons/io";
import toast from "react-hot-toast";

// ---------------- Filter Section ----------------
const FilterSection: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ title, options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-4 overflow-hidden">
      <div
        className="flex justify-between items-center cursor-pointer px-5 py-4 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-gray-900 font-bold text-base">{title}</h2>
        {isOpen ? (
          <MdKeyboardArrowUp className="text-xl text-purple-600" />
        ) : (
          <MdKeyboardArrowDown className="text-xl text-purple-600" />
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2 p-4 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 text-gray-700 cursor-pointer hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors group"
            >
              <input
                type="checkbox"
                className="accent-purple-600 w-4 h-4 cursor-pointer"
                checked={selected.includes(option)}
                onChange={() => handleChange(option)}
              />
              <span className="group-hover:text-purple-600 transition-colors">
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData, isLoading } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchText,
  });

  const { data: categoryDropdata } = useGetCatDropDownQuery(undefined);
  const { data: brandData } = useGetBrandDropDownQuery(undefined);
  const { data: flavourdata } = useGetFlavourDropDownQuery(undefined);

  const total = productsData?.meta?.total ?? 0;
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  const categories = categoryDropdata?.data?.map((c: any) => c.name) ?? [];
  const brands = brandData?.data?.map((b: any) => b.name) ?? [];
  const flavours = flavourdata?.data?.map((f: any) => f.name) ?? [];

  const filteredProducts = useMemo(() => {
    const products = productsData?.data ?? [];
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
    productsData?.data,
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
        totalQty: product?.quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product added to cart");
    } else {
      toast.error("This product is out of Stock");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h1 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-100">
                Filter By
              </h1>

              <FilterSection
                title="Category"
                options={categories}
                selected={selectedCategories}
                setSelected={setSelectedCategories}
              />

              <FilterSection
                title="Brand"
                options={brands}
                selected={selectedBrands}
                setSelected={setSelectedBrands}
              />

              <FilterSection
                title="Flavour"
                options={flavours}
                selected={selectedFlavours}
                setSelected={setSelectedFlavours}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                All Products
              </h1>
              <div className="w-full md:w-auto">
                <Search
                  allowClear
                  placeholder="Search products..."
                  onSearch={(value) => setSearchText(value)}
                  onChange={(e) => setSearchText(e.target.value)}
                  enterButton
                  size="large"
                  className="w-full md:w-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white shadow-lg rounded-xl p-6 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <div
                    key={product._id}
                    className="group relative bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
                  >
                    {/* Discount Badge */}
                    {product?.discount && product.discount !== "" && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg">
                        {product.discount}
                      </span>
                    )}

                    {/* Product Image */}
                    <Link href={`/products/${product._id}`}>
                      <div className="flex justify-center bg-gray-50 p-6 group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-violet-50 transition-colors">
                        <Image
                          src={product.image}
                          height={200}
                          width={200}
                          alt={product.name}
                          className="rounded-lg object-contain h-48 w-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-6">
                      <Link href={`/products/${product._id}`}>
                        <h1 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {product.name}
                        </h1>
                      </Link>

                      <div className="text-gray-600 text-sm space-y-1 mb-4 min-h-[60px]">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Category:</span>
                          <span>{product.category}</span>
                        </p>
                        {product.brand && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Brand:</span>
                            <span>{product.brand}</span>
                          </p>
                        )}
                        {product.flavor && (
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Flavour:</span>
                            <span>{product.flavor}</span>
                          </p>
                        )}
                      </div>

                      {/* Price and Rating */}
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <div className="flex gap-3 items-baseline">
                          <p className="text-2xl font-bold text-gray-900">
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
                                i < Math.floor(product?.ratings ?? 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                      >
                        <IoIosCart className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex justify-center items-center my-8">
                <ConfigProvider
                  theme={{
                    components: {
                      Pagination: {
                        itemActiveBg: "#9333ea",
                        colorPrimary: "#ffffff",
                        colorPrimaryHover: "#ffffff",
                      },
                    },
                  }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </ConfigProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
