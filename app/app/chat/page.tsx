'use client'
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Paperclip, Send, User, Users, MoreVertical, Video, Phone, ChevronRight, Smile, Code, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MyTeam, TeamMemberUser } from "@/app/api/teams/getMyTeams";
import { getMyTeams } from "@/app/api/teams/getMyTeams";
import { getTeamMembersForUser } from "@/app/api/chats/getTeamMembersForUser";
import { TeamMember, ChatMember, User as AppUser } from "@/lib/types";
import getUserId from "@/app/api/user/getUserId";

// Sample conversations data
const directMessages = [
  {
    id: "1",
    name: "Alex Johnson",
    status: "online",
    lastMessage: "What's the status on the authentication module?",
    time: "10:42 AM",
    unread: 2,
    avatar: "",
  },
  {
    id: "2",
    name: "Mira Patel",
    status: "away",
    lastMessage: "I've pushed the UI changes, can you review?",
    time: "Yesterday",
    unread: 0,
    avatar: "",
  },
  {
    id: "3",
    name: "Sam Rodriguez",
    status: "offline",
    lastMessage: "The API docs are updated now",
    time: "2 days ago",
    unread: 0,
    avatar: "",
  },
];

// Sample messages for a conversation
const sampleMessages = [
  {
    id: "1",
    sender: "Alex Johnson",
    content: "Hey! How's progress on the authentication module coming along?",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: "2",
    sender: "You",
    content: "It's going well! I've implemented the login and signup forms, just working on the password reset functionality now.",
    time: "10:32 AM",
    isMe: true,
  },
];

