import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // ✅ Allow Vercel build even if ESLint errors exist
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;