import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from 'next';
import { SettingsProvider } from "@/contexts/SettingsContext";

export const metadata: Metadata = {
    title: "FoodViz Admin",
    description: "Food Visualization System Admin Dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-50 min-h-screen">
                <SettingsProvider>
                    <Navbar />
                    {children}
                </SettingsProvider>
            </body>
        </html>
    );
}
