
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Smartphone,
  Globe,
  CreditCard,
  LogOut,
  Camera,
  Save,
  Check,
  Lock,
  Moon,
  PenSquare,
  Clock,
  Calendar,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Container from "@/components/ui/layout/Container";
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: "John Doe",
    bio: "I'm passionate about fitness, reading, and coding. Looking for buddies to join me on my journey!",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    timezone: "Pacific Time (PT)",
    interests: ["Fitness", "Reading", "Coding", "Meditation"]
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    buddyRequests: true,
    activityReminders: true,
    milestones: true,
    newsletter: false
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showActivity: true,
    showLocation: false,
    showInterests: true
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
    animations: true
  });

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
    
    toast({
      title: "Notification settings updated",
      description: `${setting} notifications ${!notificationSettings[setting] ? 'enabled' : 'disabled'}`,
    });
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
    
    toast({
      title: "Privacy settings updated",
      description: `${setting} setting ${!privacySettings[setting] ? 'enabled' : 'disabled'}`,
    });
  };

  // Handle appearance toggle
  const handleAppearanceToggle = (setting: keyof typeof appearance) => {
    setAppearance({
      ...appearance,
      [setting]: !appearance[setting]
    });
    
    toast({
      title: "Appearance settings updated",
      description: `${setting} setting ${!appearance[setting] ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-white via-blue-50/20 to-green-50/20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-buddy-gray-900">Settings</h1>
              <p className="text-buddy-gray-500 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <Card.Content className="p-0">
                  <nav className="flex flex-col">
                    <button
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === "profile" 
                          ? "bg-buddy-purple text-white" 
                          : "text-buddy-gray-700 hover:bg-buddy-gray-100"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>Profile</span>
                    </button>
                    <button
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === "notifications" 
                          ? "bg-buddy-purple text-white" 
                          : "text-buddy-gray-700 hover:bg-buddy-gray-100"
                      }`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      <span>Notifications</span>
                    </button>
                    <button
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === "privacy" 
                          ? "bg-buddy-purple text-white" 
                          : "text-buddy-gray-700 hover:bg-buddy-gray-100"
                      }`}
                      onClick={() => setActiveTab("privacy")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Privacy</span>
                    </button>
                    <button
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === "appearance" 
                          ? "bg-buddy-purple text-white" 
                          : "text-buddy-gray-700 hover:bg-buddy-gray-100"
                      }`}
                      onClick={() => setActiveTab("appearance")}
                    >
                      <PenSquare className="w-4 h-4 mr-2" />
                      <span>Appearance</span>
                    </button>
                    <button
                      className={`flex items-center px-4 py-3 text-left ${
                        activeTab === "subscription" 
                          ? "bg-buddy-purple text-white" 
                          : "text-buddy-gray-700 hover:bg-buddy-gray-100"
                      }`}
                      onClick={() => setActiveTab("subscription")}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Subscription</span>
                    </button>
                    <button
                      className="flex items-center px-4 py-3 text-left text-buddy-gray-700 hover:bg-buddy-gray-100 border-t border-buddy-gray-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log Out</span>
                    </button>
                  </nav>
                </Card.Content>
              </Card>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Header>
                      <Card.Title>Profile Information</Card.Title>
                      <Card.Description>Update your personal information and how others see you on the platform</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <form onSubmit={handleProfileSubmit}>
                        <div className="flex flex-col md:flex-row items-center mb-6 pb-6 border-b border-buddy-gray-200">
                          <div className="relative mb-4 md:mb-0 md:mr-6">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                              <AvatarImage src="https://github.com/shadcn.png" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-center md:text-left">
                            <h3 className="text-lg font-medium">{profile.name}</h3>
                            <p className="text-buddy-gray-500 text-sm">Basic Member</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Change Avatar
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={profile.name} 
                              onChange={(e) => setProfile({...profile, name: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={profile.email} 
                              onChange={(e) => setProfile({...profile, email: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              value={profile.phone} 
                              onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              value={profile.location} 
                              onChange={(e) => setProfile({...profile, location: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio" 
                              rows={4} 
                              value={profile.bio} 
                              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                              placeholder="Tell us a bit about yourself..." 
                              className="resize-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <h3 className="font-medium">Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                              <div key={index} className="bg-buddy-purple-50 text-buddy-purple px-3 py-1 rounded-full text-sm flex items-center">
                                {interest}
                                <button className="ml-2 text-buddy-purple-dark hover:text-buddy-purple">
                                  <span className="sr-only">Remove {interest}</span>
                                  &times;
                                </button>
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="rounded-full">
                              + Add Interest
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <h3 className="font-medium">Password</h3>
                          <div className="flex items-center justify-between p-4 bg-buddy-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Lock className="h-5 w-5 text-buddy-gray-500 mr-2" />
                              <span>Password</span>
                            </div>
                            <Button variant="outline" size="sm">Change Password</Button>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Button variant="outline">Cancel</Button>
                          <Button type="submit" className="bg-buddy-purple text-white">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Header>
                      <Card.Title>Notification Preferences</Card.Title>
                      <Card.Description>Manage how and when you receive notifications</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Notification Channels</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium">Email Notifications</span>
                                  <p className="text-sm text-buddy-gray-500">Receive notifications via email</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.email}
                                onCheckedChange={() => handleNotificationToggle('email')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Smartphone className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium">Push Notifications</span>
                                  <p className="text-sm text-buddy-gray-500">Receive notifications on your device</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.push}
                                onCheckedChange={() => handleNotificationToggle('push')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Notification Types</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-purple p-2 rounded-full mr-3">
                                  <User className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium">Buddy Requests</span>
                                  <p className="text-sm text-buddy-gray-500">When someone sends you a buddy request</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.buddyRequests}
                                onCheckedChange={() => handleNotificationToggle('buddyRequests')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-blue p-2 rounded-full mr-3">
                                  <Calendar className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium">Activity Reminders</span>
                                  <p className="text-sm text-buddy-gray-500">Reminders about upcoming activities</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.activityReminders}
                                onCheckedChange={() => handleNotificationToggle('activityReminders')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-yellow p-2 rounded-full mr-3">
                                  <Check className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                  <span className="font-medium">Milestone Achievements</span>
                                  <p className="text-sm text-buddy-gray-500">When you reach goals and milestones</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.milestones}
                                onCheckedChange={() => handleNotificationToggle('milestones')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-green p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium">Newsletter</span>
                                  <p className="text-sm text-buddy-gray-500">Monthly updates and tips</p>
                                </div>
                              </div>
                              <Switch 
                                checked={notificationSettings.newsletter}
                                onCheckedChange={() => handleNotificationToggle('newsletter')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-buddy-purple text-white">Save Preferences</Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Header>
                      <Card.Title>Privacy Settings</Card.Title>
                      <Card.Description>Control your privacy and what information is visible to others</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Profile Visibility</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                                  <User className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium">Public Profile</span>
                                  <p className="text-sm text-buddy-gray-500">Allow others to find and view your profile</p>
                                </div>
                              </div>
                              <Switch 
                                checked={privacySettings.publicProfile}
                                onCheckedChange={() => handlePrivacyToggle('publicProfile')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Calendar className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium">Activity Visibility</span>
                                  <p className="text-sm text-buddy-gray-500">Show your activity progress to others</p>
                                </div>
                              </div>
                              <Switch 
                                checked={privacySettings.showActivity}
                                onCheckedChange={() => handlePrivacyToggle('showActivity')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-green/10 p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium">Location Sharing</span>
                                  <p className="text-sm text-buddy-gray-500">Show your general location to others</p>
                                </div>
                              </div>
                              <Switch 
                                checked={privacySettings.showLocation}
                                onCheckedChange={() => handlePrivacyToggle('showLocation')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-orange/10 p-2 rounded-full mr-3">
                                  <Check className="h-4 w-4 text-buddy-orange" />
                                </div>
                                <div>
                                  <span className="font-medium">Interest Visibility</span>
                                  <p className="text-sm text-buddy-gray-500">Show your interests to potential buddies</p>
                                </div>
                              </div>
                              <Switch 
                                checked={privacySettings.showInterests}
                                onCheckedChange={() => handlePrivacyToggle('showInterests')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Data Management</h3>
                          <div className="space-y-3">
                            <div className="p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">Download Your Data</span>
                                  <p className="text-sm text-buddy-gray-500">Get a copy of your personal data</p>
                                </div>
                                <Button variant="outline" size="sm">Request Data</Button>
                              </div>
                            </div>

                            <div className="p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-destructive">Delete Account</span>
                                  <p className="text-sm text-buddy-gray-500">Permanently delete your account and data</p>
                                </div>
                                <Button variant="destructive" size="sm">Delete Account</Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-buddy-purple text-white">Save Privacy Settings</Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Header>
                      <Card.Title>Appearance Settings</Card.Title>
                      <Card.Description>Customize how Buddy looks and feels for you</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium">Theme Preferences</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                                  <Moon className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium">Dark Mode</span>
                                  <p className="text-sm text-buddy-gray-500">Enable dark theme for the app</p>
                                </div>
                              </div>
                              <Switch 
                                checked={appearance.darkMode}
                                onCheckedChange={() => handleAppearanceToggle('darkMode')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium">Compact View</span>
                                  <p className="text-sm text-buddy-gray-500">Show more content with less spacing</p>
                                </div>
                              </div>
                              <Switch 
                                checked={appearance.compactView}
                                onCheckedChange={() => handleAppearanceToggle('compactView')}
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-green/10 p-2 rounded-full mr-3">
                                  <Sparkles className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium">Enable Animations</span>
                                  <p className="text-sm text-buddy-gray-500">Show interface animations and transitions</p>
                                </div>
                              </div>
                              <Switch 
                                checked={appearance.animations}
                                onCheckedChange={() => handleAppearanceToggle('animations')}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Regional Settings</h3>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-4 w-4 text-buddy-gray-500" />
                                  </div>
                                  <select
                                    id="timezone"
                                    className="pl-10 block w-full rounded-md border border-buddy-gray-300 py-2 text-sm shadow-sm focus:border-buddy-purple focus:ring-buddy-purple"
                                    defaultValue="Pacific Time (PT)"
                                  >
                                    <option>Pacific Time (PT)</option>
                                    <option>Mountain Time (MT)</option>
                                    <option>Central Time (CT)</option>
                                    <option>Eastern Time (ET)</option>
                                    <option>UTC</option>
                                    <option>Central European Time (CET)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-buddy-gray-500" />
                                  </div>
                                  <select
                                    id="language"
                                    className="pl-10 block w-full rounded-md border border-buddy-gray-300 py-2 text-sm shadow-sm focus:border-buddy-purple focus:ring-buddy-purple"
                                    defaultValue="English (US)"
                                  >
                                    <option>English (US)</option>
                                    <option>English (UK)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                    <option>Japanese</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-buddy-purple text-white">Save Appearance Settings</Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <Card.Header>
                      <Card.Title>Subscription Plan</Card.Title>
                      <Card.Description>Manage your subscription and payment details</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 border border-buddy-purple/20">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="inline-block px-3 py-1 bg-white text-buddy-purple text-xs font-medium rounded-full">
                                Current Plan
                              </span>
                              <h3 className="font-bold text-xl mt-2">Basic (Free)</h3>
                            </div>
                            <Button className="bg-buddy-purple text-white">
                              Upgrade Now
                            </Button>
                          </div>
                          <p className="text-sm text-buddy-gray-600 mb-4">
                            You're currently on the Basic plan. Upgrade to Premium for advanced features and unlimited activities.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Check className="text-buddy-green mr-2 h-5 w-5" />
                              <span className="text-sm">Up to 3 active activities</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="text-buddy-green mr-2 h-5 w-5" />
                              <span className="text-sm">Basic progress tracking</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="text-buddy-green mr-2 h-5 w-5" />
                              <span className="text-sm">Connect with up to 5 buddies</span>
                            </div>
                            <div className="flex items-center">
                              <Check className="text-buddy-green mr-2 h-5 w-5" />
                              <span className="text-sm">Community forum access</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Available Plans</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl p-6 border border-buddy-gray-200 bg-white hover:shadow-md transition-shadow">
                              <h4 className="font-bold text-lg">Premium</h4>
                              <div className="my-2">
                                <span className="text-2xl font-bold">$9.99</span>
                                <span className="text-buddy-gray-500">/month</span>
                              </div>
                              <ul className="space-y-2 mb-4">
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Unlimited activities</span>
                                </li>
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Advanced analytics</span>
                                </li>
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Unlimited buddy connections</span>
                                </li>
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Priority support</span>
                                </li>
                              </ul>
                              <Button className="w-full bg-buddy-purple text-white">Select Plan</Button>
                            </div>

                            <div className="rounded-xl p-6 border border-buddy-gray-200 bg-white hover:shadow-md transition-shadow">
                              <h4 className="font-bold text-lg">Annual</h4>
                              <div className="my-2">
                                <span className="text-2xl font-bold">$89.99</span>
                                <span className="text-buddy-gray-500">/year</span>
                              </div>
                              <div className="inline-block px-2 py-1 bg-buddy-green/10 text-buddy-green text-xs font-medium rounded-full mb-2">
                                Save 25%
                              </div>
                              <ul className="space-y-2 mb-4">
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">All Premium features</span>
                                </li>
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Annual savings of 25%</span>
                                </li>
                                <li className="flex items-center">
                                  <Check className="text-buddy-green mr-2 h-4 w-4" />
                                  <span className="text-sm">Exclusive yearly challenges</span>
                                </li>
                              </ul>
                              <Button className="w-full bg-buddy-purple text-white">Select Plan</Button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-buddy-gray-50 rounded-lg">
                          <h3 className="font-medium mb-2">Payment Methods</h3>
                          <p className="text-sm text-buddy-gray-500 mb-4">Securely manage your payment methods</p>
                          <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Add Payment Method
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Settings;
