import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "An Trom An Cuop hàng đầu thế giới",
  description: "Thứ gì của bạn đều là của tôi, thứ gì của tôi vẫn là của tôi",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
      </body>
    </html>
  );
}