const Chat = () => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [activeChat, setActiveChat] = useState({
    id: "1",
    name: "Alex Johnson",
    status: "online",
    avatar: "",
    isTeam: false,
    members: [], // Add members property to avoid type errors
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [teams, setTeams] = useState<MyTeam[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const fetchMyTeams = async () => {
    try {
      const {teams, error} = await getMyTeams();
      if(error) {
        toast({variant : 'destructive' , description: error});
        return;
      }
      if (!teams) {
        toast({ variant: "destructive", description: "No teams found." });
        return;
      }
      setTeams(teams);
      toast({description : "Fetched Teams"});
      
    } catch (error) {
      toast({variant : 'destructive' , description: "Error Occured during fetching Teams"});
    }
  }

  const fetchMembers = async () => {
    const directMembers: TeamMember[] = await getTeamMembersForUser();
    setTeamMembers(directMembers);
  };

  useEffect(() => {
    const getCurrentUser = async() => {
        const { id, error } = await getUserId();
        if(!id || error) {
          return;
        }
        setCurrentUserId(id);
    }

    getCurrentUser();
  }, [])

  useEffect(() => {
    fetchMyTeams();
    fetchMembers();
  }, [])

  function getOtherMember(members: ChatMember[], currentUserId: string): AppUser | undefined {
    return members.find((m) => m.userId !== currentUserId)?.user;
  }

  function getUserStatus(user?: AppUser): "online" | "away" | "offline" {
    // Replace this with your actual presence logic
    return "offline";
  }

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "You",
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Focus the input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Simulate reply after a short delay
    setTimeout(() => {
      const replyMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: activeChat.name,
        content: "Thanks for the update. Let's discuss this further in our standup tomorrow.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages(prevMessages => [...prevMessages, replyMsg]);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChat = (chat: any, isTeam = false) => {
    setActiveChat({
      id: chat.id,
      name: chat.name,
      status: chat.status || "offline",
      avatar: chat.avatar,
      isTeam,
      members : []
    });
    // In a real app, we would fetch messages for this chat
  };

  // Render code blocks with syntax highlighting
  const renderMessage = (message: any) => {
    if (message.isCode) {
      return (
        <pre className="my-2 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-white">
          <code>{message.content}</code>
        </pre>
      );
    }
    return message.content;
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden rounded-lg border bg-background shadow-sm">
      {/* Sidebar */}
      <div className="hidden w-80 flex-shrink-0 border-r md:block">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button variant="ghost" size="icon" onClick={() => toast({ title: "New Message", description: "Create a new message or channel" })}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-8" 
              onChange={() => toast({ title: "Search", description: "This would search through your conversations" })}
            />
          </div>
        </div>
        
        <Tabs defaultValue="direct">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">
              <User className="mr-2 h-4 w-4" />
              Direct
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Users className="mr-2 h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="border-0 p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {teamMembers
                  .filter((member) => member.user && member.user.id !== currentUserId)
                  .map((member) => {
                    const user = member.user!;
                    // Using sample directMessages as the data source for direct chats
                    const userChat = directMessages.find((chat) =>
                      chat.name === user.name
                    );

                    const lastMessage = userChat
                      ? {
                          content: userChat.lastMessage,
                          createdAt: userChat.time,
                        }
                      : undefined;
                    const unreadCount = userChat?.unread ?? 0;

                    return (
                      <div
                        key={user.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent",
                          activeChat.id === userChat?.id && !activeChat.isTeam && "bg-accent"
                        )}
                        onClick={() =>
                          selectChat({
                            id: userChat?.id ?? "temp-" + user.id,
                            name: user.name || user.email,
                            avatar: user.image,
                            status: "offline", // Replace with real-time presence data if available
                            isTeam: false,
                            unread: unreadCount ?? 0,
                            lastMessage: lastMessage?.content ?? "",
                            time: lastMessage
                              ? new Date(lastMessage.createdAt).toLocaleTimeString()
                              : "",
                          })
                        }
                      >
                        <div className="flex items-center">
                          <div className="relative mr-2">
                            <Avatar>
                              <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                                "bg-gray-400" // Replace with online status color if available
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <div className="font-medium">{user.name || user.email}</div>
                              {unreadCount > 0 && (
                                <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                  {unreadCount}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {lastMessage?.content || "Start chatting"}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lastMessage
                            ? new Date(lastMessage.createdAt).toLocaleTimeString()
                            : ""}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="teams" className="border-0 p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {teams.map((team) => {
                  const lastTeamChat = team.chats?.[0]; // or use sorting logic for latest chat
                  const lastMessage = (lastTeamChat && 'messages' in lastTeamChat && Array.isArray((lastTeamChat as any).messages))
                    ? (lastTeamChat as any).messages[(lastTeamChat as any).messages.length - 1]
                    : undefined;
                  const unreadCount = 0;

                  return (
                    <div
                      key={team.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent",
                        activeChat.id === team.id && activeChat.isTeam && "bg-accent"
                      )}
                      onClick={() => selectChat(team, true)}
                    >
                      <div className="flex items-center">
                        <div className="mr-2">
                          <Avatar>
                            {team.leader?.image ? (
                              <AvatarImage src={team.leader.image} />
                            ) : (
                              <AvatarFallback>
                                <Users className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className="font-medium">{team.name}</div>
                            {unreadCount > 0 && (
                              <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                {unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {lastMessage ? lastMessage.content : `${team.members.length} members`}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {activeChat.isTeam 
                  ? <Users className="h-4 w-4" /> 
                  : getOtherMember(activeChat.members || [], currentUserId)?.name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="font-medium">{activeChat.name}</div>
              {!activeChat.isTeam && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className={cn(
                    "mr-1.5 h-1.5 w-1.5 rounded-full",
                    getUserStatus(getOtherMember(activeChat.members || [], currentUserId)) === "online"
                      ? "bg-green-500"
                      : getUserStatus(getOtherMember(activeChat.members || [], currentUserId)) === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  )} />
                  {getUserStatus(getOtherMember(activeChat.members || [], currentUserId))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => window.location.href = `/app/meeting/${activeChat.id}`}>
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Audio Call", description: "Starting audio call..." })}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Chat Info", description: "Show chat settings..." })}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.sender === currentUserId;
              return (
                <div key={message.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] rounded-lg px-4 py-2",
                    isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {!isMe && (
                      <div className="mb-1 text-xs font-medium">
                        {message.sender ?? "Unknown"}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className="mt-1 text-right text-xs opacity-70">
                      {new Date(message.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-10 border-0 bg-muted px-4 py-6 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({ title: "Emoji Picker", description: "This would open an emoji picker" })}
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({ title: "Code Snippet", description: "This would allow adding code snippets" })}
              >
                <Code className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({ title: "Attach Files", description: "This would open a file picker" })}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button onClick={handleSendMessage} disabled={newMessage.trim() === ""}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
