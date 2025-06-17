'use client'
// import { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { 
//   Mic, 
//   MicOff, 
//   Video as VideoIcon, 
//   VideoOff, 
//   PhoneOff, 
//   MessageSquare, 
//   Users, 
//   Share2, 
//   Settings, 
//   MoreVertical,
//   ChevronRight,
//   ChevronLeft,
//   Send,
//   Paperclip,
//   Link,
//   Copy,
//   X,
//   Camera,
//   ScreenShare,
//   Layout,
//   Settings2,
//   AlertCircle
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast";

// interface Participant {
//   id: string;
//   name: string;
//   avatar?: string;
//   isMuted: boolean;
//   isVideoOff: boolean;
//   isScreenSharing: boolean;
//   isHost: boolean;
// }

// interface ChatMessage {
//   id: string;
//   senderId: string;
//   senderName: string;
//   content: string;
//   timestamp: Date;
//   isSystem?: boolean;
// }

// // Sample participants
// const sampleParticipants: Participant[] = [
//   { id: "user-1", name: "You", isMuted: false, isVideoOff: false, isScreenSharing: false, isHost: true },
//   { id: "user-2", name: "Alex Johnson", isMuted: false, isVideoOff: false, isScreenSharing: false, isHost: false },
//   { id: "user-3", name: "Taylor Kim", isMuted: true, isVideoOff: false, isScreenSharing: false, isHost: false },
//   { id: "user-4", name: "Jordan Chen", isMuted: false, isVideoOff: true, isScreenSharing: false, isHost: false },
// ];

// // Sample chat messages
// const sampleMessages: ChatMessage[] = [
//   {
//     id: "msg-1",
//     senderId: "system",
//     senderName: "System",
//     content: "Meeting started",
//     timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
//     isSystem: true,
//   },
//   {
//     id: "msg-2",
//     senderId: "user-2",
//     senderName: "Alex Johnson",
//     content: "Hey everyone, let's discuss the authentication module integration.",
//     timestamp: new Date(Date.now() - 10 * 60000), // 10 mins ago
//   },
//   {
//     id: "msg-3",
//     senderId: "user-3",
//     senderName: "Taylor Kim",
//     content: "I've completed the UI components, just waiting for the API endpoints to be ready.",
//     timestamp: new Date(Date.now() - 7 * 60000), // 7 mins ago
//   },
//   {
//     id: "msg-4",
//     senderId: "user-1",
//     senderName: "You",
//     content: "The endpoints will be ready by tomorrow. Let me know if you need anything specific in the response format.",
//     timestamp: new Date(Date.now() - 3 * 60000), // 3 mins ago
//   },
//   {
//     id: "msg-5",
//     senderId: "user-4",
//     senderName: "Jordan Chen",
//     content: "We should also consider adding multi-factor authentication in the next sprint.",
//     timestamp: new Date(Date.now() - 1 * 60000), // 1 min ago
//   },
// ];

// const MeetingRoom = () => {
//   const params = useParams<{ roomId: string }>();
//   const roomId = params?.roomId ?? "";
//   const { toast } = useToast();
  
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
//   const [participants, setParticipants] = useState<Participant[]>(sampleParticipants);
//   const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
//   const [newMessage, setNewMessage] = useState("");
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [view, setView] = useState<"grid" | "speaker" | "shared">("grid");
//   const [showSettings, setShowSettings] = useState(false);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const localVideoRef = useRef<HTMLVideoElement>(null);
  
//   // Scroll to bottom of chat when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
  
//   // Simulate accessing the user's camera and microphone
//   useEffect(() => {
//     let stream: MediaStream | null = null;
    
//     const getMedia = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
          
//           toast({
//             title: "Camera and microphone connected",
//             description: "You've successfully joined the meeting.",
//           });
//         }
//       } catch (err) {
//         console.error("Error accessing media devices:", err);
//         toast({
//           title: "Media access error",
//           description: "Could not access camera or microphone. Please check permissions.",
//           variant: "destructive",
//         });
//       }
//     };
    
//     getMedia();
    
