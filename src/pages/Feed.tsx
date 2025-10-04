import { useState, useRef, useEffect } from "react";
import { ReelPlayer } from "@/components/ReelPlayer";
import { ItineraryOverlay } from "@/components/ItineraryOverlay";
import { mockReels, mockPackages } from "@/data/mockData";
import { Reel } from "@/types/travel";
import { toast } from "sonner";

export default function Feed() {
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showItinerary, setShowItinerary] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentIndex, reels.length]);

  const handleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
    toast.success("Liked!", {
      duration: 1000,
    });
  };

  const handleSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
      )
    );
    const reel = reels.find((r) => r.id === reelId);
    toast.success(reel?.isSaved ? "Removed from saved" : "Saved for later!", {
      duration: 2000,
    });
  };

  const handleSwipeUp = () => {
    setShowItinerary(true);
  };

  const handleBook = () => {
    toast.success("Booking feature coming soon! 🎉", {
      description: "We'll notify you when booking is available.",
      duration: 3000,
    });
    setShowItinerary(false);
  };

  const currentReel = reels[currentIndex];
  const currentPackage = mockPackages[currentReel?.id];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Reels Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="w-full h-screen snap-start">
            <ReelPlayer
              reel={reel}
              isActive={index === currentIndex}
              onSwipeUp={handleSwipeUp}
              onLike={() => handleLike(reel.id)}
              onSave={() => handleSave(reel.id)}
            />
          </div>
        ))}
      </div>

      {/* Itinerary Overlay */}
      <ItineraryOverlay
        isOpen={showItinerary}
        onClose={() => setShowItinerary(false)}
        package={currentPackage}
        locationName={currentReel?.location.name || ""}
        onBook={handleBook}
      />
    </div>
  );
}
