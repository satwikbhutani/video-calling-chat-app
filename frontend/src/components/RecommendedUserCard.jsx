import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { IoLanguageSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const RecommendedUserCard = ({ user, index, outgoingReq, onMouseEnter, onMouseLeave, isHovered, isVisible }) => {
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);

  // Send friend request mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.post(`/user/friend-request/${userId}`);
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] });
      toast.success('Friend request sent!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send request');
    }
  });

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -100 : 100, 
        behavior: 'smooth' 
      });
    }
  };

  const hasRequestBeenSent = outgoingReq.has(user._id);

  return (
    <div
      className={`group relative transform transition-all duration-700 hover:scale-105 hover:-translate-y-3 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseEnter={() => onMouseEnter(user._id)}
      onMouseLeave={() => onMouseLeave(null)}
    >
      {/* Animated border glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <div className="relative card bg-base-100/95 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden">
        {/* Floating heart on hover */}
        {isHovered && (
          <div className="absolute top-4 right-4 z-10 animate-float-up">
            <Heart className="w-5 h-5 text-accent fill-current" />
          </div>
        )}
        
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-secondary/3 to-accent/3 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="relative card-body p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Enhanced avatar with ring animation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="avatar">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-primary group-hover:ring-4 group-hover:ring-secondary transition-all duration-300 relative overflow-hidden">
                  <img 
                    src={user.profilePic || '/default-avatar.png'} 
                    alt={user.name} 
                    className="group-hover:scale-110 transition-transform duration-300 object-cover"
                    onError={(e) => e.target.src = '/default-avatar.png'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              {/* Animated status indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-success rounded-full border-2 border-base-100 animate-pulse-gentle" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 truncate">
                {user.name}
              </h3>
              {user.location && (
                <div className="flex items-center text-xs sm:text-sm text-base-content/70 group-hover:text-base-content transition-all duration-300 mt-1">
                  <MapPinIcon className="size-3 sm:size-4 mr-1 text-primary flex-shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Language badge */}
          {user.nativeLanguage && (
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline badge-sm sm:badge-md flex items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 bg-primary/10 border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-300">
                <IoLanguageSharp className="text-primary size-3 sm:size-4" />
                <span className="font-medium text-xs sm:text-sm">Language: {capitalize(user.nativeLanguage)}</span>
              </span>
            </div>
          )}

          {/* Bio with animated accent */}
          {user.bio && (
            <div className="relative">
              <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-primary to-secondary rounded-full" />
              <p className="text-xs sm:text-sm text-base-content/80 italic pl-4 group-hover:text-base-content transition-all duration-300 line-clamp-2">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* Enhanced interests with smooth scrolling */}
          {user.interests && user.interests.length > 0 && (
            <div className="relative pt-2 px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => handleScroll('left')}
                  className="bg-primary text-primary-content p-1.5 sm:p-2 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-primary/90"
                >
                  <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
              <div
                ref={scrollRef}
                className="flex gap-2 overflow-hidden px-6 sm:px-8 py-1"
              >
                {user.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-nowrap badge badge-xs sm:badge-sm font-medium bg-secondary/10 border-secondary/30 hover:bg-secondary/20 hover:scale-105 transition-all duration-300 animate-fade-in-badge"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={() => handleScroll('right')}
                  className="bg-secondary text-secondary-content p-1.5 sm:p-2 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-secondary/90"
                >
                  <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Enhanced action button with gradient */}
          <button
            className={`btn btn-sm sm:btn-md w-full mt-3 sm:mt-4 transition-all duration-300 hover:scale-105 relative overflow-hidden group/btn ${
              hasRequestBeenSent 
                ? 'btn-success hover:shadow-lg hover:shadow-success/25' 
                : 'btn-primary hover:shadow-lg hover:shadow-primary/25'
            }`}
            onClick={() => mutate(user._id)}
            disabled={hasRequestBeenSent || isPending}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
            {isPending ? (
              <span className="loading loading-spinner loading-xs sm:loading-sm" />
            ) : hasRequestBeenSent ? (
              <>
                <CheckCircleIcon className="size-3 sm:size-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Request Sent</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="size-3 sm:size-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Send Request</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes fade-in-badge {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-float-up { animation: float-up 0.3s ease-out; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
        .animate-fade-in-badge { animation: fade-in-badge 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
      `}</style>
    </div>
  );
};

export default RecommendedUserCard;
