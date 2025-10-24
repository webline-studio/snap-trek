import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
  onDelete?: () => void;
}

export function StoryViewer({ stories, initialIndex, open, onClose, onDelete }: StoryViewerProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const handleDelete = async () => {
    const story = stories[currentIndex];
    
    try {
      // Delete from storage if exists
      if (story.media_url.includes('supabase')) {
        const fileName = story.media_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('stories').remove([fileName]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id);

      if (error) throw error;

      toast.success('Story deleted successfully');
      setDeleteDialogOpen(false);
      onClose();
      onDelete?.();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!currentStory) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md h-[80vh] p-0 gap-0 bg-black border-0">
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            {user?.id === currentStory.user_id && (
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

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
          <div className="absolute top-6 left-4 right-32 z-40 flex items-center gap-3">
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteStory')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteStoryConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