//     // Simulate other participants joining
//     const timer = setTimeout(() => {
//       const systemMessage: ChatMessage = {
//         id: `msg-${Date.now()}`,
//         senderId: "system",
//         senderName: "System",
//         content: "Jordan Chen joined the meeting",
//         timestamp: new Date(),
//         isSystem: true,
//       };
      
//       setMessages(prev => [...prev, systemMessage]);
//     }, 3000);
    
//     // Cleanup function to stop the stream
//     return () => {
//       clearTimeout(timer);
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [toast]);
  
//   const handleSendMessage = () => {
//     if (newMessage.trim() === "") return;
    
//     const message: ChatMessage = {
//       id: `msg-${Date.now()}`,
//       senderId: "user-1", // Current user
//       senderName: "You",
//       content: newMessage.trim(),
//       timestamp: new Date(),
//     };
    
//     setMessages([...messages, message]);
//     setNewMessage("");
    
//     // Simulate reply from another participant after a delay
//     setTimeout(() => {
//       const replies = [
//         "That's a good point!",
//         "I agree with that approach.",
//         "Let me check and get back to you.",
//         "Can you share more details about that?",
//         "I think we should discuss this further in our next sprint planning.",
//       ];
      
//       const randomParticipant = participants.find(p => p.id !== "user-1");
      
//       if (randomParticipant) {
//         const reply: ChatMessage = {
//           id: `msg-${Date.now()}`,
//           senderId: randomParticipant.id,
//           senderName: randomParticipant.name,
//           content: replies[Math.floor(Math.random() * replies.length)],
//           timestamp: new Date(),
//         };
        
//         setMessages(prev => [...prev, reply]);
//       }
//     }, 5000 + Math.random() * 5000); // Random delay between 5-10 seconds
//   };
  
//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     setParticipants(
//       participants.map(p =>
//         p.id === "user-1" ? { ...p, isMuted: !isMuted } : p
//       )
//     );
    
//     toast({
//       title: isMuted ? "Microphone unmuted" : "Microphone muted",
//       description: isMuted ? "Others can now hear you" : "Others can't hear you",
//     });
//   };
  
//   const toggleVideo = () => {
//     setIsVideoOff(!isVideoOff);
//     setParticipants(
//       participants.map(p =>
//         p.id === "user-1" ? { ...p, isVideoOff: !isVideoOff } : p
//       )
//     );
    
//     toast({
//       title: isVideoOff ? "Camera turned on" : "Camera turned off",
//       description: isVideoOff ? "Others can now see you" : "Others can't see you",
//     });
//   };
  
//   const toggleScreenShare = () => {
//     if (isScreenSharing) {
//       setIsScreenSharing(false);
//       setView("grid");
//       setParticipants(
//         participants.map(p =>
//           p.id === "user-1" ? { ...p, isScreenSharing: false } : p
//         )
//       );
      
//       toast({
//         title: "Screen sharing stopped",
//         description: "You're no longer sharing your screen",
//       });
//     } else {
//       // Simulate screen sharing
//       setIsScreenSharing(true);
//       setView("shared");
//       setParticipants(
//         participants.map(p =>
//           p.id === "user-1" ? { ...p, isScreenSharing: true } : p
//         )
//       );
      
//       toast({
//         title: "Screen sharing started",
//         description: "You're now sharing your screen with everyone",
//       });
//     }
//   };
  
//   const endMeeting = () => {
//     // Ask for confirmation before ending the meeting
//     if (window.confirm("Are you sure you want to leave the meeting?")) {
//       // Clean up any media streams
//       if (localVideoRef.current && localVideoRef.current.srcObject) {
//         const stream = localVideoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach(track => track.stop());
//       }
      
//       toast({
//         title: "Meeting ended",
//         description: "You've left the meeting",
//       });
      
//       // Navigate back to the events page
//     //   navigate("/app/events");
//     }
//   };
  
//   const copyMeetingLink = () => {
//     const meetingLink = `${window.location.origin}/app/meeting/${roomId}`;
//     navigator.clipboard.writeText(meetingLink);
    
//     toast({
//       title: "Meeting link copied",
//       description: "Link copied to clipboard",
//     });
//   };
  
//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };
  
