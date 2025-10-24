import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { TopNav } from "@/components/TopNav";
import { AddStoryDialog } from "@/components/AddStoryDialog";
import { AddPostDialog } from "@/components/AddPostDialog";
import { CommentsDialog } from "@/components/CommentsDialog";
import { StoryViewer } from "@/components/StoryViewer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stories, setStories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadStories();
    loadPosts();
    loadUserInteractions();
  }, [user]);

  const loadStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles (
          username,
          profile_pic
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setStories(data || []);
    }
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          profile_pic
        ),
        comments (count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setPosts(data || []);
    }
  };

  const loadUserInteractions = async () => {
    if (!user) return;

    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    const { data: saves } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', user.id);

    if (likes) setLikedPosts(likes.map(l => l.post_id));
    if (saves) setSavedPosts(saves.map(s => s.post_id));
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const isLiked = likedPosts.includes(postId);

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        setLikedPosts(prev => prev.filter(id => id !== postId));
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });

        setLikedPosts(prev => [...prev, postId]);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    const isSaved = savedPosts.includes(postId);

    try {
      if (isSaved) {
        await supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        setSavedPosts(prev => prev.filter(id => id !== postId));
      } else {
        await supabase
          .from('saved_posts')
          .insert({ post_id: postId, user_id: user.id });

        setSavedPosts(prev => [...prev, postId]);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      // Delete post from database
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deletePostId);

      if (error) throw error;

      toast.success('Post deleted successfully');
      setDeleteDialogOpen(false);
      setDeletePostId(null);
      loadPosts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <TopNav />
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TravelSnaps
          </h1>
          <AddPostDialog onAdd={loadPosts} trigger={<Button size="sm" className="gap-2">+ {t('post')}</Button>} />
        </div>
      </div>

      {/* Stories */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <AddStoryDialog onAdd={loadStories} />
            {stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStoryIndex(index);
                  setStoryViewerOpen(true);
                }}
                className="flex-shrink-0 w-20 flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-0.5">
                    <img
                      src={story.profiles?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.user_id}`}
                      alt={story.profiles?.username}
                      className="w-full h-full rounded-full border-2 border-background object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium truncate w-full text-center">
                  {story.profiles?.username || "User"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="container mx-auto max-w-2xl py-4 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.profiles?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`}
                  alt={post.profiles?.username}
                  className="w-10 h-10 rounded-full border-2 border-primary/20"
                />
                <div>
                  <p className="font-semibold">{post.profiles?.username || "User"}</p>
                  {post.location && <p className="text-sm text-muted-foreground">{post.location}</p>}
                </div>
              </div>
              {user?.id === post.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setDeletePostId(post.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('deletePost')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Post Image */}
            <img
              src={post.image_url}
              alt="Post"
              className="w-full aspect-square object-cover"
            />

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="hover:text-muted-foreground transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        likedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                  <CommentsDialog postId={post.id} commentCount={post.comments?.[0]?.count || 0} />
                  <button className="hover:text-muted-foreground transition-colors">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={() => toggleSave(post.id)}
                  className="hover:text-muted-foreground transition-colors"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      savedPosts.includes(post.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="font-semibold mb-2">{post.likes} likes</p>
              {post.caption && (
                <p className="mb-2">
                  <span className="font-semibold mr-2">{post.profiles?.username || "User"}</span>
                  {post.caption}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <StoryViewer
        stories={stories}
        initialIndex={selectedStoryIndex}
        open={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        onDelete={loadStories}
      />

      <AddPostDialog onAdd={loadPosts} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deletePost')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deletePostConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
