// src/app/layout.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/global.css";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <SessionProvider>
          <Header />
          <main className="flex-fill">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
