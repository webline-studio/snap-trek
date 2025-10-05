import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, MapPin, Sparkles, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockReels, mockPackages } from "@/data/mockData";
import { toast } from "sonner";

export default function PlanTrip() {
  const { reelId } = useParams();
  const navigate = useNavigate();

  const reel = mockReels.find((r) => r.id === reelId);
  const pkg = reel ? mockPackages[reel.id] : null;

  if (!reel || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Trip not found</p>
      </div>
    );
  }

  const handleBook = () => {
    toast.success("Booking feature coming soon! 🎉", {
      description: "We'll notify you when booking is available.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={reel.posterUrl}
          alt={reel.location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-6">
        {/* Title Card */}
        <Card className="p-6 mb-6 shadow-elegant">
          <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {reel.location.name}, {reel.location.country}
          </p>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-bold">{pkg.days} Days</p>
          </Card>
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
            <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">Seats</p>
            <p className="font-bold">{pkg.seats} Left</p>
          </Card>
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="font-bold">4.9★</p>
          </Card>
        </div>

        {/* Price Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary via-primary-glow to-primary text-white shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Starting from</p>
              <p className="text-4xl font-bold">
                ${pkg.price.toLocaleString()}
                <span className="text-base font-normal opacity-80 ml-1">/{pkg.currency}</span>
              </p>
            </div>
            <Sparkles className="w-12 h-12 opacity-80 animate-pulse" />
          </div>
        </Card>

        {/* Highlights */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Trip Highlights</h2>
          <Card className="p-4">
            <ul className="space-y-3">
              {pkg.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-semibold">✓</span>
                  </span>
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Itinerary */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Day by Day Itinerary</h2>
          <div className="space-y-4">
            {pkg.itinerary.map((day) => (
              <Card key={day.day} className="p-5 hover:shadow-card transition-all">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-foreground shadow-elegant text-white flex items-center justify-center font-bold text-lg">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{day.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                    <ul className="space-y-1.5">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Stay Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-card transition-all">
                <div className="aspect-video bg-muted">
                  <img
                    src={`https://images.unsplash.com/photo-${1566073771032 + i}0-a458c67da50?w=400`}
                    alt={`Stay ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1">Luxury Villa {i}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ocean view • Private pool
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">${199 + i * 50}/night</p>
                    <p className="text-sm text-muted-foreground">★ 4.{8 + i}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <Button variant="outline" className="flex-1">
            Save for Later
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-accent to-accent-foreground hover:shadow-elegant hover:scale-105 transition-all"
            size="lg"
            onClick={handleBook}
          >
            Book This Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
