import React, { useState } from 'react'
import { Link } from 'react-router'
import Logo from '../components/Logo'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import toast, { Toaster } from 'react-hot-toast'
import { User, Mail, Lock, Shield, Sparkles } from 'lucide-react'

const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/signup', signupData)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    onError: (error) => {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.')
    }
  });

  const handleSignup = (e) => {
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

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden" data-theme="forest">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-accent/6 rounded-full blur-xl animate-float-gentle" style={{ animationDelay: '4s' }} />

        {/* Main Container */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl bg-base-100/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-base-300/50 overflow-hidden relative animate-fade-in h-[90vh]">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />

            <div className="flex flex-col lg:flex-row h-full">
              {/* LEFT PANEL - Branding Section (Fixed, Compact) */}
              <div className="w-full lg:w-2/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 relative animate-slide-in-left lg:h-full">
                {/* Logo Section */}
                <div className="mb-4 lg:mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl animate-pulse-gentle" />
                  <div className="relative bg-base-100/80 backdrop-blur-sm p-3 lg:p-4 rounded-2xl border border-base-300/50 shadow-xl">
                    <Logo />
                  </div>
                </div>

                {/* Tagline */}
                <div className="mb-4 lg:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-2 lg:mb-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
                    "A voice for every silence!"
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
                  </h2>
                  <p className="text-base-content/70 text-xs sm:text-sm max-w-xs lg:max-w-sm">
                    Join thousands of people connecting authentically through meaningful conversations.
                  </p>
                </div>

                {/* Compact Illustration */}
                <div className="hidden md:flex w-32 h-32 lg:w-40 lg:h-40 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse-gentle" />
                  <img 
                    src="./resources/videocall.svg" 
                    alt="Video call illustration" 
                    className="relative w-full h-full opacity-90 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* RIGHT PANEL - Signup Form (Scrollable) */}
              <div className="w-full lg:w-3/5 lg:h-full overflow-y-auto right-panel-scroll animate-slide-in-right">
                <div className="p-6 sm:p-8 lg:p-10">
                  <form onSubmit={handleSignup} className="space-y-6">
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-3">
                        <User className="w-6 h-6 sm:w-8 sm:h-8" />
                        Create an Account
                      </h3>
                      <p className="text-base-content/70 text-sm sm:text-base">
                        Unmute yourself. Start connecting.
                      </p>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                      {/* Full Name */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-base flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="John Matthew"
                          className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300 h-12"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          required
                        />
                      </div>

                      {/* Email */}
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
                          className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300 h-12"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          required
                        />
                      </div>

                      {/* Password */}
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
                          className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300 h-12"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                        />
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Must be at least 6 characters long
                          </span>
                        </label>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3 p-4 rounded-xl  hover:bg-base-200/50 transition-colors duration-300">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary checkbox-sm" 
                            required 
                          />
                          <span className="label-text text-sm items-center gap-2">
                            I agree to the{' '}
                            <span className="text-primary hover:underline font-medium cursor-pointer">terms of service</span> and{' '}
                            <span className="text-primary hover:underline font-medium cursor-pointer">privacy policy</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                      className="btn btn-primary w-full h-12 text-base font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 relative overflow-hidden group mt-8" 
                      type="submit" 
                      disabled={isPending}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          &nbsp;Signing Up...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    {/* Sign In Link */}
                    <p className="text-sm text-center text-base-content/70 mt-6 pb-6">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-primary hover:text-secondary hover:underline transition-colors duration-300 font-medium"
                      >
                        Sign in
                      </Link>
                    </p>
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

export default Signup
