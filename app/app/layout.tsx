'use client';
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { SessionProvider } from "next-auth/react"

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
    <SessionProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        {/* Main content wrapper */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
