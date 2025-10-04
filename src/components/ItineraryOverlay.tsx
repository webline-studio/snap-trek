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
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Overlay Content */}
      <div className="relative w-full md:w-[600px] bg-background rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{pkg.title}</h2>
          <Button variant="icon" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{pkg.days} Days</p>
            </Card>
            <Card className="p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Seats</p>
              <p className="font-semibold">{pkg.seats} Available</p>
            </Card>
            <Card className="p-4 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold text-sm">{locationName}</p>
            </Card>
          </div>

          {/* Price */}
          <Card className="p-6 bg-gradient-primary text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Starting from</p>
                <p className="text-4xl font-bold">
                  ${pkg.price.toLocaleString()}
                  <span className="text-lg font-normal opacity-80">/{pkg.currency}</span>
                </p>
              </div>
              <Sparkles className="w-12 h-12 opacity-80" />
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
                <Card key={day.day} className="p-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent text-white flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{day.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                      <ul className="space-y-1">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {activity}
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
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Save for Later
            </Button>
            <Button variant="accent" size="lg" className="flex-1" onClick={onBook}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
