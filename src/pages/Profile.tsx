import { Settings, MapPin, Heart, Bookmark, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 border-4 border-primary/20"
            />
            <h2 className="text-2xl font-bold mb-1">
              {user?.user_metadata?.username || "Traveler"}
            </h2>
            <p className="text-muted-foreground mb-4">{user?.email}</p>
            <Button variant="outline">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
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
