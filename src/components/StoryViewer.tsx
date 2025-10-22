import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: string;
  created_at: string;
  profiles: {
    username: string;
    profile_pic: string;
  };
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function StoryViewer({ stories, initialIndex, open, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, open, stories.length, onClose]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0 gap-0 bg-black border-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Progress bars */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-40">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-100 ${
                  idx === currentIndex ? "w-full animate-progress" : idx < currentIndex ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-6 left-4 right-16 z-40 flex items-center gap-3">
          <img
            src={currentStory.profiles?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStory.user_id}`}
            alt={currentStory.profiles?.username}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-semibold text-sm drop-shadow-lg">
            {currentStory.profiles?.username || "User"}
          </span>
        </div>

        {/* Story content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {currentStory.media_type === 'video' ? (
            <video
              src={currentStory.media_url}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img
              src={currentStory.media_url}
              alt="Story"
              className="w-full h-full object-contain"
            />
          )}

          {/* Navigation areas */}
          <div className="absolute inset-0 flex">
            <button
              className="flex-1"
              onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            />
            <button
              className="flex-1"
              onClick={() => {
                if (currentIndex < stories.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  onClose();
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
