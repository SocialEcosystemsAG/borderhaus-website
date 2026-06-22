/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained Server unter .next/standalone/server.js. Macht den Deploy auf
  // Node-Hosts robust, die einen Startfile bzw. ein Start-Kommando erwarten.
  output: 'standalone',
  // ccTLD-Domains (borderhaus.de/.nl/.at/.org) werden per 301 auf borderhaus.com
  // gemappt. Das geschieht idealerweise auf DNS-/Hosting-Ebene (Hostinger).
  // Pfad-Redirects als Fallback:
  async redirects() {
    return [
      // Root auf Standardsprache leiten passiert in middleware.ts.
      // Alte/erwartete Marketing-Slugs hier als 301 anhängen, sobald live.
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
