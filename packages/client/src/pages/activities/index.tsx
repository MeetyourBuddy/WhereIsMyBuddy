import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import ActivityCard from "@/components/dashboard/ActivityCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  SortAsc,
  X,
  Users,
} from "lucide-react";
import { useActivityStore } from "@/store/activity.store";

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const {
    activities: activitiesFromStore,
    isLoading: isLoadingActivities,
    fetchActivities,
  } = useActivityStore();

  // Fetch activities from store
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  console.log("activitiesFromStore", activitiesFromStore);

  // Use real activities from store, fallback to mock data if empty
  const activities =
    activitiesFromStore.length > 0
      ? activitiesFromStore
      : [
          {
            id: "1",
            title: "Morning Yoga in the Park",
            description:
              "Join us for a refreshing morning yoga session in Central Park. All levels welcome!",
            location: "Central Park, New York",
            date: "Tomorrow",
            time: "7:00 AM - 8:30 AM",
            category: "Fitness",
            image:
              "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
            participants: [
              {
                id: "u1",
                name: "Emma Wilson",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u2",
                name: "Alex Johnson",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              { id: "u3", name: "Sarah Parker" },
            ],
            maxParticipants: 10,
          },
          {
            id: "2",
            title: "Weekly Code Review & Pair Programming",
            description:
              "Let's improve our coding skills together! We'll review each other's code and do some pair programming.",
            location: "Virtual Meeting",
            date: "This Friday",
            time: "5:00 PM - 7:00 PM",
            category: "Coding",
            image:
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069",
            participants: [
              {
                id: "u4",
                name: "Michael Chen",
                image:
                  "https://images.unsplash.com/photo-1507003211-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u5",
                name: "David Kim",
                image:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 8,
          },
          {
            id: "3",
            title: "Book Club: 'The Midnight Library'",
            description:
              "Discussion about Matt Haig's 'The Midnight Library'. Join even if you haven't finished the book yet!",
            location: "Coffee House, Downtown",
            date: "Next Monday",
            time: "6:30 PM - 8:00 PM",
            category: "Reading",
            image:
              "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070",
            participants: [
              {
                id: "u6",
                name: "Sophia Martinez",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 12,
          },
          {
            id: "4",
            title: "Photography Walk: Urban Architecture",
            description:
              "Explore and photograph the city's most interesting buildings and urban spaces.",
            location: "Downtown Arts District",
            date: "This Saturday",
            time: "3:00 PM - 6:00 PM",
            category: "Photography",
            image:
              "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070",
            participants: [
              {
                id: "u7",
                name: "Jay Wong",
                image:
                  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u8",
                name: "Priya Sharma",
                image:
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 15,
          },
          {
            id: "5",
            title: "Beginner's Painting Workshop",
            description:
              "Learn basic painting techniques with acrylics. All materials provided!",
            location: "Community Art Center",
            date: "Next Sunday",
            time: "2:00 PM - 5:00 PM",
            category: "Art",
            image:
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080",
            participants: [
              {
                id: "u9",
                name: "Chris Brown",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 8,
          },
          {
            id: "6",
            title: "Hiking Group: Mountain Trail",
            description:
              "Moderate difficulty 5-mile hike with beautiful views. Bring water and snacks!",
            location: "Mountain Ridge Park",
            date: "Next Saturday",
            time: "9:00 AM - 2:00 PM",
            category: "Hiking",
            image:
              "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070",
            participants: [
              {
                id: "u10",
                name: "Lisa Miller",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u11",
                name: "Mike Thomas",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u12",
                name: "Jessica White",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 20,
          },
        ];

  const categories = [
    "All",
    "Fitness",
    "Coding",
    "Reading",
    "Photography",
    "Art",
    "Hiking",
  ];

  const filteredActivities =
    activitiesFromStore &&
    activitiesFromStore.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeFilters.length === 0 ||
        activeFilters.includes("All") ||
        activeFilters.includes(activity.category);

      return matchesSearch && matchesCategory;
    });

  console.log("filteredActivities hereeeee", filteredActivities);

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
      <div className="pt-8 pb-12 bg-gradient-to-b from-[#F2FCE2] to-buddy-gray-100">
        <Container>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center ">
              <h1 className="text-3xl md:text-4xl font-bold text-buddy-gray-900">
                Discover Activities
              </h1>
              <Button
                variant="outline"
                className="border-buddy-purple text-buddy-purple"
                icon={<Users className="w-5 h-5" />}
                onClick={() => navigate("/activities/create")}
              >
                Create Your Own Activity
              </Button>
            </div>
            <p className="text-buddy-gray-600 max-w-3xl">
              Find activities that match your interests, connect with
              like-minded people, and start your accountability journey
              together.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400" />
                <Input
                  type="search"
                  placeholder="Search activities or categories..."
                  className="pl-10 bg-white h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="bg-white"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </Button>
                <Button
                  variant="outline"
                  className="bg-white"
                  icon={<SortAsc className="w-4 h-4" />}
                >
                  Sort
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    activeFilters.includes(category) ? "primary" : "outline"
                  }
                  size="small"
                  className={
                    activeFilters.includes(category)
                      ? "bg-buddy-purple text-white"
                      : "bg-white text-buddy-gray-700"
                  }
                  onClick={() => toggleFilter(category)}
                >
                  {category}
                </Button>
              ))}

              {(searchQuery ||
                (activeFilters.length > 0 &&
                  !activeFilters.includes("All"))) && (
                <Button
                  variant="ghost"
                  size="small"
                  className="text-buddy-gray-500"
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
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="my">My Activities</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">Newly Added</TabsTrigger>
            <TabsTrigger value="soon">Starting Soon</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity._id || activity.id}
                    id={activity._id || activity.id}
                    title={activity.title}
                    description={activity.description}
                    startDate={activity.startDate}
                    endDate={activity.endDate}
                    category={activity.category}
                    bannerImage={activity.bannerImage}
                    participants={activity.participants || []}
                    maxParticipants={activity.maxParticipants}
                    admin={activity.admin}
                    onClick={() =>
                      navigate(`/activities/${activity._id || activity.id}`)
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-buddy-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No activities found
                  </h3>
                  <p className="text-buddy-gray-600 mb-6">
                    We couldn't find any activities matching your search
                    criteria.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesFromStore.slice(1, 4).map((activity) => (
                <ActivityCard
                  key={activity._id || activity.id}
                  id={activity._id || activity.id}
                  title={activity.title}
                  description={activity.description}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  category={activity.category}
                  bannerImage={activity.bannerImage}
                  participants={activity.participants || []}
                  maxParticipants={activity.maxParticipants}
                  admin={activity.admin}
                  onClick={() =>
                    navigate(`/activities/${activity._id || activity.id}`)
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesFromStore.slice(0, 3).map((activity) => (
                <ActivityCard
                  key={activity._id || activity.id}
                  id={activity._id || activity.id}
                  title={activity.title}
                  description={activity.description}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  category={activity.category}
                  bannerImage={activity.bannerImage}
                  participants={activity.participants || []}
                  maxParticipants={activity.maxParticipants}
                  admin={activity.admin}
                  onClick={() =>
                    navigate(`/activities/${activity._id || activity.id}`)
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesFromStore.slice(3, 6).map((activity) => (
                <ActivityCard
                  key={activity._id || activity.id}
                  id={activity._id || activity.id}
                  title={activity.title}
                  description={activity.description}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  category={activity.category}
                  bannerImage={activity.bannerImage}
                  participants={activity.participants || []}
                  maxParticipants={activity.maxParticipants}
                  admin={activity.admin}
                  onClick={() =>
                    navigate(`/activities/${activity._id || activity.id}`)
                  }
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="soon">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activitiesFromStore.slice(0, 2).map((activity) => (
                <ActivityCard
                  key={activity._id || activity.id}
                  id={activity._id || activity.id}
                  title={activity.title}
                  description={activity.description}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  category={activity.category}
                  bannerImage={activity.bannerImage}
                  participants={activity.participants || []}
                  maxParticipants={activity.maxParticipants}
                  admin={activity.admin}
                  onClick={() =>
                    navigate(`/activities/${activity._id || activity.id}`)
                  }
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default Activities;
