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

const teamChannels = [
  {
    id: "1",
    name: "Frontend Team",
    lastMessage: "Alex Johnson: Let's discuss the new dashboard layout",
    time: "11:15 AM",
    unread: 5,
    avatar: "",
  },
  {
    id: "2",
    name: "Project Alpha",
    lastMessage: "Mira Patel: The client approved the designs",
    time: "Yesterday",
    unread: 0,
    avatar: "",
  },
  {
    id: "3",
    name: "Backend Team",
    lastMessage: "Jordan Chen: We need to optimize the database queries",
    time: "3 days ago",
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
  {
    id: "3",
    sender: "Alex Johnson",
    content: "Great! Do you think we'll be able to finish it by the end of the week?",
    time: "10:35 AM",
    isMe: false,
  },
  {
    id: "4",
    sender: "You",
    content: "Yes, I should have it ready for testing by Thursday.",
    time: "10:36 AM",
    isMe: true,
  },
  {
    id: "5",
    sender: "Alex Johnson",
    content: "Perfect! By the way, have you seen this code snippet for the token refresh logic?",
    time: "10:38 AM",
    isMe: false,
  },
  {
    id: "6",
    sender: "Alex Johnson",
    content: "```javascript\nconst refreshToken = async () => {\n  try {\n    const response = await fetch('/api/refresh', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        refreshToken: localStorage.getItem('refreshToken')\n      })\n    });\n    \n    const data = await response.json();\n    localStorage.setItem('accessToken', data.accessToken);\n    return data.accessToken;\n  } catch (error) {\n    console.error('Failed to refresh token:', error);\n    // Handle error - redirect to login, etc.\n  }\n};\n```",
    time: "10:39 AM",
    isMe: false,
    isCode: true,
  },
  {
    id: "7",
    sender: "You",
    content: "This looks good! I'll incorporate it into the auth service. Thanks for sharing.",
    time: "10:40 AM",
    isMe: true,
  },
  {
    id: "8",
    sender: "Alex Johnson",
    content: "No problem! What's the status on the authentication module?",
    time: "10:42 AM",
    isMe: false,
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
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
                {directMessages.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent",
                      activeChat.id === chat.id && !activeChat.isTeam && "bg-accent"
                    )}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-2">
                        <Avatar>
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span 
                          className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                            chat.status === "online" ? "bg-green-500" :
                            chat.status === "away" ? "bg-yellow-500" : 
                            "bg-gray-400"
                          )} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium">{chat.name}</div>
                          {chat.unread > 0 && (
                            <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {chat.lastMessage}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chat.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="teams" className="border-0 p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {teamChannels.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent",
                      activeChat.id === chat.id && activeChat.isTeam && "bg-accent"
                    )}
                    onClick={() => selectChat(chat, true)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        <Avatar>
                          <AvatarFallback>
                            <Users className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="font-medium">{chat.name}</div>
                          {chat.unread > 0 && (
                            <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {chat.lastMessage}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chat.time}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {activeChat.isTeam ? <Users className="h-4 w-4" /> : activeChat.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="font-medium">{activeChat.name}</div>
              {!activeChat.isTeam && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <div 
                    className={cn(
                      "mr-1.5 h-1.5 w-1.5 rounded-full",
                      activeChat.status === "online" ? "bg-green-500" :
                      activeChat.status === "away" ? "bg-yellow-500" : 
                      "bg-gray-400"
                    )} 
                  />
                  {activeChat.status === "online" ? "Online" : 
                   activeChat.status === "away" ? "Away" : "Offline"}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/app/meeting/123456"}
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toast({ title: "Audio Call", description: "This would start an audio call" })}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toast({ title: "Chat Info", description: "This would show chat information and settings" })}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-2",
                    message.isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {!message.isMe && (
                    <div className="mb-1 text-xs font-medium">{message.sender}</div>
                  )}
                  <div className={message.isCode ? "" : "text-sm"}>
                    {renderMessage(message)}
                  </div>
                  <div className="mt-1 text-right text-xs opacity-70">
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
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
