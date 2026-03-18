/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        dangerouslyAllowSVG: true,
        unoptimized: true,
    },
};

export default nextConfig;
