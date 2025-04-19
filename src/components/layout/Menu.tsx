
import { Button } from "@/components/ui/button";
import { X, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MenuProps {
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const Menu = ({ navigation }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Menu"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-brand-600" />
                <span className="text-xl font-bold">DevSyncSpace</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="mt-6 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-brand-100 text-brand-900"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                  onClick={() => setIsOpen(false)}
                  end={item.href === "/app"}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t pt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => window.location.href = "/login"}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
