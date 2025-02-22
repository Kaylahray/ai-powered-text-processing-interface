import type { NextConfig } from "next";

// next.config.js
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Only include headers required by specific trials
          {
            key: "Origin-Trial",
            // Use proper formatting for multiple tokens
            value: [
              process.env.ORIGIN_TRIAL_1,
              process.env.ORIGIN_TRIAL_2,
              process.env.ORIGIN_TRIAL_3,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
