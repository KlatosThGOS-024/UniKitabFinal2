import { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.node": {
          loaders: ["node-loader"],
        },
      },
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.studypool.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-005.backblazeb2.com",
        pathname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.worker\.min\.js$/,
      use: [
        {
          loader: "worker-loader",
          options: { inline: true },
        },
      ],
    });

    config.resolve.alias["pdfjs-dist"] = path.join(
      __dirname,
      "node_modules/pdfjs-dist"
    );

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/pdf.worker.min.js",
        destination: "/_next/static/chunks/pdf.worker.min.js",
      },
    ];
  },
};

export default nextConfig;
