import { Bookmark } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { mockReels } from "@/data/mockData";

export default function Saved() {
  // In a real app, this would filter based on actual saved state
  const savedReels = mockReels.slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Saved Trips</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {savedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved trips yet</h2>
            <p className="text-muted-foreground">
              Start exploring and save your favorite destinations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedReels.map((reel) => (
              <div
                key={reel.id}
                className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={reel.posterUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold mb-1">{reel.title}</h3>
                  <p className="text-white/80 text-sm">
                    {reel.location.name}, {reel.location.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
