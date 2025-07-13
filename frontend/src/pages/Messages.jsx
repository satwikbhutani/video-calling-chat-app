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
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 flex items-center justify-center px-3 sm:px-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <span className="loading loading-spinner loading-md sm:loading-lg text-primary"></span>
          <p className="text-base-content/70 text-xs sm:text-sm md:text-base">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced CSS Styles for Complete Responsiveness */}
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

        /* Enhanced scrollbar for all devices */
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(var(--b2), 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--p), 0.4);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--p), 0.6);
        }

        /* Responsive text truncation */
        .message-preview {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .message-preview {
            -webkit-line-clamp: 2;
            line-height: 1.3;
          }
        }

        /* Touch-friendly hover states */
        @media (hover: hover) {
          .conversation-item:hover {
            background-color: rgba(var(--b2), 0.5);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
        }

        /* Mobile-first responsive utilities */
        @media (max-width: 480px) {
          .mobile-compact {
            padding: 0.5rem;
          }
          
          .mobile-text-xs {
            font-size: 0.65rem;
          }
        }

        /* Safe area handling for mobile devices */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden pb-16 lg:pb-0 safe-area-bottom">
        {/* Responsive Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/2 via-secondary/2 to-accent/2 sm:from-primary/3 sm:via-secondary/3 sm:to-accent/3" />
        <div className="absolute top-5 sm:top-10 md:top-20 left-3 sm:left-5 md:left-10 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-primary/6 sm:bg-primary/8 rounded-full blur-xl sm:blur-2xl animate-float-gentle" />
        <div className="absolute bottom-5 sm:bottom-10 md:bottom-20 right-3 sm:right-5 md:right-10 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-secondary/6 sm:bg-secondary/8 rounded-full blur-xl sm:blur-2xl animate-float-gentle" />

        {/* Main Container */}
        <div className="relative z-10 min-h-screen">
          {/* Conversations Container */}
          <div className="w-full bg-base-100/85 sm:bg-base-100/90 backdrop-blur-sm flex flex-col min-h-screen">
            {/* Fully Responsive Header */}
            <div className="sticky top-0 z-20 p-2 sm:p-3 md:p-4 lg:p-6 border-b border-base-300/30 sm:border-base-300/50 bg-base-100/90 sm:bg-base-100/95 backdrop-blur-sm safe-area-top">
              <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
                {/* Title and Button Row */}
                <div className="flex items-center justify-between gap-2 mt-5">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary truncate">
                      Messages
                    </h1>
                  </div>
                  <Link 
                    to="/friends" 
                    className="btn btn-primary btn-xs sm:btn-sm md:btn-md flex-shrink-0"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:hidden md:inline ml-1 sm:ml-2">New Chat</span>
                    <span className="xs:hidden sm:inline md:hidden">New</span>
                  </Link>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input input-sm sm:input-md w-full pl-8 sm:pl-10 bg-base-200/50 border-base-300/50 focus:border-primary text-xs sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-3 md:px-4 lg:px-5 pt-2 sm:pt-3 md:pt-4">
              {filteredChannels.length === 0 ? (
                /* Enhanced Empty State */
                <div className="flex flex-col items-center justify-center h-full py-6 sm:py-8 md:py-12 px-3 sm:px-4 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mx-auto mb-3 sm:mb-4 md:mb-6 flex items-center justify-center">
                    <Send className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary/50" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-base-content mb-1 sm:mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-base-content/70 mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-sm md:max-w-md leading-relaxed">
                    Start chatting with your friends! Find people to connect with and begin meaningful conversations.
                  </p>
                  <Link to="/friends" className="btn btn-primary btn-sm sm:btn-md">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Find Friends
                  </Link>
                </div>
              ) : (
                /* Enhanced Conversations List */
                <div className="space-y-1 sm:space-y-2 pb-4">
                  {filteredChannels.map((channel, index) => {
                    const otherUser = getOtherUser(channel);
                    const lastMessage = channel.state.messages[channel.state.messages.length - 1];
                    const unreadCount = channel.state.unreadCount || 0;

                    if (!otherUser) return null;

                    return (
                      <div
                        key={channel.id}
                        className="conversation-item group w-full p-2 sm:p-3 md:p-4 cursor-pointer transition-all duration-300 hover:bg-base-200/50 hover:shadow-lg sm:hover:shadow-xl hover:shadow-primary/5 sm:hover:shadow-primary/10 animate-slide-in-left active:bg-base-200/70 active:scale-[0.98] border border-transparent hover:border-base-300/30 rounded-lg sm:rounded-xl"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => handleChannelClick(channel)}
                      >
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
                          {/* Enhanced Avatar Section */}
                          <div className="relative flex-shrink-0">
                            <div className="avatar">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full ring-1 sm:ring-2 ring-primary/15 sm:ring-primary/20 group-hover:ring-primary/30 sm:group-hover:ring-primary/40 transition-all duration-300">
                                <img 
                                  src={otherUser.image || '/default-avatar.png'} 
                                  alt={otherUser.name}
                                  onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                  }}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                            {otherUser.online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-success rounded-full border-1 sm:border-2 border-base-100 animate-pulse" />
                            )}
                          </div>

                          {/* Enhanced Content Section */}
                          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                            {/* Name and Time Row */}
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                              <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-base-content truncate group-hover:text-primary transition-colors duration-300 flex-1">
                                {otherUser.name || 'Unknown User'}
                              </h3>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-[10px] sm:text-xs md:text-sm text-base-content/60 whitespace-nowrap">
                                  {formatTime(lastMessage?.created_at)}
                                </span>
                                {unreadCount > 0 && (
                                  <div className="badge badge-primary badge-xs sm:badge-sm text-[8px] sm:text-xs">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Message and Status Row */}
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-base-content/70 group-hover:text-base-content/90 transition-colors duration-300 flex-1 message-preview">
                                {lastMessage?.text || 'No messages yet'}
                              </p>
                              
                              {/* Enhanced Status */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className={`px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 rounded-full text-[8px] sm:text-xs transition-colors duration-300 ${
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
