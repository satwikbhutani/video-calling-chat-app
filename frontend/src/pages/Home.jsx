import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router';
import { UsersIcon, Zap, Star, Heart, Dot } from 'lucide-react';
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import RecommendedUserCard from '../components/RecommendedUserCard';

const Home = () => {
  const queryClient = useQueryClient();
  const [outgoingReq, setOutgoingReq] = useState(new Set());
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const observerRef = useRef(null);

  const { data: friends = [], isLoading: friendLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => (await axiosInstance.get('/user/friends'))?.data,
    retry: false
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await axiosInstance.get('/user'))?.data,
    retry: false
  });

  const { data: outgoingFriendRequests = [] } = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: async () => (await axiosInstance.get('/user/outgoing-requests'))?.data,
    retry: false
  });

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

  useEffect(() => {
    const outgoingIds = new Set();
    outgoingFriendRequests.forEach((req) => outgoingIds.add(req.recipient._id));
    setOutgoingReq(outgoingIds);
  }, [outgoingFriendRequests]);

  // Aesthetic floating elements
  const FloatingElements = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float-slow" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float-medium" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl animate-float-slow" />
      
      {/* Sparkle particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <Dot className="w-14 h-14 text-primary/30" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-300 relative overflow-hidden">
      <FloatingElements />
      
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-gradient-shift" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 h-full">
        <div className="container mx-auto space-y-12">
          
          {/* Enhanced Header with animated elements */}
          <div className="flex flex-row items-center justify-between animate-slide-down">
            <div className="relative group">
              <h2 className="text-4xl font-bold tracking-tight text-primary relative">
                Your Friends
                <div className="absolute -top-1 -right-8 animate-bounce-gentle">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
              </h2>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-700 ease-out" />
            </div>
            <Link 
              to="/notifications" 
              className="btn btn-outline btn-sm hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              <UsersIcon className="mr-1 size-4 relative z-10" />
              <span className="relative z-10">Friend Requests</span>
            </Link>
          </div>

          {/* Friends Section with staggered animations */}
          {friendLoading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <span className="loading loading-spinner loading-lg text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping-slow" />
              </div>
            </div>
          ) : friends.length === 0 ? (
            <div className="animate-fade-in-up">
              <NoFriendsFound />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend, index) => (
                <div
                  key={friend._id}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
                    <FriendCard friend={friend} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Suggestions Section */}
          <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-8 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
              <div className="relative">
                <h2 className="text-4xl font-bold tracking-tight mb-4 text-primary flex items-center justify-center gap-3">
                  <div className="relative">
                    <Star className="w-8 h-8 text-accent animate-rotate-slow" />
                    <div className="absolute inset-0 w-8 h-8 text-secondary animate-pulse" />
                  </div>
                  Suggested Connections
                  <div className="relative">
                    <Heart className="w-6 h-6 text-secondary animate-pulse-gentle" />
                  </div>
                </h2>
                <p className="text-lg text-base-content/80 max-w-2xl mx-auto mb-4">
                  ✨ Discover amazing people who share your interests! ✨
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full animate-gradient-flow" />
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-12">
                <div className="relative">
                  <span className="loading loading-spinner loading-lg text-primary" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping-slow" />
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="card bg-base-200/80 backdrop-blur-sm p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-primary/20">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-gentle">
                  <Heart className="w-8 h-8 text-secondary-content" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-primary">No recommendations available</h3>
                <p className="text-base-content/70">Check back later for new connections.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {users.map((user, index) => (
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
          </section>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotate-slow 8s linear infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; }
        .animate-gradient-flow { animation: gradient-flow 3s ease infinite; background-size: 200% 200%; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default Home;
