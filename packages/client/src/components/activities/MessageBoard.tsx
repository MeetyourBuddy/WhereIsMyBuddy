import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/common/Card";
import {
  Send,
  Clock,
  ThumbsUp,
  Pin,
  Tag,
  MoreVertical,
  MessageCircle,
  Users,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import {
  activityMessageService,
  ActivityMessage as ApiMessage,
} from "@/services/api/activity/activity-message.service";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  isPinned?: boolean;
  tags?: string[];
  isAdmin?: boolean;
}

interface MessageBoardProps {
  activityId: string;
}

const MessageBoard: React.FC<MessageBoardProps> = ({ activityId }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const currentUserId = user?._id || user?.id || "1";
  const isUserAdmin = (user as any)?.role === "admin";

  // Safety check for user object
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-buddy-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-buddy-gray-900 mb-2">
            Please log in
          </h3>
          <p className="text-buddy-gray-600">
            You need to be logged in to view messages.
          </p>
        </div>
      </div>
    );
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  // Load messages on component mount
  useEffect(() => {
    const loadInitialMessages = async () => {
      try {
        setIsLoading(true);
        const response = await activityMessageService.getMessages(activityId, {
          limit: 50,
        });

        // Transform API messages to component format
        const transformedMessages: Message[] = response.messages.map(
          (msg: ApiMessage) => ({
            id: msg._id,
            userId: msg.userId._id,
            userName: msg.userId.name,
            userAvatar: msg.userId.avatar,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
            likes: msg.likes,
            liked: msg.likedBy.includes(currentUserId),
            isPinned: msg.isPinned,
            tags: msg.tags,
            isAdmin: isUserAdmin,
          })
        );

        setMessages(transformedMessages);
        setHasError(false);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setHasError(true);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMessages();
  }, [activityId, currentUserId, toast]);

  // Handle filter changes with manual refresh
  const handleFilterChange = async () => {
    if (isSendingMessage) return;

    try {
      const response = await activityMessageService.getMessages(activityId, {
        limit: 50,
        search: searchQuery,
        tag: selectedTag || undefined,
        pinnedOnly: showPinnedOnly,
      });

      // Transform API messages to component format
      const transformedMessages: Message[] = response.messages.map(
        (msg: ApiMessage) => ({
          id: msg._id,
          userId: msg.userId._id,
          userName: msg.userId.name,
          userAvatar: msg.userId.avatar,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          likes: msg.likes,
          liked: msg.likedBy.includes(currentUserId),
          isPinned: msg.isPinned,
          tags: msg.tags,
          isAdmin: isUserAdmin,
        })
      );

      setMessages(transformedMessages);
    } catch (error) {
      console.error("Failed to load filtered messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get all unique tags from messages
  const allTags = Array.from(
    new Set((messages || []).flatMap((msg) => msg.tags || []))
  );

  // Filter messages based on search, tag, and pinned status
  const filteredMessages = (messages || []).filter((message) => {
    const matchesSearch =
      searchQuery === "" ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === null ||
      (message.tags && message.tags.includes(selectedTag));

    const matchesPinned = !showPinnedOnly || message.isPinned;

    return matchesSearch && matchesTag && matchesPinned;
  });

  // Sort messages: pinned first, then by timestamp (newest at bottom for chat)
  const sortedMessages = filteredMessages.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !user) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Create optimistic message object
    const optimisticMessage: Message = {
      id: tempId,
      userId: currentUserId,
      userName: user.name || "You",
      userAvatar: user.avatar,
      content: messageContent,
      timestamp: new Date(),
      likes: 0,
      liked: false,
      isPinned: false,
      tags: [],
      isAdmin: isUserAdmin,
    };

    // Clear input and UI state immediately
    setNewMessage("");
    setIsExpanded(false);
    setIsLoading(true);
    setIsSendingMessage(true);

    // Add optimistic message to the end (newest messages at bottom for chat)
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    try {
      const apiMessage = await activityMessageService.createMessage(
        activityId,
        {
          content: messageContent,
          tags: [],
        }
      );

      // Replace optimistic message with real API response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempId
            ? {
                id: apiMessage._id,
                userId: apiMessage.userId._id,
                userName: apiMessage.userId.name,
                userAvatar: apiMessage.userId.avatar,
                content: apiMessage.content,
                timestamp: new Date(apiMessage.createdAt),
                likes: apiMessage.likes,
                liked: apiMessage.likedBy.includes(currentUserId),
                isPinned: apiMessage.isPinned,
                tags: apiMessage.tags,
                isAdmin: isUserAdmin,
              }
            : msg
        )
      );

      toast({
        title: "Message sent!",
        description: "Your message has been posted to the group.",
      });
    } catch (error) {
      console.error("Failed to send message:", error);

      // Remove optimistic message on error
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );

      // Restore the message content for retry
      setNewMessage(messageContent);
      setIsExpanded(true);

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSendingMessage(false);
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const updatedMessage = await activityMessageService.toggleLike(
        activityId,
        id
      );

      setMessages(
        messages.map((message) => {
          if (message.id === id) {
            return {
              ...message,
              likes: updatedMessage.likes,
              liked: updatedMessage.likedBy.includes(currentUserId),
            };
          }
          return message;
        })
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePin = async (id: string) => {
    try {
      const updatedMessage = await activityMessageService.togglePin(
        activityId,
        id
      );

      setMessages(
        messages.map((message) => {
          if (message.id === id) {
            return {
              ...message,
              isPinned: updatedMessage.isPinned,
            };
          }
          return message;
        })
      );

      toast({
        title: "Message updated",
        description: "Message pin status has been updated.",
      });
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      toast({
        title: "Error",
        description: "Failed to update pin status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isCurrentUser = (userId: string) => userId === currentUserId;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-buddy-gray-200 shadow-sm overflow-hidden animate-fade-in max-h-[700px]">
      {/* Header */}
      <div className="p-6 border-b border-buddy-gray-200 bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-buddy-gray-900">
                Activity Messages
              </h3>
              <p className="text-sm text-buddy-gray-600">
                Connect and communicate with{" "}
                {messages.length > 0 ? messages.length : 0} participants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-buddy-purple/10 text-buddy-purple border-0"
            >
              <Users className="w-3 h-3 mr-1" />
              {messages.length} messages
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Debounce search
                setTimeout(() => {
                  if (e.target.value === searchQuery) {
                    handleFilterChange();
                  }
                }, 500);
              }}
              className="pl-10 rounded-full border-buddy-gray-200 focus:ring-buddy-purple focus:border-buddy-purple"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showPinnedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowPinnedOnly(!showPinnedOnly);
                setTimeout(handleFilterChange, 100);
              }}
              className="rounded-full"
            >
              <Pin className="w-4 h-4 mr-1" />
              Pinned
            </Button>
            {allTags.length > 0 && (
              <div className="flex gap-1 overflow-x-auto">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTag(null);
                    setTimeout(handleFilterChange, 100);
                  }}
                  className="rounded-full whitespace-nowrap"
                >
                  All
                </Button>
                {allTags.slice(0, 3).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setTimeout(handleFilterChange, 100);
                    }}
                    className="rounded-full whitespace-nowrap"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {/* <ScrollArea className="flex-1 bg-gradient-to-b from-white to-buddy-gray-50/30"> */}
      <div className="p-6 space-y-4 overflow-y-auto h-[500px] scrollbar-thin scrollbar-thumb-buddy-purple/30 scrollbar-track-transparent hover:scrollbar-thumb-buddy-purple/50">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-buddy-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MessageCircle className="w-8 h-8 text-buddy-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-buddy-gray-900 mb-2">
              Loading messages...
            </h4>
            <p className="text-buddy-gray-600">
              Please wait while we fetch the latest messages.
            </p>
          </div>
        ) : hasError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-red-400" />
            </div>
            <h4 className="text-lg font-medium text-buddy-gray-900 mb-2">
              Failed to load messages
            </h4>
            <p className="text-buddy-gray-600 mb-4">
              There was an error loading the messages. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
            >
              Retry
            </Button>
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-buddy-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-buddy-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-buddy-gray-900 mb-2">
              No messages found
            </h4>
            <p className="text-buddy-gray-600 mb-4">
              {searchQuery || selectedTag || showPinnedOnly
                ? "Try adjusting your search or filters"
                : "Be the first to start a conversation!"}
            </p>
            {!searchQuery && !selectedTag && !showPinnedOnly && (
              <Button
                onClick={() => setIsExpanded(true)}
                className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Send First Message
              </Button>
            )}
          </div>
        ) : (
          sortedMessages.map((message) => {
            const isCurrentUserMessage = isCurrentUser(message.userId);

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUserMessage ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[66%] min-w-[25%] ${isCurrentUserMessage ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar - left side for other users, right side for current user */}
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <div className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full h-full w-full flex items-center justify-center text-xs font-medium">
                      {isCurrentUserMessage ? (
                        user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || "You"}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          (user?.name || "U").substring(0, 2).toUpperCase()
                        )
                      ) : message.userAvatar ? (
                        <img
                          src={message.userAvatar}
                          alt={message.userName}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        message.userName.substring(0, 2).toUpperCase()
                      )}
                    </div>
                  </Avatar>

                  {/* Message Bubble */}
                  <div className="relative">
                    {/* Pinned indicator */}
                    {message.isPinned && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 border-0 text-xs px-2 py-0.5"
                        >
                          <Pin className="w-3 h-3 mr-1" />
                          Pinned
                        </Badge>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`relative px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                        isCurrentUserMessage
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-l-2xl rounded-tr-2xl"
                          : "bg-white border border-buddy-gray-200 text-buddy-gray-900 rounded-r-2xl rounded-tl-2xl"
                      } ${
                        message.isPinned
                          ? "ring-2 ring-amber-400 ring-opacity-50"
                          : ""
                      } ${
                        message.id.startsWith("temp-")
                          ? "opacity-70 animate-pulse"
                          : ""
                      }`}
                    >
                      {/* Message header - only for other users */}
                      {!isCurrentUserMessage && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm text-buddy-gray-900">
                            {message.userName}
                          </span>
                          {message.isAdmin && (
                            <Badge
                              variant="secondary"
                              className="bg-buddy-purple/10 text-buddy-purple border-0 text-xs"
                            >
                              Admin
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Message content */}
                      <p
                        className={`text-sm leading-relaxed ${
                          isCurrentUserMessage
                            ? "text-white"
                            : "text-buddy-gray-700"
                        }`}
                      >
                        {message.content}
                      </p>

                      {/* Message footer */}
                      <div
                        className={`flex items-center justify-between mt-2 ${
                          isCurrentUserMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs flex items-center ${
                              isCurrentUserMessage
                                ? "text-white/70"
                                : "text-buddy-gray-500"
                            }`}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {message.id.startsWith("temp-")
                              ? "Sending..."
                              : formatDistanceToNow(message.timestamp, {
                                  addSuffix: true,
                                })}
                          </span>

                          {isUserAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePin(message.id)}
                              className={`h-5 w-5 p-0 ${
                                isCurrentUserMessage
                                  ? "text-white/70 hover:text-white hover:bg-white/10"
                                  : "text-buddy-gray-400 hover:text-buddy-purple"
                              }`}
                            >
                              <Pin className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {message.tags && message.tags.length > 0 && (
                        <div
                          className={`flex gap-1 mt-2 ${
                            isCurrentUserMessage
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`text-xs ${
                                isCurrentUserMessage
                                  ? "bg-white/20 text-white border-white/30"
                                  : "bg-buddy-gray-50 text-buddy-gray-600 border-buddy-gray-200"
                              }`}
                            >
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Like button - outside the bubble */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => toggleLike(message.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                        message.liked
                          ? "bg-buddy-purple/10 text-buddy-purple"
                          : "text-buddy-gray-500 hover:bg-buddy-gray-100"
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {message.likes > 0 && message.likes}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* </ScrollArea> */}

      {/* Message Input */}
      <div className="p-6 border-t border-buddy-gray-200 bg-white">
        {isExpanded ? (
          <div className="space-y-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts with the group..."
              className="w-full resize-none focus:ring-buddy-purple focus:border-buddy-purple rounded-2xl border-buddy-gray-200 min-h-[50px]"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-buddy-gray-500">
                  {newMessage.length}/500 characters
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white border-0"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 cursor-text p-3 rounded-2xl border border-buddy-gray-200 hover:border-buddy-purple/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <div className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full h-full w-full flex items-center justify-center text-sm font-medium">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </div>
            </Avatar>
            <div className="flex-1">
              <p className="text-buddy-gray-500 text-sm">
                Share your thoughts with the group...
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-buddy-gray-400 hover:text-buddy-purple"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBoard;