//   return (
//     <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
//       {/* Main content area */}
//       <div className="relative flex flex-1 flex-col bg-black">
//         {/* Video grid */}
//         <div className="flex-1 overflow-hidden p-2">
//           <div 
//             className={cn(
//               "grid h-full gap-2",
//               view === "grid" && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
//               view === "speaker" && "grid-cols-1",
//               view === "shared" && "grid-cols-[3fr_1fr]"
//             )}
//           >
//             {view === "shared" && (
//               <>
//                 {/* Screen share takes up the main area */}
//                 <div className="relative flex items-center justify-center rounded bg-gray-800">
//                   <div className="flex h-full w-full items-center justify-center rounded">
//                     <img
//                       src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200"
//                       alt="Shared screen"
//                       className="h-full w-full object-contain"
//                     />
//                   </div>
//                   <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
//                     You are sharing your screen
//                   </div>
//                 </div>
                
//                 {/* Participant videos in a sidebar */}
//                 <div className="flex flex-col gap-2 overflow-auto">
//                   {participants.map((participant) => (
//                     <div key={participant.id} className="relative aspect-video rounded bg-gray-800">
//                       {participant.id === "user-1" ? (
//                         <video
//                           ref={localVideoRef}
//                           autoPlay
//                           muted
//                           playsInline
//                           className={cn(
//                             "h-full w-full rounded object-cover",
//                             isVideoOff && "hidden"
//                           )}
//                         />
//                       ) : (
//                         participant.isVideoOff ? (
//                           <div className="flex h-full w-full items-center justify-center">
//                             <Avatar className="h-20 w-20">
//                               <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
//                             </Avatar>
//                           </div>
//                         ) : (
//                           <img
//                             src={`https://randomuser.me/api/portraits/${participant.id === "user-2" ? "men" : "women"}/${parseInt(participant.id.split("-")[1]) + 20}.jpg`}
//                             alt={participant.name}
//                             className="h-full w-full rounded object-cover"
//                           />
//                         )
//                       )}
                      
//                       {/* Participant name and status */}
//                       <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded bg-black/50 px-2 py-1">
//                         <span className="text-xs text-white">
//                           {participant.id === "user-1" ? "You" : participant.name}
//                         </span>
//                         {participant.isMuted && (
//                           <MicOff className="h-3 w-3 text-red-500" />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
            
//             {view !== "shared" && participants.map((participant) => (
//               <div
//                 key={participant.id}
//                 className={cn(
//                   "relative aspect-video rounded bg-gray-800",
//                   view === "speaker" && participant.id === "user-2" && "col-span-full row-span-2"
//                 )}
//               >
//                 {participant.id === "user-1" ? (
//                   <video
//                     ref={localVideoRef}
//                     autoPlay
//                     muted
//                     playsInline
//                     className={cn(
//                       "h-full w-full rounded object-cover",
//                       isVideoOff && "hidden"
//                     )}
//                   />
//                 ) : (
//                   participant.isVideoOff ? (
//                     <div className="flex h-full w-full items-center justify-center">
//                       <Avatar className="h-20 w-20">
//                         <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                     </div>
//                   ) : (
//                     <img
//                       src={`https://randomuser.me/api/portraits/${participant.id === "user-2" ? "men" : "women"}/${parseInt(participant.id.split("-")[1]) + 20}.jpg`}
//                       alt={participant.name}
//                       className="h-full w-full rounded object-cover"
//                     />
//                   )
//                 )}
                
//                 {/* Participant name and status */}
//                 <div className="absolute bottom-2 left-2 flex items-center space-x-1 rounded bg-black/50 px-2 py-1">
//                   <span className="text-xs text-white">
//                     {participant.id === "user-1" ? "You" : participant.name}
//                   </span>
//                   {participant.isMuted && (
//                     <MicOff className="h-3 w-3 text-red-500" />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Meeting controls */}
//         <div className="z-10 flex justify-between border-t border-gray-800 bg-gray-900 p-4">
//           <div className="flex items-center space-x-2">
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="h-10 w-10 rounded-full hover:bg-gray-800"
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             >
//               {isSidebarOpen ? <ChevronRight className="h-5 w-5 text-white" /> : <ChevronLeft className="h-5 w-5 text-white" />}
//             </Button>
//             <div className="text-sm text-white">
//               <div className="font-medium">{roomId}</div>
//               <div className="text-xs text-gray-400">Meeting ID</div>
//             </div>
//           </div>
          
