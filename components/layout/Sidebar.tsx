import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  Home,
  Users,
  MessageSquare,
  Calendar,
  FileCode,
  CheckSquare,
  LogOut,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: Home },
    { name: "Teams", href: "/app/teams", icon: Users },
    { name: "Chat", href: "/app/chat", icon: MessageSquare },
    { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
    { name: "Projects", href: "/app/projects", icon: FileCode },
    { name: "Events", href: "/app/events", icon: Calendar },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  const handleNavigation = (href: string) => {
    if (window.innerWidth < 768) {
      setOpen(false);
      setTimeout(() => {
        router.push(href);
      }, 150); // Let sidebar close before routing
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-5">
            <span className="text-xl font-bold text-gray-900 dark:text-white">DevSyncSpace</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "sidebar-link flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
                  pathname === item.href
                    ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            ))}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-2 text-red-500"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
