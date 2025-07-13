import React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios'
import toast, { Toaster } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router'
import Logo from '../components/Logo';
import { TiArrowShuffle } from "react-icons/ti";
import { useNavigate } from 'react-router';
import { User, MapPin, Globe, Heart, Sparkles } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/auth/me')
        console.log(response.data)
        return response.data
      }
      catch (err) {
        return null;
      }
    },
    retry: false,
  });
  const authUser = data?.user;
  const isOnboarded = authUser?.isOnboarded;

  const [formData, setFormData] = React.useState({
    name: '',
    bio: '',
    nativeLanguage: '',
    location: '',
    interests: [],
    profilePic: '',
  });

  // Populate form data when authUser is available
  React.useEffect(() => {
    if (!authUser) return;
    
    setFormData({
      name: authUser.name || '',
      bio: authUser.bio || '',
      nativeLanguage: authUser.nativeLanguage || '',
      location: authUser.location || '',
      interests: authUser.interests || [],
      profilePic: authUser.profilePic || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`,
    });
  }, [authUser]);

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/onboard', formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Onboarding error:', error);
    }
  });

  const handleChange = (e) => {
    e.preventDefault();
    mutate();
  }

  const interestOptions = [
    '🎵 Music', '🎬 Movies', '📚 Books', '✈️ Travel', '💪 Fitness', '💻 Tech', '🎮 Gaming', '🍳 Cooking', '📸 Photography', '🎨 Art', '🌿 Nature',
    '🤣 Memes', '🍥 Anime', '🎧 Podcasts', '🧘‍♀️ Self-Care', '🧠 Mental Health', '📈 Productivity', '👗 Fashion', '📹 Vlogging', '🧴 Skincare',
    '🚀 Startups', '🪙 Crypto', '🤖 AI/ML', '🎥 Content Creation', '🏆 Esports', '👟 Streetwear', '🎤 K-Pop', '🐾 Pet Lover', '📝 Poetry', '💃 Dance'
  ];

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  // Show loading screen while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-pulse" />

        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Loading your profile...</h2>
              <p className="text-base-content/70">Please wait while we fetch your information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced CSS Styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(4px); }
          66% { transform: translateY(4px) translateX(-6px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
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

        .animate-float-gentle { animation: float-gentle 6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }

        /* Custom scrollbar for right panel only */
        .right-panel-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .right-panel-scroll::-webkit-scrollbar-track {
          background: rgba(var(--b2), 0.5);
          border-radius: 3px;
        }
        
        .right-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(var(--p), 0.5);
          border-radius: 3px;
        }
        
        .right-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--p), 0.7);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-accent/6 rounded-full blur-xl animate-float-gentle" style={{ animationDelay: '4s' }} />

        {/* Main Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-7xl bg-base-100/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden relative animate-fade-in h-[90vh]">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />

            <div className="flex flex-col lg:flex-row h-full">
              {/* LEFT PANEL - Profile Section (Fixed, Non-scrolling) */}
              <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 relative animate-slide-in-left lg:h-full">
                {/* Logo Section */}
                <div className="hidden lg:inline-block lg:mb-8">
                  <Logo />
                </div>

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-6 lg:mb-8">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-xl border-4 border-primary/30 group-hover:border-primary/60 transition-all duration-300 animate-pulse-gentle">
                      <img
                        src={formData.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => e.target.src = '/default-avatar.png'}
                      />
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-success-content" />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-accent btn-sm sm:btn-md mt-4 lg:mt-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                    disabled={isPending}
                    onClick={() => {
                      const idx = Math.floor(Math.random() * 100) + 1;
                      const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
                      setFormData({ ...formData, profilePic: randomAvatar });
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <TiArrowShuffle className="mr-2" />
                    <span className="hidden sm:inline">Generate Random Avatar</span>
                    <span className="sm:hidden">Random Avatar</span>
                  </button>
                </div>

                {/* Welcome Text */}
                <div className=" hidden lg:flex lg:flex-col text-center">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-3 lg:mb-4">
                    {isOnboarded ? 'Update Your Profile' : 'Welcome to Unmute!'}
                  </h2>
                  <p className="text-base-content/70 text-sm sm:text-base max-w-sm lg:max-w-md">
                    {isOnboarded 
                      ? 'Keep your profile fresh and up-to-date to connect with the right people.'
                      : 'Let\'s set up your profile so you can start connecting with amazing people around the world.'
                    }
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL - Form Section (Scrollable) */}
              <div className="w-full lg:w-3/5 lg:h-full overflow-y-auto right-panel-scroll animate-slide-in-right">
                <div className="p-6 sm:p-8 lg:p-12">
                  <form onSubmit={handleChange} className="space-y-6">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-3">
                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                        {isOnboarded ? 'Update' : 'Complete'} your profile
                      </h3>
                      <p className="text-base-content/70 text-sm sm:text-base">Let the world hear you.</p>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      {/* Full Name */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base">Full Name</span>
                        </label>
                        <input
                          type="text"
                          placeholder="John Matthew"
                          className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      {/* Bio */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base">Bio</span>
                        </label>
                        <textarea
                          rows="3"
                          placeholder="A few words about yourself..."
                          className="textarea textarea-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300 resize-none"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          required
                        />
                      </div>

                      {/* Native Language */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Native Language
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="English, Hindi, Spanish, etc."
                          className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300"
                          value={formData.nativeLanguage}
                          onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                          required
                        />
                      </div>

                      {/* Country */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Country
                          </span>
                        </label>
                        <select
                          className="select select-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        >
                          <option value="" disabled>Select your country</option>
                          {["Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Italy", "Japan", "Mexico", "Netherlands", "New Zealand", "Russia", "Singapore", "South Africa", "South Korea", "Spain", "UAE", "United Kingdom", "United States"]
                            .map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Interests */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Select Your Interests
                          </span>
                          <span className="label-text-alt text-base-content/60">(At least 5)</span>
                        </label>
                        <div className="flex flex-wrap gap-2 sm:gap-3 p-4 bg-base-200/30 rounded-xl border border-base-300/30">
                          {interestOptions.map((interest, index) => (
                            <button
                              type="button"
                              key={interest}
                              onClick={() => toggleInterest(interest)}
                              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 animate-fade-in ${formData.interests.includes(interest)
                                  ? 'bg-primary text-primary-content border-primary shadow-lg shadow-primary/25'
                                  : 'bg-base-100/80 text-primary border-primary/40 hover:bg-primary/10 hover:border-primary/60'
                                }`}
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-base-content/60">
                          Selected: {formData.interests.length} interests
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 pb-6">
                      <button
                        type="button"
                        className="btn btn-ghost border border-primary/50 hover:bg-primary/10 order-2 sm:order-1 flex-1 sm:flex-none sm:w-32"
                        onClick={() => navigate('/')}
                        disabled={!isOnboarded}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary order-1 sm:order-2 flex-1 text-base font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        type="submit"
                        disabled={isPending || formData.interests.length < 5}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {isPending ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            &nbsp;{isOnboarded ? 'Updating...' : 'Onboarding...'}
                          </>
                        ) : (
                          isOnboarded ? 'Update Profile' : 'Complete Profile'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding
