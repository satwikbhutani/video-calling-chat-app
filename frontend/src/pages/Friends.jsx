import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import { StreamChat } from "stream-chat";
import { Search, Plus, UserPlus, Star, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import FriendCard from '../components/FriendCard'
import RecommendedUserCard from '../components/RecommendedUserCard'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all') // 'all', 'online', 'recommended'
  const [chatClient, setChatClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [outgoingReq, setOutgoingReq] = useState(new Set());
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const observerRef = useRef(null);
  const queryClient = useQueryClient()

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

  // Fetch friends data
  const { data: friends = [], isLoading: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/friends')
      return response?.data
    },
    retry: false
  })

  // Fetch suggested users
  const { data: suggestedUsers = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user')
      return response?.data
    },
    retry: false
  })

  // Fetch outgoing friend requests
  const { data: outgoingFriendRequests = [] } = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/outgoing-requests');
      return response?.data;
    },
    retry: false
  });

  // Initialize intersection observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.dataset.cardId]));
          }
        });
      },
      { threshold: 0.2 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  // Set outgoing requests
  useEffect(() => {
    const outgoingIds = new Set();
    outgoingFriendRequests.forEach((req) => outgoingIds.add(req.recipient._id));
    setOutgoingReq(outgoingIds);
  }, [outgoingFriendRequests]);

  // Initialize Stream Chat to check online status
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

        // Get online status for all friends
        if (friends.length > 0) {
          const friendIds = friends.map(friend => friend._id);
          
          // Query users to get their online status
          const usersResponse = await client.queryUsers({
            id: { $in: friendIds }
          });

          const onlineUserIds = new Set();
          usersResponse.users.forEach(user => {
            if (user.online) {
              onlineUserIds.add(user.id);
            }
          });

          setOnlineUsers(onlineUserIds);
        }
      } catch (error) {
        console.error("Error initializing chat for online status:", error);
      }
    };

    if (friends.length > 0) {
      initializeChat();
    }
  }, [tokenData, authUser, friends]);

  // Send friend request mutation
  const { mutate: sendRequest } = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.post(`/user/friend-request/${userId}`)
      return response?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] })
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] })
      toast.success('Friend request sent!')
    },
    onError: () => toast.error('Failed to send request')
  })

  // Filter functions with Stream Chat online logic
  const getFilteredFriends = () => {
    let filtered = friends
    
    if (activeTab === 'online') {
      // Use Stream Chat online status
      filtered = friends.filter(friend => onlineUsers.has(friend._id))
    }
    
    if (searchTerm) {
      filtered = filtered.filter(friend => 
        friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }

  const getFilteredSuggestions = () => {
    if (searchTerm) {
      return suggestedUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return suggestedUsers
  }

  // Get online friends count using Stream Chat data
  const getOnlineFriendsCount = () => {
    return friends.filter(friend => onlineUsers.has(friend._id)).length;
  }

  const isLoading = friendsLoading || suggestionsLoading

  return (
    <>
      {/* CSS Styles */}
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
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" />

        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-base-100/95 backdrop-blur-sm border-b border-base-300/50">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary">Friends</h1>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="input input-bordered w-full pl-10 bg-base-200/50 border-base-300/50 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tabs with Stream Chat online count */}
              <div className="tabs tabs-boxed bg-base-200/50 p-1">
                <button 
                  className={`tab tab-sm sm:tab-md ${activeTab === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Friends ({friends.length})
                </button>
                <button 
                  className={`tab tab-sm sm:tab-md ${activeTab === 'online' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('online')}
                >
                  Online ({getOnlineFriendsCount()})
                </button>
                <button 
                  className={`tab tab-sm sm:tab-md ${activeTab === 'recommended' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('recommended')}
                >
                  Recommended ({suggestedUsers.length})
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <p className="text-base-content/70">Loading friends...</p>
              </div>
            ) : (
              <>
                {/* Friends List */}
                {activeTab === 'all' || activeTab === 'online' ? (
                  <div className="space-y-4">
                    {getFilteredFriends().length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-10 h-10 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content mb-2">
                          {activeTab === 'online' ? 'No friends online' : 'No friends yet'}
                        </h3>
                        <p className="text-base-content/70 mb-4">
                          {activeTab === 'online' 
                            ? 'None of your friends are currently online.' 
                            : 'Start connecting with people to build your network!'
                          }
                        </p>
                        {activeTab === 'all' && (
                          <Link to="/discover" className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Find Friends
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getFilteredFriends().map((friend, index) => {
                          // Add online status from Stream Chat to friend object
                          const friendWithOnlineStatus = {
                            ...friend,
                            isOnline: onlineUsers.has(friend._id)
                          };

                          return (
                            <div
                              key={friend._id}
                              className="animate-slide-in-left"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
                                <FriendCard friend={friendWithOnlineStatus} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Recommended Users */
                  <div className="space-y-4">
                    {getFilteredSuggestions().length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Star className="w-10 h-10 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-semibold text-base-content mb-2">No recommendations</h3>
                        <p className="text-base-content/70">We couldn't find any users to recommend at this time.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {getFilteredSuggestions().map((user, index) => (
                          <div
                            key={user._id}
                            data-card-id={user._id}
                            ref={(el) => {
                              if (el && observerRef.current) observerRef.current.observe(el);
                            }}
                          >
                            <RecommendedUserCard
                              user={user}
                              index={index}
                              outgoingReq={outgoingReq}
                              onMouseEnter={setHoveredCard}
                              onMouseLeave={setHoveredCard}
                              isHovered={hoveredCard === user._id}
                              isVisible={visibleCards.has(user._id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Friends
