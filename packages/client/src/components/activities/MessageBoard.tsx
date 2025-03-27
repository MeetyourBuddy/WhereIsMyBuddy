
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Clock, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
}

interface MessageBoardProps {
  activityId: string;
}

const MessageBoard: React.FC<MessageBoardProps> = ({ activityId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "1",
      userName: "Jordan Lee",
      userAvatar: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png",
      content: "Hey everyone! I'm excited to start this activity with all of you. Let me know if you have any questions about our first session tomorrow.",
      timestamp: new Date(Date.now() - 60000 * 60 * 2), // 2 hours ago
      likes: 3,
      liked: false,
    },
    {
      id: "2",
      userId: "2",
      userName: "Taylor Swift",
      content: "I'll be running about 10 minutes late tomorrow. Please don't wait for me to get started!",
      timestamp: new Date(Date.now() - 60000 * 30), // 30 minutes ago
      likes: 1,
      liked: true,
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // This would come from auth in a real app
  const currentUserId = "1";

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: Message = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: "Jordan Lee",
      userAvatar: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png",
      content: newMessage,
      timestamp: new Date(),
      likes: 0,
      liked: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    setIsExpanded(false);
  };

  const toggleLike = (id: string) => {
    setMessages(
      messages.map((message) => {
        if (message.id === id) {
          const liked = !message.liked;
          return {
            ...message,
            likes: liked ? message.likes + 1 : message.likes - 1,
            liked,
          };
        }
        return message;
      })
    );
  };

  const isCurrentUser = (userId: string) => userId === currentUserId;

  return (
    <div className="bg-white rounded-2xl border border-buddy-gray-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-buddy-gray-200 bg-gradient-to-r from-pastel-purple/30 to-pastel-blue/30">
        <h3 className="font-semibold text-buddy-gray-800">Group Messages</h3>
        <p className="text-sm text-buddy-gray-600">
          Share updates and communicate with other participants
        </p>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-pastel-purple/10">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser(message.userId) ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser(message.userId) && (
              <Avatar className="h-8 w-8 flex-shrink-0 mr-3">
                <div className="bg-buddy-purple-light text-white rounded-full h-full w-full flex items-center justify-center text-sm">
                  {message.userAvatar ? (
                    <img src={message.userAvatar} alt={message.userName} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    message.userName.substring(0, 1).toUpperCase()
                  )}
                </div>
              </Avatar>
            )}
            <div className={`max-w-[75%]`}>
              <div className={`p-3 rounded-2xl ${
                isCurrentUser(message.userId) 
                  ? 'bg-buddy-purple text-white rounded-tr-none' 
                  : 'bg-pastel-blue/20 rounded-tl-none'
              }`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium ${isCurrentUser(message.userId) ? 'text-white' : 'text-buddy-gray-800'}`}>
                    {message.userName}
                  </span>
                  <span className={`text-xs ${isCurrentUser(message.userId) ? 'text-white/80' : 'text-buddy-gray-500'} flex items-center`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className={isCurrentUser(message.userId) ? 'text-white/90' : 'text-buddy-gray-700'}>
                  {message.content}
                </p>
              </div>
              <div className={`mt-1 ${isCurrentUser(message.userId) ? 'text-right pr-2' : 'pl-2'}`}>
                <button
                  onClick={() => toggleLike(message.id)}
                  className={`inline-flex items-center text-xs ${
                    message.liked ? "text-buddy-purple" : "text-buddy-gray-500"
                  } hover:text-buddy-purple transition-colors`}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                  {message.likes > 0 && message.likes}
                </button>
              </div>
            </div>
            {isCurrentUser(message.userId) && (
              <Avatar className="h-8 w-8 flex-shrink-0 ml-3">
                <div className="bg-buddy-purple text-white rounded-full h-full w-full flex items-center justify-center text-sm">
                  {message.userAvatar ? (
                    <img src={message.userAvatar} alt={message.userName} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    message.userName.substring(0, 1).toUpperCase()
                  )}
                </div>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-buddy-gray-200">
        {isExpanded ? (
          <div className="space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full resize-none focus:ring-buddy-purple focus:border-buddy-purple rounded-xl border-buddy-gray-200"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="rounded-full text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white border-0 text-sm"
              >
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsExpanded(true)} 
            className="flex items-center space-x-3 cursor-text"
          >
            <Avatar className="h-8 w-8">
              <div className="bg-buddy-purple text-white rounded-full h-full w-full flex items-center justify-center text-sm">
                JL
              </div>
            </Avatar>
            <Input
              readOnly
              onClick={() => setIsExpanded(true)}
              placeholder="Write a message..."
              className="flex-1 pl-4 border-buddy-gray-200 bg-buddy-gray-100 rounded-full focus:ring-buddy-purple focus:border-buddy-purple cursor-text"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBoard;
