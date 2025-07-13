import React, { useState } from 'react'
import { Link } from 'react-router'
import Logo from '../components/Logo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, Lock, Heart, Star } from 'lucide-react'

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/login', loginData)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    onError: (error) => {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.')
    }
  })

  const handleLogin = (e) => {
    e.preventDefault()
    mutate()
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
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float-gentle { animation: float-gentle 6s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-gradient-shift { 
          animation: gradient-shift 8s ease infinite; 
          background-size: 200% 200%; 
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0 animate-gradient-shift" />
        
        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-accent/6 rounded-full blur-xl animate-float-gentle" style={{ animationDelay: '4s' }} />
        
        {/* Floating Particles */}
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
            <div className="w-2 h-2 bg-primary/20 rounded-full" />
          </div>
        ))}

        <div className="relative z-10 p-4 bg-base-200 flex flex-col items-center justify-start overflow-y-auto" data-theme="forest">
          <Toaster position="top-center" reverseOrder={false} />

          {/* Hero / Intro Section - EXACT CONTENT WITH ENHANCED EFFECTS */}
          <section className="w-full pb-20 text-center relative">
            {/* Enhanced Logo Container */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse-gentle" />
              <div className="relative bg-base-100/80 backdrop-blur-sm p-4 rounded-2xl border border-base-300/50 shadow-xl">
                <Logo className="mx-auto scale-110 md:scale-125" />
              </div>
            </div>

            {/* Enhanced Title */}
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl font-bold mt-5 sm:mt-10 text-primary animate relative">
                Unmute Yourself
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
              </h1>
            </div>

            <p className="text-sm sm:text-lg mt-3 max-w-2xl mx-auto italic text-gray-500">
              "connect, collaborate, and share ideas with your voice"
            </p>

            {/* Enhanced Feature Cards */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 max-w-3xl mx-auto">
              {[
                { icon: '🎥', title: 'Instant Video Calls', desc: 'Feel their presence, not just their profile.' },
                { icon: '💬', title: 'Real-time Chat', desc: 'No delay. Just flow.' },
                { icon: '🌍', title: 'Find People Nearby', desc: 'Location-based matching for spontaneous conversations.' },
                { icon: '🎯', title: 'Interest Matching', desc: 'Chat with people who love what you love.' },
                { icon: '🗣️', title: 'Language Match', desc: 'Speak in the language you\'re most yourself in.' },
                { icon: '🤝', title: 'Shared Vibes', desc: 'Friendships based on vibes, not just algorithms.' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-lg border mt-3 border-yellow-100/50 rounded-xl pt-4 p-1 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300 relative overflow-hidden"
                >
                  {/* Enhanced card background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative text-3xl mb-3 absolute -top-5 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h4 className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase group-hover:text-secondary transition-colors duration-300">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Enhanced Floating Image */}
            <div className="absolute top-0 right-0 hidden sm:block animate-fadeInUp">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse-gentle" />
                <img src="./resources/chat.svg" alt="Video Call" className="relative mx-auto w-40 md:w-60 opacity-90 hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </section>

          {/* ENHANCED Login Card */}
          <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto my-8 bg-base-100/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-base-300/50 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-full" />
            
            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 relative z-10">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-accent" />
                    Welcome Back!
                  </h3>
                  <p className="text-sm lg:text-base text-base-content/70">"Make new friends. Not just followers."</p>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="johnmatthew@gmail.com"
                    className="input input-bordered w-full h-12 bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full h-12 bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  className="btn btn-primary w-full h-12 text-lg font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 relative overflow-hidden group mt-8" 
                  type="submit" 
                  disabled={isPending}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      &nbsp;Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Sign Up Link */}
                <p className="text-sm text-center text-base-content/70 mt-6">
                  Don't have an account?{' '}
                  <Link to="/Signup" className="text-primary hover:text-secondary hover:underline transition-colors duration-300 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
            
            {/* Right Side Image Section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 relative p-12">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-primary/20 rounded-full" />
                <div className="absolute top-1/3 right-1/3 w-8 h-8 border border-secondary/20 rounded-full" />
                <div className="absolute bottom-1/3 left-1/2 w-12 h-12 border border-accent/20 rounded-full" />
              </div>
              
              {/* Main image */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl animate-pulse-gentle" />
                <img src="./resources/videocall2.svg" alt="connect" className="relative w-full max-w-md opacity-90" />
              </div>
              
              {/* Quote */}
              <div className="text-xl lg:text-2xl font-medium text-primary italic flex items-center gap-3">
                <Star className="w-6 h-6 text-accent" />
                "Talk less. Connect more!"
                <Star className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
