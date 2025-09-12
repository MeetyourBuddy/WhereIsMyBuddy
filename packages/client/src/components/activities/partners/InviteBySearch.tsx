import React, { useState, useEffect } from "react";
import { Search, UserPlus, Users, Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth.store";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isPartner?: boolean;
  isPending?: boolean;
}

interface InviteBySearchProps {
  activityId: string;
  onInviteSent: () => void;
}

const InviteBySearch: React.FC<InviteBySearchProps> = ({
  activityId,
  onInviteSent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock search function - replace with real API call
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - replace with real API call
      const mockUsers: User[] = [
        {
          _id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg",
          isPartner: false,
          isPending: false,
        },
        {
          _id: "2",
          name: "Jamie Smith",
          email: "jamie@example.com",
          avatar: "/placeholder.svg",
          isPartner: true,
          isPending: false,
        },
        {
          _id: "3",
          name: "Taylor Brown",
          email: "taylor@example.com",
          avatar: "/placeholder.svg",
          isPartner: false,
          isPending: true,
        },
      ];

      const filteredUsers = mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search for users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleInviteUser = async (userId: string, userName: string) => {
    setIsInviting(userId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Invitation Sent!",
        description: `Partner request sent to ${userName}`,
      });

      onInviteSent();
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Invite failed:", error);
      toast({
        title: "Invitation Failed",
        description: "Unable to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search App Members
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Find existing app members to invite as accountability partners
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-buddy-purple border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-buddy-purple/10 text-buddy-purple">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.isPartner && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              Already Partner
                            </Badge>
                          )}
                          {user.isPending && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <Button
                      variant={
                        user.isPartner || user.isPending ? "outline" : "default"
                      }
                      size="sm"
                      onClick={() => handleInviteUser(user._id, user.name)}
                      disabled={
                        user.isPartner ||
                        user.isPending ||
                        isInviting === user._id
                      }
                      className="rounded-full px-4"
                    >
                      {isInviting === user._id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : user.isPartner ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : user.isPending ? (
                        <Mail className="w-4 h-4 mr-2" />
                      ) : (
                        <UserPlus className="w-4 h-4 mr-2" />
                      )}
                      {user.isPartner
                        ? "Partner"
                        : user.isPending
                          ? "Pending"
                          : "Invite"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No users found</p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching with a different name or email
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h5 className="font-medium text-blue-900 mb-2">Search Tips</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Search by full name or email address</li>
            <li>• Partners can be from any activity, not just this one</li>
            <li>• You can have multiple accountability partners</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InviteBySearch;
