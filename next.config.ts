import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
};

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundle(nextConfig);
