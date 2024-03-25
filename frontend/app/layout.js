import RainbowKitAndChakraProvider from "./RainbowKitAndChakraProvider";
import Layout from "@/components/Layout";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniDeFi",
  description: "UniDeFi app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
          <title>UniDeFi</title>
      </head>
      <body className="angled-gradient">
        <RainbowKitAndChakraProvider>
          <Layout>
            {children}
          </Layout>
        </RainbowKitAndChakraProvider>
      </body>
    </html>
  );
}