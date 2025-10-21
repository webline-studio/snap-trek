import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AddStoryDialog({ onAdd }: { onAdd: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('stories')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: data.publicUrl,
          media_type: file.type.startsWith('video') ? 'video' : 'image',
        });

      if (insertError) throw insertError;

      toast.success("Story added!");
      onAdd();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex-shrink-0 w-20 flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xs font-medium">Add Story</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 py-8">
            <Upload className="w-16 h-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Upload a photo or video for your story
            </p>
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs"
            />
          </div>
          {uploading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
