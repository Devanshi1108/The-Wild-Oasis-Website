/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arfnmdcddoagvfcwvksb.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },
  // output: "export",
};
//https://arfnmdcddoagvfcwvksb.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
export default nextConfig;
