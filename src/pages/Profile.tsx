import { Settings, MapPin, Heart, Bookmark, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadSavedPosts();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const loadSavedPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        *,
        posts (
          *,
          profiles (
            username,
            profile_pic
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setSavedPosts(data?.map(sp => sp.posts) || []);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const stats = [
    { label: "Trips Booked", value: "3", icon: MapPin },
    { label: "Saved", value: "12", icon: Bookmark },
    { label: "Liked", value: "47", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="icon" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={profile?.profile_pic || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 border-4 border-primary/20 object-cover"
            />
            <h2 className="text-2xl font-bold mb-1">
              {profile?.username || "Traveler"}
            </h2>
            <p className="text-muted-foreground mb-2">{user?.email}</p>
            {profile?.bio && <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>}
            <EditProfileDialog profile={profile} onUpdate={loadProfile} />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold mb-1">0</p>
            <p className="text-xs text-muted-foreground">Trips Booked</p>
          </Card>
          <Card className="p-4 text-center">
            <Bookmark className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold mb-1">{savedPosts.length}</p>
            <p className="text-xs text-muted-foreground">Saved</p>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold mb-1">0</p>
            <p className="text-xs text-muted-foreground">Liked</p>
          </Card>
        </div>

        {/* Theme Settings */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Appearance</h3>
          <Card className="p-4">
            <div className="space-y-3">
              <p className="font-medium mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex flex-col gap-2 h-auto py-3"
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex flex-col gap-2 h-auto py-3"
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex flex-col gap-2 h-auto py-3"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Saved Posts */}
        {savedPosts.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">Saved Posts</h3>
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <div key={post.id} className="aspect-square">
                  <img
                    src={post.image_url}
                    alt="Saved post"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-primary" />
                <span className="font-medium">Saved Destinations</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">My Bookings</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <span className="font-medium">Settings</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </div>
          </Card>
        </div>

        {/* Logout */}
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