//           <div className="flex space-x-2">
//             <Button 
//               variant={isMuted ? "destructive" : "outline"} 
//               size="icon" 
//               className="h-10 w-10 rounded-full"
//               onClick={toggleMute}
//             >
//               {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
//             </Button>
//             <Button 
//               variant={isVideoOff ? "destructive" : "outline"} 
//               size="icon" 
//               className="h-10 w-10 rounded-full"
//               onClick={toggleVideo}
//             >
//               {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
//             </Button>
//             <Button 
//               variant={isScreenSharing ? "secondary" : "outline"} 
//               size="icon" 
//               className="h-10 w-10 rounded-full"
//               onClick={toggleScreenShare}
//             >
//               <Share2 className="h-5 w-5" />
//             </Button>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button 
//                   variant="outline" 
//                   size="icon" 
//                   className="h-10 w-10 rounded-full"
//                 >
//                   <MoreVertical className="h-5 w-5" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-80" align="end">
//                 <div className="grid gap-4">
//                   <div className="space-y-2">
//                     <h4 className="font-medium leading-none">Meeting Options</h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       <Button 
//                         variant="outline" 
//                         className="flex h-auto flex-col items-center justify-center space-y-1 p-2"
//                         onClick={() => setView("grid")}
//                       >
//                         <Layout className="h-5 w-5" />
//                         <span className="text-xs">Grid View</span>
//                       </Button>
//                       <Button 
//                         variant="outline" 
//                         className="flex h-auto flex-col items-center justify-center space-y-1 p-2"
//                         onClick={() => setView("speaker")}
//                       >
//                         <Users className="h-5 w-5" />
//                         <span className="text-xs">Speaker View</span>
//                       </Button>
//                       <Button 
//                         variant="outline" 
//                         className="flex h-auto flex-col items-center justify-center space-y-1 p-2"
//                         onClick={() => setShowSettings(!showSettings)}
//                       >
//                         <Settings2 className="h-5 w-5" />
//                         <span className="text-xs">Settings</span>
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <h4 className="font-medium leading-none">Invite Others</h4>
//                     <div className="flex space-x-2">
//                       <Input 
//                         value={`${window.location.origin}/app/meeting/${roomId}`}
//                         readOnly
//                         className="flex-1"
//                       />
//                       <Button 
//                         variant="outline" 
//                         size="icon"
//                         onClick={copyMeetingLink}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <Button 
//                       variant="outline" 
//                       className="w-full"
//                       onClick={() => {
//                         toast({
//                           title: "Invitation sent",
//                           description: "Meeting invitation has been sent to the team",
//                         });
//                       }}
//                     >
//                       <Users className="mr-2 h-4 w-4" />
//                       Invite Team Members
//                     </Button>
//                   </div>
//                 </div>
//               </PopoverContent>
//             </Popover>
//             <Button 
//               variant="destructive" 
//               size="icon" 
//               className="h-10 w-10 rounded-full"
//               onClick={endMeeting}
//             >
//               <PhoneOff className="h-5 w-5" />
//             </Button>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <Button 
//               variant={activeTab === "chat" ? "secondary" : "outline"} 
//               size="sm" 
//               className="h-10 rounded-full"
//               onClick={() => {
//                 setActiveTab("chat");
//                 setIsSidebarOpen(true);
//               }}
//             >
//               <MessageSquare className="mr-2 h-4 w-4" />
//               Chat
//             </Button>
//             <Button 
//               variant={activeTab === "participants" ? "secondary" : "outline"}
//               size="sm" 
//               className="h-10 rounded-full"
//               onClick={() => {
//                 setActiveTab("participants");
//                 setIsSidebarOpen(true);
//               }}
//             >
//               <Users className="mr-2 h-4 w-4" />
//               Participants ({participants.length})
//             </Button>
//           </div>
//         </div>
        
