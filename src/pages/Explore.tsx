import { Search, MapPin, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { mockReels } from "@/data/mockData";
import { BottomNav } from "@/components/BottomNav";

export default function Explore() {
  const destinations = Array.from(
    new Set(mockReels.map((r) => r.location))
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Trending */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Trending Destinations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((location) => (
              <Card
                key={location.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={location.thumbnail}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {location.name}
                    </h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location.country}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Reels */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Popular Reels</h2>
          <div className="grid grid-cols-3 gap-2">
            {mockReels.map((reel) => (
              <div
                key={reel.id}
                className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs font-medium line-clamp-2">
                    {reel.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
