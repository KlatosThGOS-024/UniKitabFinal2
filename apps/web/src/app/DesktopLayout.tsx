"use client";

import { useEffect, useState } from "react";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setIsClient(true);

    const checkDeviceWidth = () => {
      const minDesktopWidth = 540;
      setIsDesktop(window.innerWidth >= minDesktopWidth);
    };

    checkDeviceWidth();

    window.addEventListener("resize", checkDeviceWidth);

    return () => window.removeEventListener("resize", checkDeviceWidth);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div>
          <h1 style={{ fontFamily: geistSans.style.fontFamily }}>
            Desktop View Only
          </h1>
          <p style={{ fontFamily: geistSans.style.fontFamily }}>
            Please use a desktop or laptop device to access this website.
          </p>
          <p style={{ fontFamily: geistSans.style.fontFamily }}>
            Minimum screen width required: 540px
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
