import RainbowKitAndChakraProvider from "./RainbowKitAndChakraProvider";
import Layout from "@/components/Layout";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextsProvider from "@/contexts/ContextsProvider.jsx";


//const inter = Inter({ subsets: ["latin"] });

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
            <ContextsProvider>
              {children}
            </ContextsProvider>
          </Layout>
        </RainbowKitAndChakraProvider>
      </body>
    </html>
  );
}