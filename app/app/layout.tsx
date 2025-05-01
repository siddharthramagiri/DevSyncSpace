'use client';

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1">
        <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>{children}</main>
      </div>
    </div>
  );
}
