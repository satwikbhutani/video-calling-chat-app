import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useRef } from 'react'
import { axiosInstance } from '../lib/axios';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, MapPinIcon, Sparkles } from "lucide-react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoLanguageSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import NoNotificationsFound from '../components/NoNotificationsFound';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const scrollRefs = useRef({});

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/friend-requests");
      return response.data;
    },
    retry: false
  })

  const { mutate: acceptMutate, isPending: acceptPending } = useMutation({
    mutationFn: async (requestId) => {
      const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      navigate(0);
    }
  })

  const { mutate: rejectMutate, isPending: rejectPending } = useMutation({
    mutationFn: async (requestId) => {
      const response = await axiosInstance.put(`/user/friend-request/${requestId}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      navigate(0);
    }
  })

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  const handleScroll = (id, direction) => {
    const el = scrollRefs.current[id];
    if (el) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Enhanced CSS Styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto max-w-4xl space-y-8">
            {/* Enhanced Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <BellIcon className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Notifications</h1>
                <Sparkles className="w-6 h-6 text-accent animate-pulse-gentle" />
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="relative">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-gentle" />
                </div>
                <p className="text-base-content/70 mt-4">Loading notifications...</p>
              </div>
            ) : (
              <>
                {/* Friend Requests Section */}
                {incomingRequests.length > 0 && (
                  <section className="space-y-6 animate-slide-in-left">
                    <div className="">
                      <h2 className="text-xl font-semibold flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserCheckIcon className="h-5 w-5 text-primary" />
                        </div>
                        Friend Requests
                        <span className="badge badge-primary animate-pulse-gentle">{incomingRequests.length}</span>
                      </h2>

                      <div className="space-y-4">
                        {incomingRequests.map((request, index) => (
                          <div
                            key={request._id}
                            className="group bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300/50 shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="avatar w-14 h-14 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                    <img 
                                      src={request.sender.profilePic} 
                                      alt={request.sender.name}
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
                                </div>
                                
                                <div className="flex flex-col">
                                  <h3 className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                                    {request.sender.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-3 mt-2">
                                    <span className="flex items-center text-xs text-base-content/70">
                                      <MapPinIcon className="size-3 mr-1" />
                                      {request.sender.location}
                                    </span>
                                    <span className="badge badge-outline badge-xs flex items-center gap-1 py-1 border-primary/30 hover:bg-primary/10 transition-colors duration-300">
                                      <IoLanguageSharp className="text-primary" />
                                      {capitalize(request.sender.nativeLanguage)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-success btn-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                                  onClick={() => acceptMutate(request._id)}
                                  disabled={acceptPending || rejectPending}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                  <TiTick className="w-4 h-4 mr-1" />
                                  Accept
                                </button>

                                <button
                                  className="btn btn-error btn-sm hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
                                  onClick={() => rejectMutate(request._id)}
                                  disabled={acceptPending || rejectPending}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                  <RxCross2 className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            </div>

                            {/* Interests Section */}
                            {request.sender.interests && request.sender.interests.length > 0 && (
                              <div className="relative pt-4 px-2 max-w-72 sm:max-w-md">
                                <button
                                  onClick={() => handleScroll(request.sender._id, 'left')}
                                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-primary-content z-10 p-1.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                                >
                                  <ChevronLeft size={14} />
                                </button>
                                <div
                                  ref={(el) => (scrollRefs.current[request.sender._id] = el)}
                                  className="flex gap-2 overflow-hidden px-8"
                                >
                                  {request.sender.interests.map((interest, i) => (
                                    <span
                                      key={i}
                                      className="text-nowrap badge badge-sm text-xs bg-secondary/10 border-secondary/30 hover:bg-secondary/20 hover:scale-105 transition-all duration-300"
                                      style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => handleScroll(request.sender._id, 'right')}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-secondary text-secondary-content p-1.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                                >
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* New Connections Section */}
                {acceptedRequests.length > 0 && (
                  <section className="space-y-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                    <div className="">
                      <h2 className="text-xl font-semibold flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                          <BellIcon className="h-5 w-5 text-success" />
                        </div>
                        New Connections
                        <span className="badge badge-success animate-pulse-gentle">{acceptedRequests.length}</span>
                      </h2>

                      <div className="space-y-4">
                        {acceptedRequests.map((notification, index) => (
                          <div 
                            key={notification._id} 
                            className="group bg-base-100/90 backdrop-blur-sm rounded-xl p-4 border border-base-300/50 shadow-md hover:shadow-xl hover:shadow-success/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-primary/3 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex gap-4 items-center">
                              <div className="relative">
                                <div className="avatar size-12 rounded-full ring-2 ring-success/30 group-hover:ring-success/60 transition-all duration-300">
                                  <img
                                    src={notification?.recipient.profilePic}
                                    alt={notification?.recipient.name}
                                    className="rounded-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100 animate-pulse-gentle" />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="font-semibold text-base-content group-hover:text-success transition-colors duration-300">
                                  {notification?.recipient.name}
                                </h3>
                                <p className="text-sm my-1 text-base-content/80">
                                  accepted your friend request
                                </p>
                                <p className="text-xs flex items-center text-base-content/60">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {notification?.updatedAt.slice(0, 10)}
                                </p>
                              </div>
                              
                              <div className="badge badge-success gap-1 animate-pulse-gentle">
                                <MessageSquareIcon className="h-3 w-3" />
                                New Friend
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Empty State */}
                {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
                  <div className="animate-fade-in">
                    <NoNotificationsFound />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
