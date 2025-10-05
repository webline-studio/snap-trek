import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

// Mock data for stories and posts
const stories = [
  { id: 1, user: "Sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", hasStory: true },
  { id: 2, user: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", hasStory: true },
  { id: 3, user: "Mike", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", hasStory: true },
  { id: 4, user: "Emma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", hasStory: true },
];

const posts = [
  {
    id: 1,
    user: "Sarah Wanderlust",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
    likes: 1243,
    caption: "Watching the sunset from Oia 🌅 Absolutely breathtaking! #santorini #greece #travel",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Alex Explorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    location: "Ubud, Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    likes: 2156,
    caption: "Lost in the rice terraces 🌾 Nature's masterpiece #bali #ubud #ricefields",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: "Mike Adventures",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    likes: 3421,
    caption: "Neon dreams in Shibuya ✨ Tokyo never sleeps #tokyo #japan #citylife",
    time: "1 day ago",
  },
];

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleSave = (postId: number) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TravelSnaps
          </h1>
        </div>
      </div>

      {/* Stories */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-4">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent via-primary to-accent-foreground p-0.5">
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <img
                        src={story.avatar}
                        alt={story.user}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[64px]">
                  {story.user}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="container mx-auto max-w-2xl">
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 overflow-hidden border-0 shadow-card">
            {/* Post Header */}
            <div className="flex items-center gap-3 p-4">
              <img
                src={post.avatar}
                alt={post.user}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.user}</p>
                <p className="text-xs text-muted-foreground">{post.location}</p>
              </div>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square bg-muted">
              <img
                src={post.image}
                alt={post.location}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="transition-transform hover:scale-110"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      likedPosts.includes(post.id)
                        ? "fill-destructive text-destructive"
                        : "text-foreground"
                    }`}
                  />
                </button>
                <button className="transition-transform hover:scale-110">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="transition-transform hover:scale-110">
                  <Send className="w-6 h-6" />
                </button>
                <button
                  onClick={() => toggleSave(post.id)}
                  className="ml-auto transition-transform hover:scale-110"
                >
                  <Bookmark
                    className={`w-6 h-6 ${
                      savedPosts.includes(post.id) ? "fill-foreground" : ""
                    }`}
                  />
                </button>
              </div>

              <p className="font-semibold text-sm mb-2">
                {likedPosts.includes(post.id) ? post.likes + 1 : post.likes} likes
              </p>

              <p className="text-sm mb-2">
                <span className="font-semibold mr-2">{post.user.split(" ")[0]}</span>
                {post.caption}
              </p>

              <p className="text-xs text-muted-foreground">{post.time}</p>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
