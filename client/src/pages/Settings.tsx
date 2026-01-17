import React, { useState, useEffect } from "react";
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
  Sparkles,
  Settings as SettingsIcon,
  Heart,
  MapPin,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Key,
  Smartphone as Phone,
  Mail,
  Users,
  Activity,
  Target,
  Zap,
  ChevronRight,
  Upload,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Container from "@/components/ui/layout/Container";
import { toast } from "@/hooks/use-toast";
import {
  countries,
  citiesByCountry,
} from "@/lib/constants/country-city.constants";
import { activityCategories } from "@/lib/constants/category-interests.constants";
import { useAuthStore } from "@/store/auth.store";
import { AuthWall } from "@/components/auth/AuthWall";
import {
  settingsService,
  UserSettings,
  UpdateProfileData,
  UpdatePreferencesData,
  UpdateNotificationsData,
  UpdatePrivacyData,
  UpdateAccountData,
  ChangePasswordData,
} from "@/services/api/settings/settings.service";

// Avatar options (same as onboarding)
const avatarOptions = [
  { id: "avatar1", url: "/avatars/3d-avatar-1.png", label: "Adventurer" },
  { id: "avatar2", url: "/avatars/3d-avatar-2.png", label: "Explorer" },
  { id: "avatar3", url: "/avatars/3d-avatar-3.png", label: "Dreamer" },
  { id: "avatar4", url: "/avatars/3d-avatar-4.png", label: "Thinker" },
  { id: "avatar5", url: "/avatars/3d-avatar-5.png", label: "Creator" },
  { id: "avatar6", url: "/avatars/3d-avatar-6.png", label: "Leader" },
];

// Placeholder URLs for 3D avatars
for (let i = 0; i < avatarOptions.length; i++) {
  avatarOptions[i].url = `https://picsum.photos/id/${200 + i}/200`;
}

