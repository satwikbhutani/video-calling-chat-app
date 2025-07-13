import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { StreamChat } from "stream-chat";
import { Search, Plus, MoreVertical, Phone, Video, Send, MessageCircle } from 'lucide-react';
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Messages = () => {
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Get authenticated user data
  const { data: authData } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
      } catch (err) {
        return null;
      }
    },
    retry: false
  });
  const authUser = authData?.user;

  // Get Stream token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: async () => {
      const response = await axiosInstance.get('/chat/token');
      return response?.data;
    },
    enabled: !!authUser,
  });

  // Initialize Stream Chat and fetch channels
  useEffect(() => {
    const initializeChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        setChatClient(client);

        // Fetch user's channels
        const filter = { members: { $in: [authUser._id] } };
        const sort = { last_message_at: -1 };
        const channelsResponse = await client.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        setChannels(channelsResponse);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not load conversations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [tokenData, authUser]);

  // Helper function to get other user in the channel
  const getOtherUser = (channel) => {
    const members = Object.values(channel.state.members);
    return members.find(member => member.user.id !== authUser._id)?.user;
  };

  // Helper function to format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  // Navigate to chat page
  const handleChannelClick = (channel) => {
    const otherUser = getOtherUser(channel);
    if (otherUser) {
      navigate(`/chat/${otherUser.id}`);
    }
  };

  // Filter channels based on search
  const filteredChannels = channels.filter(channel => {
    const otherUser = getOtherUser(channel);
    return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70 text-sm sm:text-base">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced CSS Styles for Responsiveness */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }

        /* Custom scrollbar for better mobile experience */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(var(--b2), 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--p), 0.5);
          border-radius: 2px;
        }

        /* Responsive text truncation */
        .message-preview {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .message-preview {
            -webkit-line-clamp: 2;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden">
        {/* Responsive Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" />

        {/* Main Container */}
        <div className="relative z-10 min-h-screen">
          {/* Conversations Container */}
          <div className="w-full bg-base-100/90 backdrop-blur-sm flex flex-col min-h-screen">
            {/* Responsive Header */}
            <div className="sticky top-0 z-20 p-3 sm:p-4 lg:p-6 border-b border-base-300/50 bg-base-100/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                {/* Title and Button Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                      Messages
                    </h1>
                  </div>
                  <Link 
                    to="/friends" 
                    className="btn btn-primary btn-xs sm:btn-sm flex-shrink-0 ml-2"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline ml-1 sm:ml-2">New Chat</span>
                  </Link>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full max-w-sm sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input w-full pl-10 bg-base-200/50 border-base-300/50 border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 mt-4">
              {filteredChannels.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full py-8 sm:py-12 px-4 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <Send className="w-8 h-8 sm:w-10 sm:h-10 text-primary/50" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6 max-w-xs sm:max-w-md">
                    Start chatting with your friends! Find people to connect with and begin meaningful conversations.
                  </p>
                  <Link to="/friends" className="btn btn-primary btn-sm sm:btn-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Link>
                </div>
              ) : (
                /* Conversations List */
                <div className="divide-y divide-base-300/30">
                  {filteredChannels.map((channel, index) => {
                    const otherUser = getOtherUser(channel);
                    const lastMessage = channel.state.messages[channel.state.messages.length - 1];
                    const unreadCount = channel.state.unreadCount || 0;

                    if (!otherUser) return null;

                    return (
                      <div
                        key={channel.id}
                        className="group w-full p-3 cursor-pointer transition-all duration-300 hover:bg-base-200/50 hover:shadow-xl hover:shadow-primary/10 animate-slide-in-left active:bg-base-200/70 border rounded-xl mb-3"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => handleChannelClick(channel)}
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                          {/* Avatar Section */}
                          <div className="relative flex-shrink-0">
                            <div className="avatar">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                <img 
                                  src={otherUser.image || '/default-avatar.png'} 
                                  alt={otherUser.name}
                                  onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                  }}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            {otherUser.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-base-100" />
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 min-w-0 space-y-1">
                            {/* Name and Time Row */}
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-base-content truncate group-hover:text-primary transition-colors duration-300 flex-1">
                                {otherUser.name || 'Unknown User'}
                              </h3>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-xs sm:text-sm text-base-content/60 whitespace-nowrap">
                                  {formatTime(lastMessage?.created_at)}
                                </span>
                                {unreadCount > 0 && (
                                  <div className="badge badge-primary badge-xs sm:badge-sm">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Message and Status Row */}
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs sm:text-sm lg:text-base text-base-content/70 group-hover:text-base-content/90 transition-colors duration-300 flex-1 message-preview">
                                {lastMessage?.text || 'No messages yet'}
                              </p>
                              
                              {/* Status and Actions */}
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs ${
                                  otherUser.online 
                                    ? 'bg-success/10 text-success' 
                                    : 'bg-base-300/50 text-base-content/60'
                                }`}>
                                  {otherUser.online ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
