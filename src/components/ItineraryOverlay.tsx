import { X, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TravelPackage } from "@/types/travel";
import { Card } from "@/components/ui/card";

interface ItineraryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  package: TravelPackage | null;
  locationName: string;
  onBook: () => void;
}

export function ItineraryOverlay({
  isOpen,
  onClose,
  package: pkg,
  locationName,
  onBook,
}: ItineraryOverlayProps) {
  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Overlay Content */}
      <div className="relative w-full md:w-[600px] bg-background/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl shadow-[var(--shadow-elegant)] max-h-[85vh] overflow-y-auto animate-slide-in-right border border-border/50">
        {/* Header */}
        <div className="sticky top-0 bg-background/98 backdrop-blur-lg border-b border-border/50 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{pkg.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-[var(--shadow-card)] transition-all">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-bold text-foreground">{pkg.days} Days</p>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-[var(--shadow-card)] transition-all">
              <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Seats</p>
              <p className="font-bold text-foreground">{pkg.seats} Left</p>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-[var(--shadow-card)] transition-all">
              <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-bold text-foreground text-xs leading-tight">{locationName}</p>
            </Card>
          </div>

          {/* Price */}
          <Card className="p-6 bg-gradient-to-br from-primary via-primary-glow to-primary text-white shadow-[var(--shadow-glow)] border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1 font-medium">Starting from</p>
                <p className="text-4xl font-bold tracking-tight">
                  ${pkg.price.toLocaleString()}
                  <span className="text-base font-normal opacity-80 ml-1">/{pkg.currency}</span>
                </p>
              </div>
              <Sparkles className="w-12 h-12 opacity-80 animate-pulse" />
            </div>
          </Card>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Package Highlights</h3>
            <ul className="space-y-2">
              {pkg.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-semibold">✓</span>
                  </span>
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Day by Day Itinerary</h3>
            <div className="space-y-4">
              {pkg.itinerary.map((day) => (
                <Card key={day.day} className="p-5 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-[var(--shadow-card)] transition-all hover:scale-[1.02]">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-foreground/80 shadow-[var(--shadow-elegant)] text-white flex items-center justify-center font-bold text-lg">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{day.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{day.description}</p>
                      <ul className="space-y-1.5">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span className="flex-1">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-2">
            <Button variant="outline" className="flex-1 border-border/50 hover:bg-muted/50" onClick={onClose}>
              Save for Later
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-accent to-accent-foreground hover:shadow-[var(--shadow-elegant)] hover:scale-105 transition-all" 
              size="lg" 
              onClick={onBook}
            >
              Book This Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
