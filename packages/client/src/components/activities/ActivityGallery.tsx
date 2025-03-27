import React, { useState } from "react";
import {
  Search,
  Calendar,
  Filter,
  Heart,
  MessageCircle,
  X,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface ActivityGalleryProps {
  activityId: string;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
}

const ActivityGallery: React.FC<ActivityGalleryProps> = ({ activityId }) => {
  const [filter, setFilter] = useState<"all" | "recent" | "popular">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [commentText, setCommentText] = useState("");

  // Mock gallery data (would come from API in real app)
  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      caption:
        "Morning yoga session with a beautiful sunrise view! #namaste #yogachallenge",
      date: "2023-10-12",
      user: {
        id: "1",
        name: "Sophia Kim",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      imageUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      caption:
        "Day 15 of the yoga challenge. Feeling stronger every day! #yogaprogress",
      date: "2023-10-11",
      user: {
        id: "2",
        name: "Marcus Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      likes: 18,
      comments: 5,
    },
    {
      id: "3",
      imageUrl:
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      caption:
        "Partner yoga session with @jameswilson. Having a buddy makes it more fun!",
      date: "2023-10-10",
      user: {
        id: "3",
        name: "Aisha Patel",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      likes: 32,
      comments: 12,
    },
    {
      id: "4",
      imageUrl:
        "https://images.unsplash.com/photo-1599447421416-3414500d18a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      caption:
        "Early morning yoga session. Day 12 of 30! #yogachallenge #morningroutine",
      date: "2023-10-09",
      user: {
        id: "4",
        name: "James Wilson",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      likes: 15,
      comments: 3,
    },
    {
      id: "5",
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      caption: "Outdoor yoga is the best! #natureyoga #yogaeverywhere",
      date: "2023-09-18",
      user: {
        id: "5",
        name: "Emma Davis",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      likes: 28,
      comments: 7,
    },
    {
      id: "6",
      imageUrl:
        "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      caption: "Beach yoga session. So peaceful! #beachyoga #sunset",
      date: "2023-09-17",
      user: {
        id: "1",
        name: "Sophia Kim",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      likes: 45,
      comments: 14,
    },
    {
      id: "7",
      imageUrl:
        "https://images.unsplash.com/photo-1516526995003-435ccce2be97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      caption: "Trying new poses today! #yogajourney #flexibility",
      date: "2023-09-10",
      user: {
        id: "2",
        name: "Marcus Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      likes: 20,
      comments: 6,
    },
    {
      id: "8",
      imageUrl:
        "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      caption: "Home yoga session. Making progress on my balance! #yogaathome",
      date: "2023-08-20",
      user: {
        id: "3",
        name: "Aisha Patel",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      likes: 22,
      comments: 5,
    },
  ];

  // Filter and search gallery items
  const filteredItems = galleryItems.filter((item) => {
    // Text search
    if (
      searchQuery &&
      !item.caption.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by type
    if (filter === "recent") {
      // Sort by date (most recent first)
      return (
        new Date(item.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else if (filter === "popular") {
      // Only items with high engagement
      return item.likes > 20;
    }

    return true;
  });

  // Group images by month
  const groupedByMonth = filteredItems.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  // Sort months chronologically (newest first)
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  // Mock comments data
  const generateMockComments = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `comment-${i}`,
      user: {
        name: `User ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${10 + i}`,
      },
      text: "This is amazing! Love seeing your progress on this challenge.",
      time: "2h ago",
      likes: Math.floor(Math.random() * 10),
    }));
  };

  // Function to handle like action
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would call an API to like the post
    console.log("Liked post");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-buddy-gray-800">
          Activity Gallery
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search gallery..."
              className="pl-9 rounded-lg border-buddy-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`px-3 ${
                filter === "all"
                  ? "bg-buddy-purple text-white hover:bg-buddy-purple/90 hover:text-white"
                  : ""
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`px-3 ${
                filter === "recent"
                  ? "bg-buddy-purple text-white hover:bg-buddy-purple/90 hover:text-white"
                  : ""
              }`}
              onClick={() => setFilter("recent")}
            >
              <Calendar className="mr-1 h-4 w-4" />
              Recent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`px-3 ${
                filter === "popular"
                  ? "bg-buddy-purple text-white hover:bg-buddy-purple/90 hover:text-white"
                  : ""
              }`}
              onClick={() => setFilter("popular")}
            >
              <Filter className="mr-1 h-4 w-4" />
              Popular
            </Button>
          </div>
        </div>
      </div>

      {sortedMonths.length > 0 ? (
        <div className="space-y-8">
          {sortedMonths.map((monthYear) => (
            <div key={monthYear} className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-buddy-gray-800 border-b pb-2">
                {monthYear}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedByMonth[monthYear].map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    setSelectedItem={setSelectedItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-buddy-gray-500">
            No gallery items found. Try changing your search or filters.
          </p>
        </Card>
      )}

      {/* Sheet for showing details */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md md:max-w-lg overflow-y-auto"
        >
          {selectedItem && (
            <>
              <SheetHeader className="text-left pb-4">
                <SheetTitle className="text-xl">Check-in Details</SheetTitle>
              </SheetHeader>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Avatar
                    src={selectedItem.user.avatar}
                    alt={selectedItem.user.name}
                    size="md"
                    className="mr-3 border-2 border-buddy-purple rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-buddy-gray-800">
                      {selectedItem.user.name}
                    </h4>
                    <p className="text-xs text-buddy-gray-500">
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden">
                  <img
                    src={selectedItem.imageUrl}
                    alt="Check-in"
                    className="w-full object-cover"
                  />
                </div>

                <p className="text-buddy-gray-700">{selectedItem.caption}</p>

                <div className="flex justify-between py-3">
                  <div className="flex items-center gap-4">
                    <button
                      className="flex items-center gap-1 text-buddy-gray-500"
                      onClick={handleLike}
                    >
                      <Heart className="w-5 h-5" />
                      <span>{selectedItem.likes}</span>
                    </button>
                    <div className="flex items-center gap-1 text-buddy-gray-500">
                      <MessageCircle className="w-5 h-5" />
                      <span>{selectedItem.comments}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Comments</h4>
                  <div className="space-y-4">
                    {generateMockComments(selectedItem.comments).map(
                      (comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            size="sm"
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-buddy-gray-50 p-3 rounded-xl">
                              <p className="font-medium text-sm">
                                {comment.user.name}
                              </p>
                              <p className="text-sm text-buddy-gray-700">
                                {comment.text}
                              </p>
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-buddy-gray-500">
                              <button>Like</button>
                              <button>Reply</button>
                              <span>{comment.time}</span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-6">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="min-h-[100px] rounded-xl resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-xl"
                        disabled={!commentText.trim()}
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface GalleryCardProps {
  item: GalleryItem;
  setSelectedItem: (item: GalleryItem) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, setSelectedItem }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative aspect-square group cursor-pointer rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedItem(item)}
    >
      <img
        src={item.imageUrl}
        alt={item.caption}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-${
          isHovered ? "100" : "80"
        } transition-opacity duration-300`}
      ></div>

      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
        <div className="flex items-center mb-2">
          <Avatar
            src={item.user.avatar}
            alt={item.user.name}
            size="sm"
            className="mr-2 border-2 border-white rounded-full"
          />
          <div>
            <p className="font-medium text-sm line-clamp-1">{item.user.name}</p>
            <p className="text-xs text-white/80">
              {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center">
              <Heart className="w-3.5 h-3.5 mr-1 text-white/90" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-3.5 h-3.5 mr-1 text-white/90" />
              <span>{item.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityGallery;
