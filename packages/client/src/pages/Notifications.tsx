
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  UserPlus,
  MessageSquare,
  Trophy,
  Check,
  HeartHandshake,
  Sparkles,
  Trash2,
  Clock,
  ChevronRight,
  Filter
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Container from "@/components/ui/layout/Container";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "buddy",
      title: "New Buddy Request",
      message: "Emma Wilson sent you a buddy request",
      time: "Just now",
      read: false,
      user: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      actions: ["accept", "decline"]
    },
    {
      id: 2,
      type: "milestone",
      title: "Milestone Achieved",
      message: "You've completed 10 consecutive days of meditation!",
      time: "2 hours ago",
      read: false,
      icon: <Trophy />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      id: 3,
      type: "activity",
      title: "Activity Reminder",
      message: "Your 'Morning Yoga' session is scheduled in 15 minutes",
      time: "3 hours ago",
      read: false,
      icon: <Calendar />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 4,
      type: "system",
      title: "Welcome to Buddy!",
      message: "Thanks for joining. Complete your profile to get started.",
      time: "1 day ago",
      read: true,
      icon: <HeartHandshake />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 5,
      type: "comment",
      title: "New Comment",
      message: "James Lee commented on your activity",
      time: "2 days ago",
      read: true,
      user: {
        name: "James Lee",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      content: "Great progress! Keep it up!"
    },
    {
      id: 6,
      type: "buddy",
      title: "New Buddy Match",
      message: "We found a perfect buddy match for you!",
      time: "3 days ago",
      read: true,
      user: {
        name: "Sarah Parker",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      actions: ["view"]
    },
    {
      id: 7,
      type: "activity",
      title: "New Challenge",
      message: "30-Day Coding Challenge has been created. Join now!",
      time: "4 days ago",
      read: true,
      icon: <Sparkles />,
      color: "bg-green-100 text-green-600",
      actions: ["view"]
    },
  ]);

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "All notifications marked as read",
      description: "Your notification feed has been updated",
    });
  };

  const handleMarkAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const handleDeleteNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    toast({
      title: "Notification deleted",
      description: "The notification has been removed from your feed",
    });
  };

  const handleAction = (id: number, action: string) => {
    // Handle action based on type
    if (action === "accept") {
      toast({
        title: "Buddy request accepted",
        description: "You are now connected with a new buddy",
      });
    } else if (action === "decline") {
      toast({
        title: "Buddy request declined",
        description: "The buddy request has been declined",
      });
    } else if (action === "view") {
      // Navigate to the relevant page
      console.log("View action for notification", id);
    }
    
    // Mark as read after action
    handleMarkAsRead(id);
  };

  const filteredNotifications = filter === "all" 
    ? notifications 
    : filter === "unread" 
    ? notifications.filter(n => !n.read) 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                <Bell className="w-6 h-6 text-buddy-purple" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-buddy-gray-900">Notifications</h1>
                <p className="text-buddy-gray-500 mt-1">
                  Stay updated with your activities and buddies
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark all as read
                </Button>
              )}
              <Button variant="ghost" size="sm" className="bg-white/80 shadow-sm border border-buddy-gray-200">
                <Filter className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <Card.Content className="p-4">
                  <div className="font-medium text-buddy-gray-900 mb-3">Filter by</div>
                  <ToggleGroup 
                    type="single" 
                    value={filter}
                    onValueChange={(value) => value && setFilter(value)}
                    className="flex flex-col space-y-1 w-full"
                  >
                    <ToggleGroupItem 
                      value="all" 
                      className={`flex items-center justify-start px-3 py-2 rounded-lg w-full ${filter === 'all' ? 'bg-buddy-purple text-white' : 'hover:bg-buddy-gray-100'}`}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      <span>All Notifications</span>
                      <Badge className="ml-auto">{notifications.length}</Badge>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="unread" 
                      className={`flex items-center justify-start px-3 py-2 rounded-lg w-full ${filter === 'unread' ? 'bg-buddy-purple text-white' : 'hover:bg-buddy-gray-100'}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>Unread</span>
                      <Badge className="ml-auto">{unreadCount}</Badge>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="buddy" 
                      className={`flex items-center justify-start px-3 py-2 rounded-lg w-full ${filter === 'buddy' ? 'bg-buddy-purple text-white' : 'hover:bg-buddy-gray-100'}`}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      <span>Buddy Requests</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="activity" 
                      className={`flex items-center justify-start px-3 py-2 rounded-lg w-full ${filter === 'activity' ? 'bg-buddy-purple text-white' : 'hover:bg-buddy-gray-100'}`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Activities</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="milestone" 
                      className={`flex items-center justify-start px-3 py-2 rounded-lg w-full ${filter === 'milestone' ? 'bg-buddy-purple text-white' : 'hover:bg-buddy-gray-100'}`}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>Milestones</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Card.Content>
              </Card>
            </div>

            {/* Notification List */}
            <div className="md:col-span-3 space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12">
                  <div className="bg-buddy-purple/10 p-4 rounded-full mb-4">
                    <Bell className="w-12 h-12 text-buddy-purple/60" />
                  </div>
                  <h3 className="text-xl font-medium text-buddy-gray-700 mb-2">No notifications found</h3>
                  <p className="text-buddy-gray-500 text-center max-w-md">
                    {filter === "all" 
                      ? "You don't have any notifications yet. Check back later!" 
                      : `No ${filter} notifications at the moment.`}
                  </p>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Card 
                      className={`relative overflow-hidden transition-all ${notification.read ? 'bg-white' : 'bg-buddy-purple-50/60 border-l-4 border-l-buddy-purple'}`}
                    >
                      <Card.Content className="p-4">
                        <div className="flex">
                          {notification.user ? (
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                              <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${notification.color || 'bg-buddy-purple-100 text-buddy-purple'}`}>
                              {notification.icon || <Bell className="h-5 w-5" />}
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-buddy-gray-900">{notification.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-buddy-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {notification.time}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 rounded-full hover:bg-buddy-gray-100" 
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-buddy-gray-500" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-buddy-gray-600 mt-1">{notification.message}</p>
                            
                            {notification.content && (
                              <div className="mt-2 p-2 bg-buddy-gray-50 rounded-md text-sm text-buddy-gray-700">
                                {notification.content}
                              </div>
                            )}
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="mt-3 flex space-x-2">
                                {notification.actions.includes('accept') && (
                                  <Button 
                                    size="sm" 
                                    className="bg-buddy-purple text-white" 
                                    onClick={() => handleAction(notification.id, 'accept')}
                                  >
                                    Accept
                                  </Button>
                                )}
                                {notification.actions.includes('decline') && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleAction(notification.id, 'decline')}
                                  >
                                    Decline
                                  </Button>
                                )}
                                {notification.actions.includes('view') && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-buddy-purple" 
                                    onClick={() => handleAction(notification.id, 'view')}
                                  >
                                    View <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Notifications;
