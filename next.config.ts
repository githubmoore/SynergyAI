import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'app.leonardo.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'playgroundai.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'runwayml.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.anthropic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openai.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'docs.midjourney.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.perplexity.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'poe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mistral.ai',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
