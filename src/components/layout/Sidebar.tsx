
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  MessageSquare,
  Calendar,
  FileCode,
  CheckSquare,
  Video,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {useEffect, useRef, useState} from "react";
import api from "@/services/api.ts";
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const [user, setUser] = useState({})
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // @ts-ignore
  useEffect(async () => {
     const AuthUser = await api.auth.getMe()
      setUser(AuthUser)
  }, []);


  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "Teams", href: "/app/teams", icon: Users },
    { name: "Chat", href: "/app/chat", icon: MessageSquare },
    { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
    { name: "Projects", href: "/app/projects", icon: FileCode },
    { name: "Events", href: "/app/events", icon: Calendar },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex items-center justify-between border-b px-4 py-5">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-brand-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">DevSyncSpace</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
                <div
                    key={item.name}
                    onClick={() => {
                      window.location.href = item.href;
                    }}
                    className={cn(
                        "sidebar-link flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-300",
                        window.location.pathname === item.href ? "bg-gray-200 dark:bg-gray-800 font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
            ))}
          </nav>

          {/* Quick actions */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 text-red-500"
              onClick={() => {
                  localStorage.clear()
                  window.location.href = "/login"
                }
              }
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* User profile */}
          <div onClick={() => window.location.href=('/app/profile')}
              className="border-t p-4">
            <div className="flex items-center">
              <img src={user.avatar} className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.jobTitle}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