//         {/* Settings modal */}
//         {showSettings && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50" onClick={() => setShowSettings(false)}>
//             <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
//               <div className="flex items-center justify-between border-b p-4">
//                 <h2 className="text-lg font-medium">Meeting Settings</h2>
//                 <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <CardContent className="space-y-4 p-4">
//                 <div className="space-y-2">
//                   <Label>Audio Settings</Label>
//                   <div className="space-y-1">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Microphone</span>
//                       <Select>
//                         <SelectTrigger className="w-[220px]">
//                           <SelectValue placeholder="Default Microphone" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="default">Default Microphone</SelectItem>
//                           <SelectItem value="headset">Headset Microphone</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Speaker</span>
//                       <Select>
//                         <SelectTrigger className="w-[220px]">
//                           <SelectValue placeholder="Default Speaker" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="default">Default Speaker</SelectItem>
//                           <SelectItem value="headphones">Headphones</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
                
//                 <Separator />
                
//                 <div className="space-y-2">
//                   <Label>Video Settings</Label>
//                   <div className="space-y-1">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Camera</span>
//                       <Select>
//                         <SelectTrigger className="w-[220px]">
//                           <SelectValue placeholder="Default Camera" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="default">Default Camera</SelectItem>
//                           <SelectItem value="external">External Webcam</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">Background</span>
//                       <Select>
//                         <SelectTrigger className="w-[220px]">
//                           <SelectValue placeholder="None" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="none">None</SelectItem>
//                           <SelectItem value="blur">Blur</SelectItem>
//                           <SelectItem value="office">Office</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                 </div>
                
//                 <Separator />
                
//                 <div className="space-y-2">
//                   <Label>General Settings</Label>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="auto-mute" />
//                       <Label htmlFor="auto-mute">Mute microphone when joining</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="auto-camera" />
//                       <Label htmlFor="auto-camera">Turn off camera when joining</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox id="noise-cancel" checked />
//                       <Label htmlFor="noise-cancel">Enable noise cancellation</Label>
//                     </div>
//                   </div>
//                 </div>
                
//                 <Button className="w-full">Save Settings</Button>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
      
//       {/* Sidebar */}
//       <div
//         className={cn(
//           "w-80 flex-shrink-0 border-l border-gray-200 bg-white transition-all duration-300 ease-in-out",
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         )}
//       >
//         <Tabs value={activeTab} className="h-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="chat" onClick={() => setActiveTab("chat")}>
//               <MessageSquare className="mr-2 h-4 w-4" />
//               Chat
//             </TabsTrigger>
//             <TabsTrigger value="participants" onClick={() => setActiveTab("participants")}>
//               <Users className="mr-2 h-4 w-4" />
//               Participants
//             </TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="chat" className="flex h-[calc(100%-48px)] flex-col">
//             <div className="flex-1 overflow-y-auto p-4">
//               <div className="space-y-4">
//                 {messages.map((message) => (
//                   <div key={message.id} className={cn(
//                     "flex",
//                     message.isSystem ? "justify-center" : message.senderId === "user-1" ? "justify-end" : "justify-start"
//                   )}>
//                     {message.isSystem ? (
//                       <div className="rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-500">
//                         {message.content}
//                       </div>
//                     ) : (
//                       <div className={cn(
//                         "max-w-[85%] rounded-lg px-3 py-2",
//                         message.senderId === "user-1"
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-100 text-gray-900"
//                       )}>
//                         {message.senderId !== "user-1" && (
//                           <div className="mb-1 text-xs font-medium">
//                             {message.senderName}
//                           </div>
//                         )}
//                         <div className="text-sm">{message.content}</div>
//                         <div className="mt-1 text-right text-xs opacity-70">
//                           {formatTime(message.timestamp)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>
//             </div>
            
//             <div className="border-t p-4">
//               <div className="flex space-x-2">
//                 <Input
//                   placeholder="Type a message..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                   className="flex-1"
//                 />
//                 <Button 
//                   size="icon" 
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                 >
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="mt-2 flex justify-between">
//                 <Button variant="ghost" size="sm" className="h-8 text-xs">
//                   <Paperclip className="mr-1 h-3 w-3" />
//                   Attach
//                 </Button>
//                 <Button variant="ghost" size="sm" className="h-8 text-xs">
//                   <Link className="mr-1 h-3 w-3" />
//                   Share Link
//                 </Button>
//               </div>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="participants" className="h-[calc(100%-48px)] overflow-y-auto p-4">
//             <div className="mb-4">
//               <h3 className="text-lg font-medium">In this meeting ({participants.length})</h3>
//             </div>
            
