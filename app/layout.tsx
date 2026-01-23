import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // Import Next.js Script component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodViz Admin - AI 3D Dashboard',
  description: 'Transforming food images into 3D AR experiences',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Aap yahan meta tags add kar sakte hain */}
      </head>
      <body className={inter.className}>
        {children}

        {/* 3D Model Viewer Script - Isse Preview Modal chalega */}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}