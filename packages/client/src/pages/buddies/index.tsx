import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/ui/pagination";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MapPin,
  UserPlus,
  SortAsc,
  X,
  Users,
  Star,
  MessageCircle,
  Flame,
  Heart,
  CalendarDays,
  Clock,
  User,
} from "lucide-react";
import BuddyCard from "@/components/buddies/BuddyCard";

const Buddies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 2x4 grid

  const buddies = [
    {
      id: "b1",
      name: "Riley Morgan",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070",
      interests: ["Fitness", "Reading", "Hiking"],
      activeStreak: 7,
      mutualActivities: 2,
      mutualBuddies: 3,
      bio: "Fitness enthusiast and bookworm. Looking for running buddies and people to discuss classic literature with.",
      completedActivities: 24,
      joinedDate: "3 months ago",
      location: "New York, NY",
      status: "online" as const,
    },
    {
      id: "b2",
      name: "Jordan Taylor",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070",
      interests: ["Coding", "Photography", "Gaming"],
      activeStreak: 12,
      mutualActivities: 1,
      mutualBuddies: 2,
      bio: "Software developer by day, photographer by night. Always looking to learn new programming languages and techniques.",
      completedActivities: 37,
      joinedDate: "6 months ago",
      location: "San Francisco, CA",
      status: "offline" as const,
    },
    {
      id: "b3",
      name: "Quinn Rivers",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961",
      interests: ["Yoga", "Meditation", "Music"],
      activeStreak: 5,
      mutualActivities: 3,
      mutualBuddies: 1,
      bio: "Mindfulness coach and amateur musician. Passionate about helping others find balance in their lives.",
      completedActivities: 19,
      joinedDate: "2 months ago",
      location: "Austin, TX",
      status: "offline" as const,
    },
    {
      id: "b4",
      name: "Avery Chen",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974",
      interests: ["Dancing", "Cooking", "Languages"],
      activeStreak: 9,
      mutualActivities: 0,
      mutualBuddies: 0,
      bio: "Multilingual foodie who loves to dance. Looking for cooking partners and language exchange buddies.",
      completedActivities: 28,
      joinedDate: "4 months ago",
      location: "Chicago, IL",
      status: "offline" as const,
    },
    {
      id: "b5",
      name: "Morgan Kim",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Photography", "Hiking", "Travel"],
      activeStreak: 15,
      mutualActivities: 1,
      mutualBuddies: 4,
      bio: "Nature photographer with a passion for outdoor adventures. Always planning my next hike or trip.",
      completedActivities: 45,
      joinedDate: "8 months ago",
      location: "Denver, CO",
      status: "offline" as const,
    },
    {
      id: "b6",
      name: "Taylor Lee",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Art", "Writing", "Film"],
      activeStreak: 3,
      mutualActivities: 0,
      mutualBuddies: 2,
      bio: "Creative writer and film enthusiast. Looking for people to collaborate on creative projects.",
      completedActivities: 12,
      joinedDate: "1 month ago",
      location: "Los Angeles, CA",
      status: "offline" as const,
    },
    {
      id: "b7",
      name: "Casey Martinez",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Fitness", "Nutrition", "Coaching"],
      activeStreak: 21,
      mutualActivities: 2,
      mutualBuddies: 5,
      bio: "Personal trainer and nutrition coach. Passionate about helping others achieve their fitness goals.",
      completedActivities: 67,
      joinedDate: "1 year ago",
      location: "Miami, FL",
      status: "offline" as const,
    },
    {
      id: "b8",
      name: "Alex Johnson",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      interests: ["Coding", "Gaming", "Music Production"],
      activeStreak: 6,
      mutualActivities: 1,
      mutualBuddies: 3,
      bio: "Full-stack developer and amateur music producer. Looking for coding buddies and collaboration on music projects.",
      completedActivities: 31,
      joinedDate: "5 months ago",
      location: "Seattle, WA",
      status: "offline" as const,
    },
  ];

  const interestCategories = [
    "All",
    "Fitness",
    "Coding",
    "Reading",
    "Art",
    "Music",
    "Photography",
    "Hiking",
    "Cooking",
    "Languages",
  ];

  const filteredBuddies = useMemo(() => {
    return buddies.filter((buddy) => {
      const matchesSearch =
        buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.interests.some((interest) =>
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesInterest =
        activeFilters.length === 0 ||
        activeFilters.includes("All") ||
        buddy.interests.some((interest) => activeFilters.includes(interest));

      return matchesSearch && matchesInterest;
    });
  }, [searchQuery, activeFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBuddies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBuddies = filteredBuddies.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
      return;
    }

    let newFilters = [...activeFilters];

    newFilters = newFilters.filter((f) => f !== "All");

    if (newFilters.includes(filter)) {
      newFilters = newFilters.filter((f) => f !== filter);
    } else {
      newFilters.push(filter);
    }

    if (newFilters.length === 0) {
      newFilters = ["All"];
    }

    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters(["All"]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-buddy-gray-100">
      <div className="pt-20 pb-12 bg-gradient-to-b from-[#E5DEFF] to-buddy-gray-100">
        <Container>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-buddy-gray-900">
              Find Buddies
            </h1>
            <p className="text-buddy-gray-600 max-w-3xl">
              Connect with like-minded individuals who share your interests and
              goals. Find accountability partners to help you stay on track.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400" />
                <Input
                  type="search"
                  placeholder="Search buddies by name, interests, or location..."
                  className="pl-10 bg-white rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </Button>
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<SortAsc className="w-4 h-4" />}
                >
                  Sort
                </Button>
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<MapPin className="w-4 h-4" />}
                >
                  Near Me
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {interestCategories.map((interest) => (
                <Button
                  key={interest}
                  variant={
                    activeFilters.includes(interest) ? "primary" : "outline"
                  }
                  size="small"
                  className={
                    activeFilters.includes(interest)
                      ? "bg-buddy-purple text-white rounded-full"
                      : "bg-white text-buddy-gray-700 rounded-full"
                  }
                  onClick={() => toggleFilter(interest)}
                >
                  {interest}
                </Button>
              ))}

              {(searchQuery ||
                (activeFilters.length > 0 &&
                  !activeFilters.includes("All"))) && (
                <Button
                  variant="ghost"
                  size="small"
                  className="text-buddy-gray-500 rounded-full"
                  onClick={clearFilters}
                  icon={<X className="w-4 h-4" />}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="mb-6 bg-buddy-gray-200/50">
            <TabsTrigger value="all" className="rounded-full">
              All Buddies
            </TabsTrigger>
            <TabsTrigger value="my" className="rounded-full">
              My Buddies
            </TabsTrigger>
            <TabsTrigger value="recommended" className="rounded-full">
              Recommended
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-full">
              Most Active
            </TabsTrigger>
            <TabsTrigger value="nearby" className="rounded-full">
              Nearby
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {paginatedBuddies.map((buddy) => (
                    <BuddyCard
                      key={buddy.id}
                      id={buddy.id}
                      name={buddy.name}
                      image={buddy.image}
                      location={buddy.location}
                      bio={buddy.bio}
                      interests={buddy.interests}
                      mutualActivities={buddy.mutualActivities}
                      mutualBuddies={buddy.mutualBuddies || 0}
                      status={buddy.status}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-buddy-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No buddies found
                  </h3>
                  <p className="text-buddy-gray-600 mb-6">
                    We couldn't find any buddies matching your search criteria.
                  </p>
                  <Button onClick={clearFilters} className="rounded-full">
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {buddies
                .filter((buddy) => buddy.mutualActivities > 0)
                .map((buddy) => (
                  <BuddyCard
                    key={buddy.id}
                    id={buddy.id}
                    name={buddy.name}
                    image={buddy.image}
                    location={buddy.location}
                    bio={buddy.bio}
                    interests={buddy.interests}
                    mutualActivities={buddy.mutualActivities}
                    mutualBuddies={buddy.mutualBuddies || 0}
                    status={buddy.status}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {buddies.slice(0, 4).map((buddy) => (
                <BuddyCard
                  key={buddy.id}
                  id={buddy.id}
                  name={buddy.name}
                  image={buddy.image}
                  location={buddy.location}
                  bio={buddy.bio}
                  interests={buddy.interests}
                  mutualActivities={buddy.mutualActivities}
                  mutualBuddies={buddy.mutualBuddies || 0}
                  status={buddy.status || "offline"}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {buddies
                .sort((a, b) => b.activeStreak - a.activeStreak)
                .slice(0, 4)
                .map((buddy) => (
                  <BuddyCard
                    key={buddy.id}
                    id={buddy.id}
                    name={buddy.name}
                    image={buddy.image}
                    location={buddy.location}
                    bio={buddy.bio}
                    interests={buddy.interests}
                    mutualActivities={buddy.mutualActivities}
                    mutualBuddies={buddy.mutualBuddies || 0}
                    status={buddy.status || "offline"}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="nearby">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {buddies.slice(4, 8).map((buddy) => (
                <BuddyCard
                  key={buddy.id}
                  id={buddy.id}
                  name={buddy.name}
                  image={buddy.image}
                  location={buddy.location}
                  bio={buddy.bio}
                  interests={buddy.interests}
                  mutualActivities={buddy.mutualActivities}
                  mutualBuddies={buddy.mutualBuddies || 0}
                  status={buddy.status || "offline"}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gradient-to-r from-[#FFDEE2]/30 to-[#FDE1D3]/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Let Others Find You Too
              </h3>
              <p className="text-buddy-gray-700 mb-6">
                Complete your profile to improve your visibility and help others
                with similar interests discover you.
              </p>
              <Button
                className="bg-buddy-purple text-white rounded-full"
                icon={<Star className="w-5 h-5" />}
              >
                Complete Your Profile
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-36 h-36 bg-buddy-purple-light/20 rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-buddy-purple-light" />
                </div>
                <div className="absolute w-12 h-12 bg-buddy-blue-light rounded-full -top-2 right-5 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="absolute w-10 h-10 bg-buddy-green-light rounded-full bottom-4 -right-2 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-buddy-green-dark" />
                </div>
                <div className="absolute w-14 h-14 bg-buddy-orange-light rounded-full bottom-0 left-5 flex items-center justify-center">
                  <User className="w-8 h-8 text-buddy-orange-dark" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Buddies;
