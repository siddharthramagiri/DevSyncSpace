'use client'
import { Bell, Menu, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const TopNav = ({ sidebarOpen, setSidebarOpen }: TopNavProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedUser, setLoggedUser] = useState("")

  const router = useRouter();

  // @ts-ignore
  // useEffect(async () => {
  //   const AuthUser = await api.auth.getMe()
  //   setLoggedUser(AuthUser._id)
  // }, []);


  const startMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    toast({
      title: "Meeting created",
      description: "Starting a new meeting room",
    });
    router.push('/app/meeting')
    // window.location.href = `/app/meeting/${roomId}`;
  };

  return (
      <div className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 relative">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              className="mr-2 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden md:block relative">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="Search developers..."
                    className="w-64 rounded-md border border-input bg-background pl-8"
                />
              </div>

              {/* 🧠 Dropdown with matched users */}
              {showDropdown && results.length > 0 && (
                  <div className="absolute z-10 mt-1 w-64 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((user) => (
                        <div onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            loggedUser === user._id? router.push('/dashboard/#profile') :
                            router.push("/dashboard/#profile");
                            // window.location.href=`/app/profile/${user._id}`
                          }
                        }
                            key={user._id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <img
                              src={user.avatar}
                              className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                className="hidden gap-1 md:flex"
                onClick={startMeeting}
            >
              <Video className="h-4 w-4" />
              Start Meeting
            </Button>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </div>
        </div>
      </div>
  );
};

export default TopNav;
