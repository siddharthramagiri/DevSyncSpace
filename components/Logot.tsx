'use client'
import { signOut } from "next-auth/react";


export function LogoutButton() {
    const handleLogout = () => {
      signOut({ callbackUrl: "/" });  // Redirects to the home page after logout
    };
  
    return (
      <button
        onClick={handleLogout}
        className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-red-600 text-white rounded-lg focus:shadow-outline hover:bg-red-700"
      >
        <span className="ml-4">Log Out</span>
      </button>
    );
  }