'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  ChevronRight, 
  MoreHorizontal, 
  Star, 
  Trash,
  AlertCircle,
  CalendarDays,
  FileText,
  Bell
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  type: "meeting" | "deadline" | "reminder" | "workshop";
  attendees: Attendee[];
  isRecurring: boolean;
  recurrencePattern?: string;
  project?: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "accepted" | "declined" | "pending";
}

// Sample data
const sampleEvents: Event[] = [
  {
    id: "event-1",
    title: "Daily Standup",
    description: "Daily team standup to discuss progress, blockers, and plans.",
    startTime: "09:30",
    endTime: "09:45",
    date: new Date().toISOString().split("T")[0], // Today
    location: "Google Meet",
    type: "meeting",
    attendees: [
      { id: "user-1", name: "Alex Johnson", email: "alex@example.com", status: "accepted" },
      { id: "user-2", name: "Taylor Kim", email: "taylor@example.com", status: "accepted" },
      { id: "user-3", name: "Jordan Chen", email: "jordan@example.com", status: "accepted" },
      { id: "user-4", name: "Mira Patel", email: "mira@example.com", status: "pending" },
    ],
    isRecurring: true,
    recurrencePattern: "Weekdays",
    project: "E-commerce Platform",
  },
  {
    id: "event-2",
    title: "Frontend Planning Session",
    description: "Plan the next sprint's frontend tasks and discuss new features.",
    startTime: "14:00",
    endTime: "15:30",
    date: new Date().toISOString().split("T")[0], // Today
    location: "Conference Room A",
    type: "meeting",
    attendees: [
      { id: "user-1", name: "Alex Johnson", email: "alex@example.com", status: "accepted" },
      { id: "user-2", name: "Taylor Kim", email: "taylor@example.com", status: "accepted" },
      { id: "user-5", name: "Sam Rodriguez", email: "sam@example.com", status: "declined" },
    ],
    isRecurring: false,
    project: "E-commerce Platform",
  },
  {
    id: "event-3",
    title: "API Integration Deadline",
    description: "Complete the integration with payment processing API.",
    startTime: "18:00",
    endTime: "18:00",
    date: addDays(new Date(), 1).toISOString().split("T")[0], // Tomorrow
    location: "",
    type: "deadline",
    attendees: [
      { id: "user-3", name: "Jordan Chen", email: "jordan@example.com", status: "accepted" },
      { id: "user-6", name: "Riley Singh", email: "riley@example.com", status: "accepted" },
    ],
    isRecurring: false,
    project: "Mobile Banking App",
  },
  {
    id: "event-4",
    title: "Backend Architecture Workshop",
    description: "Workshop on optimizing the backend architecture and database schema.",
    startTime: "10:00",
    endTime: "12:30",
    date: addDays(new Date(), 2).toISOString().split("T")[0], // Day after tomorrow
    location: "Conference Room B",
    type: "workshop",
    attendees: [
      { id: "user-3", name: "Jordan Chen", email: "jordan@example.com", status: "accepted" },
      { id: "user-6", name: "Riley Singh", email: "riley@example.com", status: "accepted" },
      { id: "user-7", name: "Casey Williams", email: "casey@example.com", status: "pending" },
      { id: "user-9", name: "Jamie Garcia", email: "jamie@example.com", status: "pending" },
    ],
    isRecurring: false,
    project: "Analytics Dashboard",
  },
  {
    id: "event-5",
    title: "Client Demo",
    description: "Present the latest features to the client and gather feedback.",
    startTime: "15:00",
    endTime: "16:00",
    date: addDays(new Date(), 3).toISOString().split("T")[0], // 3 days from now
    location: "Zoom",
    type: "meeting",
    attendees: [
      { id: "user-1", name: "Alex Johnson", email: "alex@example.com", status: "accepted" },
      { id: "user-3", name: "Jordan Chen", email: "jordan@example.com", status: "accepted" },
      { id: "user-4", name: "Mira Patel", email: "mira@example.com", status: "pending" },
    ],
    isRecurring: false,
    project: "E-commerce Platform",
  },
  {
    id: "event-6",
    title: "Weekly Team Meeting",
    description: "Discuss project progress, roadblocks, and upcoming milestones.",
    startTime: "13:00",
    endTime: "14:00",
    date: addDays(new Date(), 4).toISOString().split("T")[0], // 4 days from now
    location: "Google Meet",
    type: "meeting",
    attendees: [
      { id: "user-1", name: "Alex Johnson", email: "alex@example.com", status: "accepted" },
      { id: "user-2", name: "Taylor Kim", email: "taylor@example.com", status: "accepted" },
      { id: "user-3", name: "Jordan Chen", email: "jordan@example.com", status: "accepted" },
      { id: "user-4", name: "Mira Patel", email: "mira@example.com", status: "accepted" },
      { id: "user-5", name: "Sam Rodriguez", email: "sam@example.com", status: "accepted" },
      { id: "user-6", name: "Riley Singh", email: "riley@example.com", status: "pending" },
    ],
    isRecurring: true,
    recurrencePattern: "Weekly",
    project: "All Projects",
  },
];

