import type { NextConfig } from "next";

require("dotenv").config();

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL : process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
  }
};

export default nextConfig;
