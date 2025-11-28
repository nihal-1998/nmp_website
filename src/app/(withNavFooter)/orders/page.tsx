/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Rate,
  notification,
  Form,
  Pagination,
  ConfigProvider,
} from "antd";
import SectionTitle from "@/components/Shared/SectionTitle";
import { useGetOrdersQuery } from "@/redux/features/ordersApi/ordersApi";
import { useCreateReviewMutation } from "@/redux/features/reviewApi/reviewApi";
import toast from "react-hot-toast";

interface Product {
  image: string;
  name: string;
  price: number;
  quantity: number;
  isReview: boolean;
  productId: string;
}

interface Order {
  _id: string;
  createdAt: string;
  deliveryAt: string;
  paymentStatus: string;
  status: string;
  token: string;
  totalPrice: number;
  products: Product[];
}

const OrderPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  const { data: orderData, isLoading } = useGetOrdersQuery({
    page: currentPage,
    limit: pageSize,
  });
const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [orderId, setOrderId] = useState<string>("");
  // console.log("orderData", orderData?.data);

  const [createReview, { isLoading: isReviewLoading }] =
    useCreateReviewMutation();

  const handleModalOpen = (productId: string, orderId: string) => {
    setSelectedProductId(productId);
    localStorage.setItem("productId", productId);
    setOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setOrderId("");
    setReview("");
    setRating(0);
      form.resetFields();
  };

  const handleReviewSubmit = async (values: any) => {
    if (
      !selectedProductId ||
      !orderId ||
      !values.comment ||
      values.star === 0
    ) {
      notification.error({
        message: "Review Error",
        description:
          "Please provide both a rating, a comment, and make sure orderId exists.",
      });
      return;
    }

    const reviewData = {
      orderId, // now coming from state
      productId: selectedProductId,
      star: values.star,
      comment: values.comment,
    };

    // console.log("reviewData", reviewData);

    try {
      const res = await createReview(reviewData).unwrap();
      // console.log("Review response:", res);
      toast.success(res.message);
      handleModalClose();
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "token",
      key: "token",
      width: 90,
      fixed: "left" as const,
      render: (text: string) => (
        <span className="text-purple-600 font-bold text-xs md:text-sm break-all">
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 80,
      render: (date: string) => (
        <span className="text-gray-700 font-medium text-xs">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      width: 200,
      render: (products: Product[], record: Order) => (
        <div className="flex flex-col gap-2">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-2 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 p-2 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mx-auto sm:mx-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="rounded-lg object-cover border-2 border-white"
                />
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <p className="font-bold text-gray-900 mb-1 text-xs line-clamp-2">
                  {product.name}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  Qty: {product?.quantity} | ${product?.price?.toFixed(2)}
                </p>
                <Button
                  onClick={() => handleModalOpen(product.productId, record._id)}
                  disabled={product?.isReview}
                  size="small"
                  className={
                    product?.isReview
                      ? "bg-gray-200 text-gray-500 border-0 cursor-not-allowed text-xs h-6 px-2"
                      : "bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0 hover:from-purple-600 hover:to-violet-600 font-semibold text-xs h-6 px-2"
                  }
                >
                  {product?.isReview ? "Done" : "Review"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 70,
      render: (total: number) => (
        <span className="font-bold text-purple-600 text-xs md:text-sm">
          ${total?.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => (
        <Tag
          color={status === "delivered" ? "green" : "gold"}
          className="font-semibold px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 80,
      render: (status: string) => (
        <Tag
          color={status === "paid" ? "green" : "red"}
          className="font-semibold px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 lg:py-12">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <SectionTitle heading="All Orders" />
        <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-200 p-2 md:p-4">
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "#faf5ff",
                    headerColor: "#6b21a8",
                    borderColor: "#e9d5ff",
                    rowHoverBg: "#faf5ff",
                    fontSize: 11,
                  },
                },
              }}
            >
              <Table
                columns={columns}
                dataSource={orderData?.data}
                rowKey="_id"
                loading={isLoading}
                pagination={false}
                bordered
                className="custom-orders-table"
                scroll={{ x: "max-content" }}
                size="small"
              />
            </ConfigProvider>
          </div>
        </div>
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
          <div className="mt-4 md:mt-8 flex justify-center overflow-x-auto">
            <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={orderData?.meta?.total}
              pageSize={pageSize}
              showSizeChanger={false}
              size="small"
              responsive
              showLessItems
            />
          </div>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            components: {
              Modal: {
                borderRadius: 16,
              },
              Form: {
                borderRadius: 8,
              },
              Input: {
                borderRadius: 8,
              },
              Button: {
                borderRadius: 8,
                primaryColor: "#fbbf24",
                algorithm: false,
              },
            },
          }}
        >
          <Modal
            title={
              <span className="text-xl md:text-2xl font-bold text-gray-900">
                Leave a Review
              </span>
            }
            open={isModalOpen}
            onCancel={handleModalClose}
            footer={null}
            width="90%"
            style={{ maxWidth: 600 }}
            className="mobile-modal"
            styles={{
              content: {
                borderRadius: "16px",
              },
            }}
          >
            <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
              <Form.Item
                name="star"
                label={<span className="text-gray-900 font-semibold">Rating</span>}
                rules={[{ required: true, message: "Please select a rating!" }]}
              >
                <Rate
                  value={rating}
                  onChange={setRating}
                  className="text-2xl"
                  style={{ color: "#fbbf24" }}
                />
              </Form.Item>
              <Form.Item
                name="comment"
                label={<span className="text-gray-900 font-semibold">Your Review</span>}
                rules={[{ required: true, message: "Please write a review!" }]}
              >
                <Input.TextArea
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full sm:flex-1 bg-white border-2 border-purple-500 text-purple-600 font-bold py-2 md:py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReviewLoading}
                    className="w-full sm:flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 font-bold border-0 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-400 py-2 md:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(to right, #fbbf24, #f59e0b, #f59e0b)",
                    }}
                  >
                    {isReviewLoading ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default OrderPage;
