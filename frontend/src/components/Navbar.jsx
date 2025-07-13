import { Link, useLocation } from "react-router";
import Logo from "./Logo";
import { BellIcon, LogOutIcon, Settings } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from '../lib/axios.js'
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = ({showLogo = false}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    },
  });
  const authUser = data?.user;
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/Chat/:id");

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['authUser'] });
      window.location.href = "/Login";
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

  return (
    <>
      {/* Background particles for navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden z-20">
        {/* Subtle floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div className="w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
        ))}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      </div>

      <nav className="relative shadow-lg backdrop-blur-md bg-gradient-to-r from-base-200/90 via-base-300/90 to-base-200/90 border-b border-base-300/50 sticky top-0 z-30 w-full">
        <Toaster position="top-center" reverseOrder={false} />
        
        {/* Main navbar content */}
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo section with enhanced styling */}
          {showLogo && (
            <Link to="/" className="flex-shrink-0 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Logo />
                </div>
              </div>
            </Link>
          )}

          {/* Right side navigation */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Theme selector with enhanced styling */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              <div className="relative">
                <ThemeSelector />
              </div>
            </div>

            {/* Notifications button with enhanced styling */}
            <Link to="/notifications" className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              <button className="relative btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300 group-hover:scale-110">
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-base-content/70 group-hover:text-primary transition-colors duration-300" />
                  {/* Notification indicator */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse" />
                </div>
              </button>
            </Link>

            {/* Profile dropdown with enhanced styling */}
            <div className="dropdown dropdown-end relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div tabIndex={0} role="button" className="relative btn btn-ghost btn-circle avatar group-hover:scale-110 transition-transform duration-300">
                <div className="w-9 rounded-full ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300 relative overflow-hidden">
                  <img src={authUser?.profilePic} alt="User Avatar" className="transition-transform duration-300 group-hover:scale-110" />
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-base-100" />
                </div>
              </div>

              {/* Enhanced dropdown menu */}
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100/95 backdrop-blur-md border border-base-300/50 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl"
              >
                <li>
                  <Link to="/Onboarding" className="group hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-md bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                        <CgProfile className="h-4 w-4 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors duration-300">Profile</span>
                    </div>
                  </Link>
                </li>
                
                <li>
                  <Link to="/settings" className="group hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-md bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                        <Settings className="h-4 w-4 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors duration-300">Settings</span>
                    </div>
                  </Link>
                </li>
                
                <div className="divider my-1 opacity-30"></div>
                
                <li>
                  <button 
                    className="group hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 transition-all duration-300 rounded-lg" 
                    onClick={() => mutate()}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-md bg-gradient-to-r from-red-500/20 to-pink-500/20 group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                        <LogOutIcon className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="group-hover:text-red-500 transition-colors duration-300">Logout</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </nav>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default Navbar;
