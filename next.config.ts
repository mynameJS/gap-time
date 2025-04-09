import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
};

export default withBundleAnalyzer({
  ...nextConfig,
  enabled: process.env.ANALYZE === 'true',
});
