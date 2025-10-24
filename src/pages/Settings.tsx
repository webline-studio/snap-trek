import { ArrowLeft, Globe, Bell, Lock, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Settings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('settings')}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        {/* Language */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Globe className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold mb-1">{t('language')}</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred language
                </p>
              </div>
              <Select
                value={i18n.language}
                onValueChange={changeLanguage}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Bell className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">{t('notifications')}</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for new messages and updates
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Lock className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">{t('privacy')}</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can see your content
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="private-account">Private Account</Label>
                <Switch
                  id="private-account"
                  checked={privateAccount}
                  onCheckedChange={setPrivateAccount}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Help & Support */}
        <Card className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold">{t('help')}</h3>
              <p className="text-sm text-muted-foreground">
                Get help with using the app
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <Info className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold">{t('about')}</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0 • Terms • Privacy Policy
              </p>
            </div>
            <span className="text-muted-foreground">→</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
