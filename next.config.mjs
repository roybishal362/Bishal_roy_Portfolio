/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The old 1-page résumé was retired in Sep 2026; keep any shared link working.
  async redirects() {
    return [{ source: "/Bishal_Roy_Resume_1page.pdf", destination: "/Bishal_Roy_Resume.pdf", permanent: true }];
  },
};

export default nextConfig;
