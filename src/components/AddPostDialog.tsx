import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface AddPostDialogProps {
  onAdd?: () => void;
  trigger?: React.ReactNode;
}

export function AddPostDialog({ onAdd, trigger }: AddPostDialogProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user || !imageFile) {
      toast.error(t('uploadImage'));
      return;
    }

    setUploading(true);

    try {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('posts')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName);

      // Create post in database
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          caption: caption || null,
          location: location || null,
        });

      if (insertError) throw insertError;

      toast.success('Post created successfully!');
      setOpen(false);
      setCaption("");
      setLocation("");
      setImageFile(null);
      setImagePreview("");
      onAdd?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t('createPost')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('createPost')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{t('uploadImage')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Caption */}
          <Textarea
            placeholder={t('addCaption')}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />

          {/* Location */}
          <Input
            placeholder={t('addLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={uploading || !imageFile}
            >
              {uploading ? t('loading') : t('post')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
