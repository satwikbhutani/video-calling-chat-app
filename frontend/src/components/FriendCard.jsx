import { Link } from "react-router";
import { IoLanguageSharp } from "react-icons/io5";
import { MapPinIcon } from "lucide-react";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const FriendCard = ({ friend }) => {
  return (
    <div className="group bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-2xl shadow-md hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative animate-fade-in">
      {/* Subtle Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full" />

      <div className="card-body p-4 sm:p-5 space-y-3 sm:space-y-4 relative z-10">
        {/* User Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="avatar relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 relative overflow-hidden">
              <img 
                src={friend.profilePic || '/default-avatar.png'} 
                alt={friend.name} 
                className="object-cover"
                onError={(e) => e.target.src = '/default-avatar.png'}
              />
              {/* Online Status Indicator */}
              {friend.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-success rounded-full border-2 border-base-100 animate-pulse-gentle" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-base-content truncate group-hover:text-primary transition-colors duration-300">
              {friend.name}
            </h3>
            {friend.location && (
              <div className="flex items-center text-xs text-base-content/70 mt-1 truncate">
                <MapPinIcon className="size-3 sm:size-4 mr-1 flex-shrink-0" />
                <span>{friend.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Language */}
        {friend.nativeLanguage && (
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline badge-xs sm:badge-sm flex items-center gap-1 py-1.5 sm:py-2 px-2 sm:px-3 border-base-300/70 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
              <IoLanguageSharp className="text-base-content/70 size-3 sm:size-4" />
              <span className="text-xs">Language: {capitalize(friend.nativeLanguage)}</span>
            </span>
          </div>
        )}

        {/* Bio */}
        {friend.bio && (
          <p className="text-xs sm:text-sm text-base-content/70 italic line-clamp-2 mt-2">
            "{friend.bio}"
          </p>
        )}

        {/* Message Button */}
        <Link
          to={`/Chat/${friend._id}`}
          className="btn btn-primary btn-sm w-full mt-2 sm:mt-3 text-sm relative overflow-hidden group/button transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700" />
          Message
        </Link>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default FriendCard;
