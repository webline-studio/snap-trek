import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Search, MapPin, Sparkles, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const locals = [
  {
    id: 1,
    name: "Maria Santos",
    location: "Santorini, Greece",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    lastMessage: "The sunset spots I mentioned are amazing!",
    time: "2h ago",
    online: true,
  },
  {
    id: 2,
    name: "Ketut Bali",
    location: "Ubud, Bali",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ketut",
    lastMessage: "I can arrange the rice terrace tour for you",
    time: "5h ago",
    online: true,
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    lastMessage: "The cherry blossoms are in full bloom now!",
    time: "1d ago",
    online: false,
  },
];

const planners = [
  {
    id: 1,
    name: "TravelPro Sarah",
    specialty: "Luxury Getaways",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TravelPro",
    lastMessage: "I've prepared a custom itinerary for you",
    time: "30m ago",
    verified: true,
  },
  {
    id: 2,
    name: "Adventure Alex",
    specialty: "Backpacking & Hiking",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdventureAlex",
    lastMessage: "Let's plan your next adventure!",
    time: "3h ago",
    verified: true,
  },
];

export default function Chat() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // Load messages for selected chat
  useEffect(() => {
    if (!params.id || !user || !selectedChat) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${params.id}),and(sender_id.eq.${params.id},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`messages:${params.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: any) => {
          const newMessage = payload.new;
          if (
            (newMessage.sender_id === user.id && newMessage.receiver_id === params.id) ||
            (newMessage.sender_id === params.id && newMessage.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id, user, selectedChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !params.id || !user) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      receiver_id: params.id,
    });

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    setNewMessage("");
  };

  // If a chat is selected, show message view
  if (params.id && selectedChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Chat Header */}
        <div className="sticky top-0 bg-card border-b p-4 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/chat")}
            >
              ← Back
            </Button>
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedChat.location || selectedChat.specialty}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t p-4">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="locals" className="container mx-auto px-4 pt-4">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="locals" className="gap-2">
            <MapPin className="w-4 h-4" />
            Locals
          </TabsTrigger>
          <TabsTrigger value="planners" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Trip Planners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locals" className="space-y-2">
          {locals.map((local) => (
            <Card
              key={local.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedChat(local);
                navigate(`/chat/${local.id}`);
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={local.avatar}
                    alt={local.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {local.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm">{local.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {local.location}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{local.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {local.lastMessage}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="planners" className="space-y-2">
          {planners.map((planner) => (
            <Card
              key={planner.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedChat(planner);
                navigate(`/chat/${planner.id}`);
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={planner.avatar}
                    alt={planner.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {planner.verified && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                      <Sparkles className="w-2 h-2 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm">{planner.name}</p>
                      <p className="text-xs text-muted-foreground">{planner.specialty}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{planner.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {planner.lastMessage}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
}
