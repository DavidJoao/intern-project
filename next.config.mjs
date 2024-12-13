/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["boothgrading-bucket.s3.us-west-1.amazonaws.com"],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'boothgrading-bucket.s3.us-west-1.amazonaws.com',
                port: ''
            }
        ]
    }
};

export default nextConfig;
