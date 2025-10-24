import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReelPlayer } from "@/components/ReelPlayer";
import { BottomNav } from "@/components/BottomNav";
import { TopNav } from "@/components/TopNav";
import { mockReels } from "@/data/mockData";
import { Reel } from "@/types/travel";
import { toast } from "sonner";

export default function Reels() {
  const navigate = useNavigate();
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    toast.success("Liked!", { duration: 1000 });
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

  const handleSwipeLeft = (reelId: string) => {
    navigate(`/plan/${reelId}`);
  };

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
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
                onSwipeLeft={() => handleSwipeLeft(reel.id)}
                onLike={() => handleLike(reel.id)}
                onSave={() => handleSave(reel.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
