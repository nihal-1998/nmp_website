import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      // "nihal-nmp-bucket.s3.eu-north-1.amazonaws.com",
      // "nmp-nihal-bucket.s3.eu-north-1.amazonaws.com",
      "nihal-nmp-bucket.s3.eu-north-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