const Settings: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddInterestOpen, setIsAddInterestOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newPassword, setNewPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Country/City state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Interest selection state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Avatar state
  const [currentAvatar, setCurrentAvatar] = useState(avatarOptions[0].url);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Profile form state - initialized with user data
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    country: user?.country || "",
    city: user?.city || "",
    timezone: user?.timezone || "Pacific Time (PT)",
    interests: user?.interestsCommodities || [],
    interestsCategories: user?.interestsCategories || [],
  });

  // Settings state
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Preferences state
  const [preferences, setPreferences] = useState({
    dashboardLayout: "detailed",
    activityDisplay: "cards",
    buddyRadius: 25,
    autoAcceptBuddies: false,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    buddyRequestNotifications: true,
    activityReminderNotifications: true,
    milestoneNotifications: true,
    newsletterNotifications: false,
    quietHours: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showActivity: true,
    showLocation: false,
    showInterests: true,
    profileVisibility: "public",
    locationSharing: "city",
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: 30,
    dataRetention: "indefinite",
  });

  // Fetch user profile and settings data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await settingsService.getProfileWithSettings();

        if (response.success && response.data) {
          const { profile: profileData, settings } = response.data;

          // Update profile state with fetched data
          setProfile({
            name: profileData.name || "",
            bio: profileData.bio || "",
            email: profileData.email || "",
            phone: profileData.phoneNumber || "",
            country: profileData.country || "",
            city: profileData.city || "",
            timezone: profileData.timezone || "Pacific Time (PT)",
            interests: profileData.interestsCommodities || [],
            interestsCategories:
              profileData.interestsCategories?.map((cat) => String(cat)) || [],
          });

          // Update settings state
          setUserSettings(settings);

          // Update preferences from settings
          setPreferences({
            dashboardLayout: settings.dashboardLayout || "detailed",
            activityDisplay: settings.activityDisplay || "cards",
            buddyRadius: settings.buddyRadius || 25,
            autoAcceptBuddies: settings.autoAcceptBuddies || false,
          });

          // Update notification settings
          setNotificationSettings({
            emailNotifications: settings.emailNotifications ?? true,
            pushNotifications: settings.pushNotifications ?? true,
            buddyRequestNotifications:
              settings.buddyRequestNotifications ?? true,
            activityReminderNotifications:
              settings.activityReminderNotifications ?? true,
            milestoneNotifications: settings.milestoneNotifications ?? true,
            newsletterNotifications: settings.newsletterNotifications ?? false,
            quietHours: settings.quietHours ?? false,
            quietHoursStart: settings.quietHoursStart || "22:00",
            quietHoursEnd: settings.quietHoursEnd || "08:00",
          });

          // Update privacy settings
          setPrivacySettings({
            publicProfile: settings.publicProfile ?? true,
            showActivity: settings.showActivity ?? true,
            showLocation: settings.showLocation ?? false,
            showInterests: settings.showInterests ?? true,
            profileVisibility: settings.profileVisibility || "public",
            locationSharing: settings.locationSharing || "city",
          });

          // Update account settings
          setAccountSettings({
            twoFactorAuth: settings.twoFactorAuth ?? false,
            loginNotifications: settings.loginNotifications ?? true,
            sessionTimeout: settings.sessionTimeout || 30,
            dataRetention: settings.dataRetention || "indefinite",
          });

          // Set avatar
          if (profileData.avatar) {
            setCurrentAvatar(profileData.avatar);
          }

          // Set country and cities
          if (profileData.country) {
            setSelectedCountry(profileData.country);
            setAvailableCities(
              citiesByCountry[
                profileData.country as keyof typeof citiesByCountry
              ] || []
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // For guests, show page structure but lock content

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const updateData: UpdateProfileData = {
        name: profile.name,
        bio: profile.bio,
        phoneNumber: profile.phone,
        avatar: currentAvatar,
        country: (selectedCountry as any) || undefined,
        city: profile.city,
        interestsCategories: profile.interestsCategories as any,
        interestsCommodities: profile.interests,
      };

      const response = await settingsService.updateProfile(updateData);

      if (response.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding new interest
  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()],
      });
      setNewInterest("");
      setIsAddInterestOpen(false);
      toast({
        title: "Interest added",
        description: `${newInterest.trim()} has been added to your interests.`,
      });
    }
  };

  // Handle removing interest
  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    });
    toast({
      title: "Interest removed",
      description: `${interestToRemove} has been removed from your interests.`,
    });
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword.new !== newPassword.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.new.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const changePasswordData: ChangePasswordData = {
        currentPassword: newPassword.current,
        newPassword: newPassword.new,
        confirmPassword: newPassword.confirm,
      };

      const response = await settingsService.changePassword(changePasswordData);

      if (response.success) {
        toast({
          title: "Password changed",
          description: "Your password has been successfully updated.",
        });
        setNewPassword({ current: "", new: "", confirm: "" });
        setIsChangePasswordOpen(false);
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdatePreferencesData = {
        dashboardLayout: preferences.dashboardLayout,
        activityDisplay: preferences.activityDisplay,
        buddyRadius: preferences.buddyRadius,
        autoAcceptBuddies: preferences.autoAcceptBuddies,
      };

      const response = await settingsService.updatePreferences(updateData);

      if (response.success) {
        toast({
          title: "Preferences updated",
          description: "Your preferences have been successfully updated",
        });
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle notifications update
  const handleNotificationsUpdate = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdateNotificationsData = {
        emailNotifications: notificationSettings.emailNotifications,
        pushNotifications: notificationSettings.pushNotifications,
        buddyRequestNotifications:
          notificationSettings.buddyRequestNotifications,
        activityReminderNotifications:
          notificationSettings.activityReminderNotifications,
        milestoneNotifications: notificationSettings.milestoneNotifications,
        newsletterNotifications: notificationSettings.newsletterNotifications,
        quietHours: notificationSettings.quietHours,
        quietHoursStart: notificationSettings.quietHoursStart,
        quietHoursEnd: notificationSettings.quietHoursEnd,
      };

      const response = await settingsService.updateNotifications(updateData);

      if (response.success) {
        toast({
          title: "Notification settings updated",
          description:
            "Your notification settings have been successfully updated",
        });
      }
    } catch (error) {
      console.error("Failed to update notifications:", error);
      toast({
        title: "Error",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle privacy update
  const handlePrivacyUpdate = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdatePrivacyData = {
        publicProfile: privacySettings.publicProfile,
        showActivity: privacySettings.showActivity,
        showLocation: privacySettings.showLocation,
        showInterests: privacySettings.showInterests,
        profileVisibility: privacySettings.profileVisibility,
        locationSharing: privacySettings.locationSharing,
      };

      const response = await settingsService.updatePrivacy(updateData);

      if (response.success) {
        toast({
          title: "Privacy settings updated",
          description: "Your privacy settings have been successfully updated",
        });
      }
    } catch (error) {
      console.error("Failed to update privacy:", error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account update
  const handleAccountUpdate = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdateAccountData = {
        twoFactorAuth: accountSettings.twoFactorAuth,
        loginNotifications: accountSettings.loginNotifications,
        sessionTimeout: accountSettings.sessionTimeout,
        dataRetention: accountSettings.dataRetention,
      };

      const response = await settingsService.updateAccount(updateData);

      if (response.success) {
        toast({
          title: "Account settings updated",
          description: "Your account settings have been successfully updated",
        });
      }
    } catch (error) {
      console.error("Failed to update account:", error);
      toast({
        title: "Error",
        description: "Failed to update account settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Bio word count
  const bioWordCount = profile.bio.length;
  const bioMaxLength = 500;

  // Update available cities when country changes
  React.useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(
        citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || []
      );
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry]);

  // Handle country selection
  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    setProfile({ ...profile, country: countryId as any });
    // Reset city when country changes
    setProfile({ ...profile, city: "" });
  };

  // Handle interest toggle
  const toggleInterest = (interest: string, categoryName: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];

      // Update categories based on whether any interests in the category are selected
      setSelectedCategories((prevCategories) => {
        const hasInterestsInCategory = activityCategories
          .find((cat) => cat.value === categoryName)
          ?.interests.some((opt) => newInterests.includes(opt));

        if (hasInterestsInCategory && !prevCategories.includes(categoryName)) {
          return [...prevCategories, categoryName];
        } else if (
          !hasInterestsInCategory &&
          prevCategories.includes(categoryName)
        ) {
          return prevCategories.filter((cat) => cat !== categoryName);
        }
        return prevCategories;
      });

      return newInterests;
    });
  };

  // Handle adding selected interests to profile
  const handleAddSelectedInterests = () => {
    const newInterests = [
      ...profile.interests,
      ...selectedInterests.filter(
        (interest) => !profile.interests.includes(interest)
      ),
    ];
    setProfile({ ...profile, interests: newInterests });
    setSelectedInterests([]);
    setSelectedCategories([]);
    setIsAddInterestOpen(false);
    toast({
      title: "Interests added",
      description: `${selectedInterests.length} new interests have been added to your profile.`,
    });
  };

  // Handle avatar selection
  const handleSelectAvatar = (avatarUrl: string) => {
    setCurrentAvatar(avatarUrl);
    setUploadedImage(null);
    toast({
      title: "Avatar updated",
      description: "Your avatar has been successfully updated.",
    });
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setCurrentAvatar(result);
        toast({
          title: "Image uploaded",
          description: "Your custom image has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    });

    toast({
      title: "Privacy settings updated",
      description: `${setting} setting ${!privacySettings[setting] ? "enabled" : "disabled"}`,
    });
  };

  // Handle preferences toggle
  const handlePreferencesToggle = (setting: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [setting]: !preferences[setting],
    });

    toast({
      title: "Preferences updated",
      description: `${setting} setting ${!preferences[setting] ? "enabled" : "disabled"}`,
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (
    setting: keyof typeof notificationSettings
  ) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });

    toast({
      title: "Notification settings updated",
      description: `${setting} setting ${!notificationSettings[setting] ? "enabled" : "disabled"}`,
    });
  };

  // Handle account toggle
  const handleAccountToggle = (setting: keyof typeof accountSettings) => {
    setAccountSettings({
      ...accountSettings,
      [setting]: !accountSettings[setting],
    });

    toast({
      title: "Account settings updated",
      description: `${setting} setting ${!accountSettings[setting] ? "enabled" : "disabled"}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-6 bg-gradient-to-br from-white via-blue-50/20 to-green-50/20">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buddy-purple mx-auto mb-4"></div>
              <p className="text-buddy-gray-600">Loading your settings...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-white via-blue-50/20 to-green-50/20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-4 md:py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-buddy-gray-500 mt-1 text-sm md:text-base">
                Manage your account and preferences
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-buddy-gray-500">
                <div className="w-2 h-2 bg-buddy-green rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20 md:top-24 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <Card.Content className="p-0">
                  <nav className="flex flex-col">
                    <button
                      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 ${
                        activeTab === "profile"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "text-buddy-gray-700 hover:bg-buddy-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Profile
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 ${
                        activeTab === "preferences"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "text-buddy-gray-700 hover:bg-buddy-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setActiveTab("preferences")}
                    >
                      <div className="flex items-center">
                        <SettingsIcon className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Preferences
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 ${
                        activeTab === "notifications"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "text-buddy-gray-700 hover:bg-buddy-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setActiveTab("notifications")}
                    >
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Notifications
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 ${
                        activeTab === "privacy"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "text-buddy-gray-700 hover:bg-buddy-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setActiveTab("privacy")}
                    >
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Privacy
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      className={`flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 ${
                        activeTab === "account"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "text-buddy-gray-700 hover:bg-buddy-gray-50 hover:shadow-sm"
                      }`}
                      onClick={() => setActiveTab("account")}
                    >
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Account
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <div className="border-t border-buddy-gray-200 mx-1 md:mx-2 my-2"></div>
                    <button className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 text-left rounded-full mx-1 md:mx-2 my-1 transition-all duration-200 text-buddy-gray-700 hover:bg-red-50 hover:text-red-600">
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2 md:mr-3" />
                        <span className="font-medium text-sm md:text-base">
                          Log Out
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </nav>
                </Card.Content>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {!isAuthenticated ? (
                <div className="flex items-center justify-center min-h-[600px]">
                  <AuthWall
                    title="Sign in to manage your settings"
                    description="Update your profile, privacy, and notification preferences to personalize your Buddy experience."
                    benefits={[
                      "Customize your profile",
                      "Control privacy settings",
                      "Manage notifications",
                    ]}
                    returnToAfterAuth="/settings"
                  />
                </div>
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <Card.Header className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-b border-buddy-purple/10 p-4 md:p-6">
                      <Card.Title className="text-lg md:text-xl font-bold text-buddy-gray-900">
                        Profile Information
                      </Card.Title>
                      <Card.Description className="text-buddy-gray-600 text-sm md:text-base">
                        Update your personal information and how others see you
                        on the platform
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="p-4 md:p-6">
                      <form onSubmit={handleProfileSubmit}>
                        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-buddy-gray-200">
                          <div className="relative mb-4 md:mb-0 md:mr-6">
                            <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-md ring-4 ring-buddy-purple/20">
                              <AvatarImage
                                src={currentAvatar}
                                alt="Profile Avatar"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-buddy-purple to-buddy-orange text-white text-lg font-bold">
                                {profile.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 rounded-full w-6 h-6 md:w-8 md:h-8 p-0 bg-white shadow-md hover:bg-buddy-gray-50"
                              onClick={() => {
                                // This will be handled by the Change Avatar button below
                              }}
                            >
                              <Camera className="h-3 w-3 md:h-4 md:w-4" />
                            </Button> */}
                          </div>
                          <div className="text-center md:text-left">
                            <h3 className="text-base md:text-lg font-medium">
                              {profile.name}
                            </h3>
                            <div className="flex items-center justify-center md:justify-start space-x-2 mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple border border-buddy-purple/20">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Basic Member
                              </span>
                              <span className="text-xs text-buddy-gray-500">
                                Since {new Date().getFullYear()}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 rounded-full text-xs md:text-sm"
                                >
                                  Change Avatar
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="rounded-2xl border-2 border-buddy-purple/20 p-2 w-80">
                                <div className="space-y-4">
                                  <div className="text-center">
                                    <h4 className="font-semibold text-buddy-gray-900">
                                      Choose Avatar
                                    </h4>
                                    <p className="text-xs text-buddy-gray-500">
                                      Select from predefined avatars or upload
                                      your own
                                    </p>
                                  </div>

                                  {/* Predefined Avatars */}
                                  <div className="grid grid-cols-3 gap-2">
                                    {avatarOptions.map((avatar) => (
                                      <DropdownMenuItem
                                        key={avatar.id}
                                        onClick={() =>
                                          handleSelectAvatar(avatar.url)
                                        }
                                        className="rounded-xl p-2 hover:bg-buddy-purple/10 flex flex-col items-center"
                                      >
                                        <Avatar className="w-12 h-12 ring-2 ring-buddy-purple/20">
                                          <AvatarImage
                                            src={avatar.url}
                                            alt={avatar.label}
                                            className="object-cover"
                                          />
                                          <AvatarFallback className="bg-buddy-purple text-white text-xs">
                                            {avatar.label.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium mt-1">
                                          {avatar.label}
                                        </span>
                                      </DropdownMenuItem>
                                    ))}
                                  </div>

                                  {/* Upload Option */}
                                  <div className="border-t border-buddy-gray-200 pt-3">
                                    <label className="flex flex-col items-center p-3 border-2 border-dashed border-buddy-purple/30 rounded-xl hover:bg-buddy-purple/5 cursor-pointer transition-colors">
                                      <Upload className="h-6 w-6 text-buddy-purple mb-2" />
                                      <span className="text-sm font-medium text-buddy-gray-700">
                                        Upload Custom Image
                                      </span>
                                      <span className="text-xs text-buddy-gray-500">
                                        Max 5MB, JPG/PNG
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="flex items-center space-x-2"
                            >
                              <User className="h-4 w-4 text-buddy-purple" />
                              <span>Full Name</span>
                            </Label>
                            <Input
                              id="name"
                              value={profile.name}
                              onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                              }
                              className="rounded-full border-2 border-buddy-purple/20 focus:border-buddy-purple transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="flex items-center space-x-2"
                            >
                              <Mail className="h-4 w-4 text-buddy-blue" />
                              <span>Email Address</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  email: e.target.value,
                                })
                              }
                              className="rounded-full border-2 border-buddy-blue/20 focus:border-buddy-blue transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="phone"
                              className="flex items-center space-x-2"
                            >
                              <Phone className="h-4 w-4 text-buddy-green" />
                              <span>Phone Number</span>
                            </Label>
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  phone: e.target.value,
                                })
                              }
                              className="rounded-full border-2 border-buddy-green/20 focus:border-buddy-green transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="country"
                              className="flex items-center space-x-2"
                            >
                              <MapPin className="h-4 w-4 text-buddy-purple" />
                              <span>Country</span>
                            </Label>
                            <Select
                              value={profile.country as string}
                              onValueChange={handleCountryChange}
                            >
                              <SelectTrigger className="rounded-full border-2 border-buddy-purple/20 focus:border-buddy-purple transition-colors">
                                <SelectValue placeholder="🌍 Select your country" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-2 border-buddy-purple/20">
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.id}
                                    value={country.id}
                                    className="rounded-xl"
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="flex items-center space-x-2"
                            >
                              <MapPin className="h-4 w-4 text-buddy-green" />
                              <span>City</span>
                            </Label>
                            <Select
                              value={profile.city}
                              onValueChange={(value) =>
                                setProfile({ ...profile, city: value })
                              }
                              disabled={!selectedCountry}
                            >
                              <SelectTrigger className="rounded-full border-2 border-buddy-green/20 focus:border-buddy-green transition-colors">
                                <SelectValue placeholder="🏙️ Select your city" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-2 border-buddy-green/20">
                                {availableCities.map((city) => (
                                  <SelectItem
                                    key={city}
                                    value={city}
                                    className="rounded-xl"
                                  >
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!selectedCountry && (
                              <p className="text-xs text-buddy-gray-500">
                                💡 Please select a country first
                              </p>
                            )}
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex justify-between items-center">
                              <Label
                                htmlFor="bio"
                                className="flex items-center space-x-2"
                              >
                                <PenSquare className="h-4 w-4 text-buddy-orange" />
                                <span>Bio</span>
                              </Label>
                              <span
                                className={`text-xs ${bioWordCount > bioMaxLength ? "text-red-500" : "text-buddy-gray-500"}`}
                              >
                                {bioWordCount}/{bioMaxLength}
                              </span>
                            </div>
                            <Textarea
                              id="bio"
                              rows={4}
                              value={profile.bio}
                              onChange={(e) => {
                                if (e.target.value.length <= bioMaxLength) {
                                  setProfile({
                                    ...profile,
                                    bio: e.target.value,
                                  });
                                }
                              }}
                              placeholder="Tell us a bit about yourself..."
                              className="resize-none rounded-2xl border-2 border-buddy-orange/20 focus:border-buddy-orange transition-colors"
                            />
                            {bioWordCount > bioMaxLength && (
                              <p className="text-xs text-red-500">
                                Bio is too long. Please reduce by{" "}
                                {bioWordCount - bioMaxLength} characters.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                          <h3 className="font-medium text-sm md:text-base">
                            Interests
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-buddy-purple/10 text-buddy-purple hover:bg-buddy-purple/20 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                {interest}
                                <button
                                  onClick={() => handleRemoveInterest(interest)}
                                  className="ml-1 text-buddy-purple/70 hover:text-buddy-purple transition-colors"
                                >
                                  <span className="sr-only">
                                    Remove {interest}
                                  </span>
                                  &times;
                                </button>
                              </Badge>
                            ))}
                            <Dialog
                              open={isAddInterestOpen}
                              onOpenChange={setIsAddInterestOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full border-dashed border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple/5"
                                >
                                  + Add Interest
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>
                                    Select Your Interests
                                  </DialogTitle>
                                  <p className="text-sm text-buddy-gray-600">
                                    Choose from our curated list of interests to
                                    find better buddy matches
                                  </p>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Interest Counter */}
                                  <div className="bg-gradient-to-r from-buddy-purple/10 to-buddy-orange/10 p-4 rounded-2xl border border-buddy-purple/20">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <Target className="h-5 w-5 text-buddy-purple" />
                                        <span className="font-semibold text-buddy-gray-900">
                                          Selected Interests
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-buddy-purple text-white">
                                          {selectedInterests.length}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Interest Categories */}
                                  <ScrollArea className="h-[400px] w-full">
                                    <div className="space-y-6 pr-4">
                                      {activityCategories.map((category) => (
                                        <div
                                          key={category.value}
                                          className="space-y-4"
                                        >
                                          <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-gradient-to-r from-buddy-purple to-buddy-orange rounded-full"></div>
                                            <h6 className="font-bold text-lg text-buddy-gray-900">
                                              {category.label}
                                            </h6>
                                          </div>
                                          <div className="flex flex-wrap gap-3">
                                            {category.interests.map(
                                              (interest) => {
                                                const isSelected =
                                                  selectedInterests.includes(
                                                    interest
                                                  );
                                                return (
                                                  <button
                                                    key={interest}
                                                    type="button"
                                                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                                                      isSelected
                                                        ? "bg-gradient-to-r from-buddy-purple to-buddy-orange text-white shadow-lg"
                                                        : "bg-buddy-gray-100 text-buddy-gray-700 hover:bg-buddy-gray-200 border-2 border-transparent hover:border-buddy-purple/20"
                                                    }`}
                                                    onClick={() =>
                                                      toggleInterest(
                                                        interest,
                                                        category.value
                                                      )
                                                    }
                                                  >
                                                    {interest}
                                                  </button>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>

                                  {/* Action Buttons */}
                                  <div className="flex justify-end space-x-2 pt-4 border-t border-buddy-gray-200">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedInterests([]);
                                        setSelectedCategories([]);
                                        setIsAddInterestOpen(false);
                                      }}
                                      className="rounded-full"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleAddSelectedInterests}
                                      disabled={selectedInterests.length === 0}
                                      className="rounded-full"
                                    >
                                      Add {selectedInterests.length} Interest
                                      {selectedInterests.length !== 1
                                        ? "s"
                                        : ""}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                          <h3 className="font-medium text-sm md:text-base">
                            Password
                          </h3>
                          <div className="flex items-center justify-between p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Lock className="h-4 w-4 md:h-5 md:w-5 text-buddy-gray-500 mr-2" />
                              <span className="text-sm md:text-base">
                                Password
                              </span>
                            </div>
                            <Dialog
                              open={isChangePasswordOpen}
                              onOpenChange={setIsChangePasswordOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs md:text-sm"
                                >
                                  Change Password
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="current-password">
                                      Current Password
                                    </Label>
                                    <Input
                                      id="current-password"
                                      type="password"
                                      value={newPassword.current}
                                      onChange={(e) =>
                                        setNewPassword({
                                          ...newPassword,
                                          current: e.target.value,
                                        })
                                      }
                                      placeholder="Enter current password"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="new-password">
                                      New Password
                                    </Label>
                                    <Input
                                      id="new-password"
                                      type="password"
                                      value={newPassword.new}
                                      onChange={(e) =>
                                        setNewPassword({
                                          ...newPassword,
                                          new: e.target.value,
                                        })
                                      }
                                      placeholder="Enter new password"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="confirm-password">
                                      Confirm New Password
                                    </Label>
                                    <Input
                                      id="confirm-password"
                                      type="password"
                                      value={newPassword.confirm}
                                      onChange={(e) =>
                                        setNewPassword({
                                          ...newPassword,
                                          confirm: e.target.value,
                                        })
                                      }
                                      placeholder="Confirm new password"
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setNewPassword({
                                          current: "",
                                          new: "",
                                          confirm: "",
                                        });
                                        setIsChangePasswordOpen(false);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handlePasswordChange}
                                      disabled={
                                        !newPassword.current ||
                                        !newPassword.new ||
                                        !newPassword.confirm
                                      }
                                    >
                                      Change Password
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button
                            variant="outline"
                            className="rounded-full text-sm md:text-base"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <Card.Header className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-b border-buddy-purple/10 p-4 md:p-6">
                      <Card.Title className="text-lg md:text-xl font-bold text-buddy-gray-900">
                        Preferences
                      </Card.Title>
                      <Card.Description className="text-buddy-gray-600 text-sm md:text-base">
                        Customize your app experience and onboarding settings
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="p-4 md:p-6">
                      <div className="space-y-6 md:space-y-8">
                        {/* App Experience */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-base md:text-lg font-semibold text-buddy-gray-900 flex items-center">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-buddy-purple" />
                            App Experience
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dashboard-layout">
                                Dashboard Layout
                              </Label>
                              <Select
                                value={preferences.dashboardLayout}
                                onValueChange={(value) =>
                                  setPreferences({
                                    ...preferences,
                                    dashboardLayout: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select layout" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="detailed">
                                    Detailed View
                                  </SelectItem>
                                  <SelectItem value="compact">
                                    Compact View
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="activity-display">
                                Activity Display
                              </Label>
                              <Select
                                value={preferences.activityDisplay}
                                onValueChange={(value) =>
                                  setPreferences({
                                    ...preferences,
                                    activityDisplay: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select display style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cards">
                                    Card Style
                                  </SelectItem>
                                  <SelectItem value="list">
                                    List Style
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Buddy Preferences */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-base md:text-lg font-semibold text-buddy-gray-900 flex items-center">
                            <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-buddy-blue" />
                            Buddy Preferences
                          </h3>
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-buddy-gray-50 rounded-lg space-y-3 sm:space-y-0">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <MapPin className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Connection Radius
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Find buddies within{" "}
                                    {preferences.buddyRadius} miles
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Slider
                                  value={[preferences.buddyRadius]}
                                  onValueChange={(value) =>
                                    setPreferences({
                                      ...preferences,
                                      buddyRadius: value[0],
                                    })
                                  }
                                  max={100}
                                  min={5}
                                  step={5}
                                  className="w-20 md:w-24"
                                />
                                <span className="text-xs md:text-sm font-medium w-8 md:w-10">
                                  {preferences.buddyRadius}mi
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-buddy-green/10 p-2 rounded-full mr-3">
                                  <Check className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Auto-accept Buddy Requests
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Automatically accept requests from users
                                    with similar interests
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={preferences.autoAcceptBuddies}
                                onCheckedChange={() =>
                                  handlePreferencesToggle("autoAcceptBuddies")
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 md:pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base w-full sm:w-auto">
                            Save Preferences
                          </Button>
                        </div>
                      </div>
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
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <Card.Header className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-b border-buddy-purple/10 p-4 md:p-6">
                      <Card.Title className="text-lg md:text-xl font-bold text-buddy-gray-900">
                        Notification Preferences
                      </Card.Title>
                      <Card.Description className="text-buddy-gray-600 text-sm md:text-base">
                        Manage how and when you receive notifications
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="p-4 md:p-6">
                      <div className="space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="font-medium text-sm md:text-base">
                            Notification Channels
                          </h3>
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Email Notifications
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Receive notifications via email
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={
                                  notificationSettings.emailNotifications
                                }
                                onCheckedChange={() =>
                                  handleNotificationToggle("emailNotifications")
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Smartphone className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Push Notifications
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Receive notifications on your device
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={notificationSettings.pushNotifications}
                                onCheckedChange={() =>
                                  handleNotificationToggle("pushNotifications")
                                }
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
                                  <span className="font-medium text-sm md:text-base">
                                    Buddy Requests
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    When someone sends you a buddy request
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={
                                  notificationSettings.buddyRequestNotifications
                                }
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    "buddyRequestNotifications"
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-blue p-2 rounded-full mr-3">
                                  <Calendar className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Activity Reminders
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Reminders about upcoming activities
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={
                                  notificationSettings.activityReminderNotifications
                                }
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    "activityReminderNotifications"
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-yellow p-2 rounded-full mr-3">
                                  <Check className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Milestone Achievements
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    When you reach goals and milestones
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={
                                  notificationSettings.milestoneNotifications
                                }
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    "milestoneNotifications"
                                  )
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-pastel-green p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Newsletter
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Monthly updates and tips
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={
                                  notificationSettings.newsletterNotifications
                                }
                                onCheckedChange={() =>
                                  handleNotificationToggle(
                                    "newsletterNotifications"
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 md:pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm md:text-base w-full sm:w-auto">
                            Save Preferences
                          </Button>
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
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <Card.Header className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-b border-buddy-purple/10 p-4 md:p-6">
                      <Card.Title className="text-lg md:text-xl font-bold text-buddy-gray-900">
                        Privacy Settings
                      </Card.Title>
                      <Card.Description className="text-buddy-gray-600 text-sm md:text-base">
                        Control your privacy and what information is visible to
                        others
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="p-4 md:p-6">
                      <div className="space-y-4 md:space-y-6">
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="font-medium text-sm md:text-base">
                            Profile Visibility
                          </h3>
                          <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-purple/10 p-2 rounded-full mr-3">
                                  <User className="h-4 w-4 text-buddy-purple" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Public Profile
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Allow others to find and view your profile
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={privacySettings.publicProfile}
                                onCheckedChange={() =>
                                  handlePrivacyToggle("publicProfile")
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Calendar className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Activity Visibility
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Show your activity progress to others
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={privacySettings.showActivity}
                                onCheckedChange={() =>
                                  handlePrivacyToggle("showActivity")
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-green/10 p-2 rounded-full mr-3">
                                  <Globe className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Location Sharing
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Show your general location to others
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={privacySettings.showLocation}
                                onCheckedChange={() =>
                                  handlePrivacyToggle("showLocation")
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-buddy-gray-100">
                              <div className="flex items-center">
                                <div className="bg-buddy-orange/10 p-2 rounded-full mr-3">
                                  <Check className="h-4 w-4 text-buddy-orange" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Interest Visibility
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Show your interests to potential buddies
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={privacySettings.showInterests}
                                onCheckedChange={() =>
                                  handlePrivacyToggle("showInterests")
                                }
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
                                  <span className="font-medium">
                                    Download Your Data
                                  </span>
                                  <p className="text-sm text-buddy-gray-500">
                                    Get a copy of your personal data
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full"
                                >
                                  Request Data
                                </Button>
                              </div>
                            </div>

                            <div className="p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-destructive">
                                    Delete Account
                                  </span>
                                  <p className="text-sm text-buddy-gray-500">
                                    Permanently delete your account and data
                                  </p>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="rounded-full"
                                >
                                  Delete Account
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                            Save Privacy Settings
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                    <Card.Header className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-b border-buddy-purple/10 p-4 md:p-6">
                      <Card.Title className="text-lg md:text-xl font-bold text-buddy-gray-900">
                        Account Management
                      </Card.Title>
                      <Card.Description className="text-buddy-gray-600 text-sm md:text-base">
                        Manage your subscription, security, and account settings
                      </Card.Description>
                    </Card.Header>
                    <Card.Content className="p-4 md:p-6">
                      <div className="space-y-6 md:space-y-8">
                        {/* Subscription Section */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-base md:text-lg font-semibold text-buddy-gray-900 flex items-center">
                            <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2 text-buddy-purple" />
                            Subscription Plan
                          </h3>
                          <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 border border-buddy-purple/20">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="inline-block px-3 py-1 bg-white text-buddy-purple text-xs font-medium rounded-full">
                                  Current Plan
                                </span>
                                <h3 className="font-bold text-lg md:text-xl mt-2">
                                  Basic (Free)
                                </h3>
                              </div>
                              <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-xs md:text-sm">
                                Upgrade Now
                              </Button>
                            </div>
                            <p className="text-xs md:text-sm text-buddy-gray-600 mb-4">
                              You're currently on the Basic plan. Upgrade to
                              Premium for advanced features and unlimited
                              activities.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center">
                                <Check className="text-buddy-green mr-2 h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-xs md:text-sm">
                                  Up to 3 active activities
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Check className="text-buddy-green mr-2 h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-xs md:text-sm">
                                  Basic progress tracking
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Check className="text-buddy-green mr-2 h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-xs md:text-sm">
                                  Connect with up to 5 buddies
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Check className="text-buddy-green mr-2 h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-xs md:text-sm">
                                  Community forum access
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Security Section */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-base md:text-lg font-semibold text-buddy-gray-900 flex items-center">
                            <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-buddy-blue" />
                            Security Settings
                          </h3>
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center justify-between p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-buddy-blue/10 p-2 rounded-full mr-3">
                                  <Key className="h-4 w-4 text-buddy-blue" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Two-Factor Authentication
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Add an extra layer of security to your
                                    account
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={accountSettings.twoFactorAuth}
                                onCheckedChange={() =>
                                  handleAccountToggle("twoFactorAuth")
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-buddy-green/10 p-2 rounded-full mr-3">
                                  <Bell className="h-4 w-4 text-buddy-green" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Login Notifications
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Get notified when someone logs into your
                                    account
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={accountSettings.loginNotifications}
                                onCheckedChange={() =>
                                  handleAccountToggle("loginNotifications")
                                }
                              />
                            </div>
                            <div className="p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Change Password
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Update your account password
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs md:text-sm"
                                >
                                  Change Password
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data Management */}
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-base md:text-lg font-semibold text-buddy-gray-900 flex items-center">
                            <Download className="w-4 h-4 md:w-5 md:h-5 mr-2 text-buddy-green" />
                            Data Management
                          </h3>
                          <div className="space-y-2 md:space-y-3">
                            <div className="p-3 md:p-4 bg-buddy-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-sm md:text-base">
                                    Download Your Data
                                  </span>
                                  <p className="text-xs md:text-sm text-buddy-gray-500">
                                    Get a copy of your personal data
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs md:text-sm"
                                >
                                  Request Data
                                </Button>
                              </div>
                            </div>
                            <div className="p-3 md:p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-red-600 text-sm md:text-base">
                                    Delete Account
                                  </span>
                                  <p className="text-xs md:text-sm text-red-500">
                                    Permanently delete your account and data
                                  </p>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="rounded-full text-xs md:text-sm"
                                >
                                  Delete Account
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-buddy-gray-200">
                          <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                            Save Account Settings
                          </Button>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Settings;
