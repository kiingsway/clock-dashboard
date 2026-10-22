import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.2.139'],
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  async headers() {
    return [
      {
        // Os nomes dos ícones não têm hash, então o cache é longo mas não `immutable`.
        source: '/icons/weather/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
