import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.2.139'],
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

export default nextConfig;