// Team members for attendee selection
const teamMembers = [
  { id: "user-1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "user-2", name: "Taylor Kim", email: "taylor@example.com" },
  { id: "user-3", name: "Jordan Chen", email: "jordan@example.com" },
  { id: "user-4", name: "Mira Patel", email: "mira@example.com" },
  { id: "user-5", name: "Sam Rodriguez", email: "sam@example.com" },
  { id: "user-6", name: "Riley Singh", email: "riley@example.com" },
  { id: "user-7", name: "Casey Williams", email: "casey@example.com" },
  { id: "user-8", name: "Morgan Lee", email: "morgan@example.com" },
  { id: "user-9", name: "Jamie Garcia", email: "jamie@example.com" },
];

// Projects list
const projects = [
  "All Projects",
  "E-commerce Platform",
  "Mobile Banking App",
  "Analytics Dashboard",
];

// Event types
const eventTypes = [
  { value: "meeting", label: "Meeting" },
  { value: "deadline", label: "Deadline" },
  { value: "reminder", label: "Reminder" },
  { value: "workshop", label: "Workshop" },
];

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [activeView, setActiveView] = useState<"upcoming" | "calendar" | "all">("upcoming");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("All Projects");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    type: "meeting",
    attendees: [],
    isRecurring: false,
    project: "All Projects",
  });
  const [newEventAttendees, setNewEventAttendees] = useState<string[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Filter events based on various criteria
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject =
      selectedProject === "All Projects" || event.project === selectedProject;
    
    const matchesDate =
      !selectedDate ||
      isSameDay(parseISO(event.date), selectedDate);
    
    return matchesSearch && matchesProject && (activeView !== "calendar" || matchesDate);
  });

  // Group events by date for the upcoming view
  const groupEventsByDate = () => {
    const groups: { [key: string]: Event[] } = {};
    
    filteredEvents.forEach((event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });
    
    // Sort dates
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, events]) => ({
        date,
        events: events.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }));
  };

  const groupedEvents = groupEventsByDate();

  // Handle event creation
  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingEvent(true);
    
    // Prepare attendees
    const attendees = newEventAttendees.map((attendeeId) => {
      const member = teamMembers.find((m) => m.id === attendeeId);
      return {
        id: attendeeId,
        name: member?.name || "Unknown",
        email: member?.email || "",
        status: "pending" as const,
      };
    });
    
    // Simulate event creation
    setTimeout(() => {
      const createdEvent: Event = {
        id: `event-${Date.now()}`,
        title: newEvent.title!,
        description: newEvent.description || "",
        startTime: newEvent.startTime || "00:00",
        endTime: newEvent.endTime || "00:00",
        date: newEvent.date!,
        location: newEvent.location || "",
        type: newEvent.type as "meeting" | "deadline" | "reminder" | "workshop",
        attendees,
        isRecurring: newEvent.isRecurring || false,
        recurrencePattern: newEvent.recurrencePattern,
        project: newEvent.project,
      };

      setEvents([createdEvent, ...events]);
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        type: "meeting",
        attendees: [],
        isRecurring: false,
        project: "All Projects",
      });
      setNewEventAttendees([]);
      setIsCreatingEvent(false);
      
      toast({
        title: "Event created",
        description: "Your new event has been created successfully.",
      });
    }, 1000);
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setSelectedEvent(null);
    
    toast({
      title: "Event deleted",
      description: "The event has been removed from your calendar.",
    });
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else if (isThisWeek(date)) {
      return format(date, "EEEE"); // Day name
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  // Get event type badge color
  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500 hover:bg-blue-600";
      case "deadline":
        return "bg-red-500 hover:bg-red-600";
      case "reminder":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "workshop":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Get event type icon
  const getEventTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "reminder":
        return <Bell className="h-4 w-4" />;
      case "workshop":
        return <FileText className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 m-5">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Manage meetings, deadlines, and team events.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-title" className="col-span-4">
                  Event Title
                </Label>
                <Input
                  id="event-title"
                  placeholder="Enter event title"
                  className="col-span-4"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-type" className="col-span-4">
                  Event Type
                </Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event["type"] })}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-date" className="col-span-4">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="col-span-4 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.date
                        ? format(parseISO(newEvent.date), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.date ? parseISO(newEvent.date) : undefined}
                      onSelect={(date) =>
                        setNewEvent({
                          ...newEvent,
                          date: date ? format(date, "yyyy-MM-dd") : undefined,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-start-time" className="col-span-2">
                  Start Time
                </Label>
                <Label htmlFor="event-end-time" className="col-span-2">
                  End Time
                </Label>
                <Input
                  id="event-start-time"
                  type="time"
                  className="col-span-2"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
                <Input
                  id="event-end-time"
                  type="time"
                  className="col-span-2"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-location" className="col-span-4">
                  Location
                </Label>
                <Input
                  id="event-location"
                  placeholder="Enter location (e.g., Conference Room, Zoom link)"
                  className="col-span-4"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-project" className="col-span-4">
                  Project
                </Label>
                <Select
                  value={newEvent.project}
                  onValueChange={(value) => setNewEvent({ ...newEvent, project: value })}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-description" className="col-span-4">
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  placeholder="Enter event details"
                  className="col-span-4"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-4">Attendees</Label>
                <div className="col-span-4 space-y-4">
                  <ScrollArea className="h-40 rounded-md border">
                    <div className="p-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`attendee-${member.id}`}
                            checked={newEventAttendees.includes(member.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewEventAttendees([...newEventAttendees, member.id]);
                              } else {
                                setNewEventAttendees(
                                  newEventAttendees.filter((id) => id !== member.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`attendee-${member.id}`}
                            className="flex flex-1 items-center text-sm"
                          >
                            <Avatar className="mr-2 h-6 w-6">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {newEventAttendees.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {newEventAttendees.length} attendee(s) selected
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="event-recurring"
                  checked={newEvent.isRecurring}
                  onCheckedChange={(checked) =>
                    setNewEvent({ ...newEvent, isRecurring: !!checked })
                  }
                />
                <Label htmlFor="event-recurring">Recurring event</Label>
              </div>
              {newEvent.isRecurring && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recurrence-pattern" className="col-span-4">
                    Recurrence Pattern
                  </Label>
                  <Select
                    value={newEvent.recurrencePattern}
                    onValueChange={(value) =>
                      setNewEvent({ ...newEvent, recurrencePattern: value })
                    }
                  >
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekdays">Weekdays</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setNewEvent({
                  title: "",
                  description: "",
                  startTime: "",
                  endTime: "",
                  date: new Date().toISOString().split("T")[0],
                  location: "",
                  type: "meeting",
                  attendees: [],
                  isRecurring: false,
                  project: "All Projects",
                });
                setNewEventAttendees([]);
              }}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateEvent} disabled={isCreatingEvent}>
                {isCreatingEvent ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "upcoming" | "calendar" | "all")}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="all">All Events</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="relative md:w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Calendar View - Left Side Calendar Picker */}
        {activeView === "calendar" && (
          <Card className="md:col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Date</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full mx-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto"
                />
              </div>

              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date())}
                  className="w-full"
                >
                  Today
                </Button>

                {selectedDate && (
                  <div className="mt-6 text-center">
                    <h3 className="text-lg font-semibold">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDate, "EEEE")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        )}

        {/* Main Content */}
        <div className={cn(
          activeView === "calendar" ? "md:col-span-8 lg:col-span-9" : "md:col-span-12"
        )}>
          {/* Upcoming Events View */}
          {activeView === "upcoming" && (
            <div className="space-y-6">
              {groupedEvents.length > 0 ? (
                groupedEvents.map(({ date, events }) => (
                  <div key={date}>
                    <h3 className="mb-4 text-lg font-semibold">
                      {formatEventDate(date)}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {format(parseISO(date), "MMMM d, yyyy")}
                      </span>
                    </h3>
                    <div className="space-y-2">
                      {events.map((event) => (
                        <Card
                          key={event.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <CardContent className="flex items-center p-4">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge
                                  className={cn(
                                    "ml-2 capitalize",
                                    getEventTypeColor(event.type)
                                  )}
                                >
                                  {event.type}
                                </Badge>
                                {event.isRecurring && (
                                  <Badge variant="outline" className="ml-2">
                                    Recurring
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                                {event.location && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee) => (
                                  <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {attendee.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      No upcoming events match your criteria.<br />
                      Try changing your search or create a new event.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          New Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>{/* Dialog content would be here */}</DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Calendar View - Event List */}
          {activeView === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "Select a date"}
                </CardTitle>
                <CardDescription>
                  {selectedDate && format(selectedDate, "EEEE")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEvents
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((event) => (
                        <Card
                          key={event.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <CardContent className="flex items-center p-4">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge
                                  className={cn(
                                    "ml-2 capitalize",
                                    getEventTypeColor(event.type)
                                  )}
                                >
                                  {event.type}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                                {event.location && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee) => (
                                  <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {attendee.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No events on this day</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedDate
                        ? `No events scheduled for ${format(
                            selectedDate,
                            "MMMM d, yyyy"
                          )}.`
                        : "Select a date to view events."}
                    </p>
                    {selectedDate && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent>{/* Dialog content would be here */}</DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All Events View */}
          {activeView === "all" && (
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>
                  Manage all your scheduled events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredEvents
                      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                      .map((event) => (
                        <Card
                          key={event.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <CardContent className="flex items-center p-4">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{event.title}</h4>
                                <Badge
                                  className={cn(
                                    "ml-2 capitalize",
                                    getEventTypeColor(event.type)
                                  )}
                                >
                                  {event.type}
                                </Badge>
                                {event.isRecurring && (
                                  <Badge variant="outline" className="ml-2">
                                    Recurring
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                <span>
                                  {format(parseISO(event.date), "MMM d, yyyy")}
                                </span>
                                <span className="mx-1">•</span>
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                                {event.location && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee) => (
                                  <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs">
                                      {attendee.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No events match your current filters.<br />
                      Try adjusting your search or create a new event.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          New Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent>{/* Dialog content would be here */}</DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center">
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <Badge
                  className={cn(
                    "ml-2 capitalize",
                    getEventTypeColor(selectedEvent.type)
                  )}
                >
                  {selectedEvent.type}
                </Badge>
                {selectedEvent.isRecurring && (
                  <Badge variant="outline" className="ml-2">
                    Recurring {selectedEvent.recurrencePattern}
                  </Badge>
                )}
              </div>
              <DialogDescription>
                {selectedEvent.project && `Project: ${selectedEvent.project}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(parseISO(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              <Separator />
              {selectedEvent.description && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Attendees</h4>
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
                  {selectedEvent.attendees.length > 0 ? (
                    selectedEvent.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="mr-2 h-6 w-6">
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{attendee.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {attendee.email}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            attendee.status === "accepted"
                              ? "default"
                              : attendee.status === "declined"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {attendee.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      No attendees for this event
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                variant="destructive"
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex space-x-2">
                {selectedEvent.type === "meeting" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Starting meeting",
                        description: "Redirecting to video conference...",
                      });
                      window.location.href = `/app/meeting/${Math.random().toString(36).substring(2, 8)}`;
                    }}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Meeting
                  </Button>
                )}
                <Button
                  onClick={() => {
                    toast({
                      title: "Event updated",
                      description: "Event details saved successfully.",
                    });
                    setSelectedEvent(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Needed for the MapPin icon
const MapPin = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
};

export default Events;
