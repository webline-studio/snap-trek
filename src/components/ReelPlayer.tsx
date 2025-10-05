import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reel } from "@/types/travel";

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  onSwipeUp: () => void;
  onSwipeLeft: () => void;
  onLike: () => void;
  onSave: () => void;
}

export function ReelPlayer({ reel, isActive, onSwipeUp, onSwipeLeft, onLike, onSave }: ReelPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTap = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = () => {
    if (!reel.isLiked) {
      onLike();
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;

    // Detect swipe left (horizontal swipe has priority over vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && diffX > 100) {
      onSwipeLeft();
    } else if (diffY > 100) {
      onSwipeUp();
    }
  };

  let tapTimeout: NodeJS.Timeout;
  const handleClick = () => {
    clearTimeout(tapTimeout);
    tapTimeout = setTimeout(handleTap, 250);
  };

  const handleDoubleClick = () => {
    clearTimeout(tapTimeout);
    handleDoubleTap();
  };

  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden snap-start snap-always"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Video Background */}
      <img
        src={reel.posterUrl}
        alt={reel.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Animated Heart */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="w-32 h-32 text-white fill-white animate-heart-beat" />
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 md:pb-6 z-10">
        <div className="flex items-end justify-between">
          <div className="flex-1 mr-4">
            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={reel.creatorAvatar}
                alt={reel.creatorName}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="font-semibold text-white text-sm">{reel.creatorName}</span>
            </div>

            {/* Title & Location */}
            <h2 className="text-white text-xl font-bold mb-2">{reel.title}</h2>
            <p className="text-white/90 text-sm mb-3">
              📍 {reel.location.name}, {reel.location.country}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {reel.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Swipe Hints */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/80 text-sm animate-pulse">
                <span>Swipe left to plan trip</span>
                <span className="text-lg">←</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <span>Swipe up for details</span>
                <span className="text-base">↑</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Heart
                  className={cn(
                    "w-6 h-6 transition-all",
                    reel.isLiked ? "fill-accent text-accent" : "text-white"
                  )}
                />
              </div>
              <span className="text-white text-xs font-medium">
                {reel.likes >= 1000 ? `${(reel.likes / 1000).toFixed(1)}k` : reel.likes}
              </span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs font-medium">{reel.comments}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Bookmark
                  className={cn(
                    "w-6 h-6 transition-all",
                    reel.isSaved ? "fill-primary text-primary" : "text-white"
                  )}
                />
              </div>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                <Send className="w-6 h-6 text-white" />
              </div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
