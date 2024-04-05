import RainbowKitAndChakraProvider from "./RainbowKitAndChakraProvider";
import Layout from "@/components/Layout";
import "./globals.css";
import ContextsProvider from "@/contexts/ContextsProvider.jsx";

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