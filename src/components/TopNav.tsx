import { Home, Compass, MessageCircle, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function TopNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: Home, label: t('home'), path: "/" },
    { icon: Compass, label: t('reels'), path: "/reels" },
    { icon: MessageCircle, label: t('chat'), path: "/chat" },
    { icon: User, label: t('profile'), path: "/profile" },
  ];

  return (
    <nav className="hidden md:block sticky top-0 bg-background/95 backdrop-blur-sm border-b z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TravelSnaps
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
          </div>
        </div>
      </div>
    </nav>
  );
}