//             <div className="space-y-2">
//               {participants.map((participant) => (
//                 <div key={participant.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100">
//                   <div className="flex items-center">
//                     <Avatar className="mr-2 h-10 w-10">
//                       <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
//                       {participant.id !== "user-1" && (
//                         <AvatarImage src={`https://randomuser.me/api/portraits/${participant.id === "user-2" ? "men" : "women"}/${parseInt(participant.id.split("-")[1]) + 20}.jpg`} />
//                       )}
//                     </Avatar>
//                     <div>
//                       <div className="font-medium">
//                         {participant.id === "user-1" ? `${participant.name} (You)` : participant.name}
//                         {participant.isHost && (
//                           <Badge variant="outline" className="ml-2 border-blue-500 text-xs text-blue-500">
//                             Host
//                           </Badge>
//                         )}
//                       </div>
//                       <div className="flex items-center text-xs text-gray-500">
//                         {participant.isMuted ? (
//                           <MicOff className="mr-1 h-3 w-3 text-red-500" />
//                         ) : (
//                           <Mic className="mr-1 h-3 w-3 text-green-500" />
//                         )}
//                         {participant.isVideoOff ? (
//                           <VideoOff className="ml-2 mr-1 h-3 w-3 text-red-500" />
//                         ) : (
//                           <VideoIcon className="ml-2 mr-1 h-3 w-3 text-green-500" />
//                         )}
//                         {participant.isScreenSharing && (
//                           <Share2 className="ml-2 mr-1 h-3 w-3 text-blue-500" />
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   {participant.id !== "user-1" && (
//                     <div>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="h-8 w-8"
//                         onClick={() => {
//                           toast({
//                             title: `Private chat with ${participant.name}`,
//                             description: "This would open a private chat in a real application",
//                           });
//                         }}
//                       >
//                         <MessageSquare className="h-4 w-4" />
//                       </Button>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="h-8 w-8"
//                         onClick={() => {
//                           toast({
//                             title: `Mute ${participant.name}`,
//                             description: "Only the host can mute participants in a real application",
//                           });
//                         }}
//                       >
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-6 space-y-2">
//               <h3 className="text-sm font-medium">Invite others</h3>
//               <div className="flex space-x-2">
//                 <Input 
//                   value={`${window.location.origin}/app/meeting/${roomId}`}
//                   readOnly
//                   className="flex-1 text-xs"
//                 />
//                 <Button 
//                   variant="outline" 
//                   size="icon"
//                   onClick={copyMeetingLink}
//                 >
//                   <Copy className="h-4 w-4" />
//                 </Button>
//               </div>
//               <Button 
//                 variant="outline" 
//                 className="w-full"
//                 onClick={() => {
//                   toast({
//                     title: "Invitation sent",
//                     description: "Meeting invitation has been sent to the team",
//                   });
//                 }}
//               >
//                 <Users className="mr-2 h-4 w-4" />
//                 Invite Team Members
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// // Components to fix TypeScript errors
// const Checkbox = (props: any) => {
//   return (
//     <input
//       type="checkbox"
//       className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
//       {...props}
//     />
//   );
// };

// const Select = (props: any) => {
//   return <div {...props} />;
// };

// const SelectTrigger = (props: any) => {
//   return (
//     <Button variant="outline" className={props.className}>
//       {props.children}
//       <ChevronRight className="ml-auto h-4 w-4" />
//     </Button>
//   );
// };

// const SelectContent = (props: any) => {
//   return (
//     <div className="absolute right-0 z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
//       {props.children}
//     </div>
//   );
// };

// const SelectItem = (props: any) => {
//   return (
//     <div
//       className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
//       onClick={() => {
//         if (props.onValueChange) {
//           props.onValueChange(props.value);
//         }
//       }}
//     >
//       {props.children}
//     </div>
//   );
// };

// const SelectValue = (props: any) => {
//   return <span>{props.placeholder}</span>;
// };

// export default MeetingRoom;


function MeetingRoom() {
  return (
    <>
      <div className='m-10'>
        <h2>
          MeetingRoom is under Development
        </h2>
      </div>
    </>
  )
}

export default MeetingRoom