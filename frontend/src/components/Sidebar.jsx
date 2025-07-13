import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Users, Bell, Settings, MessageCircle, User, Heart, Sparkles } from 'lucide-react';
import Logo from './Logo.jsx';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/Onboarding' },
  ];

  return (
    <>
      {/* Desktop Sidebar - Large screens */}
      <div className="hidden lg:block sticky top-0 w-64 h-screen bg-base-200/80 backdrop-blur-sm border-r border-base-300/50 overflow-hidden">
        {/* Sidebar background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/3 to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        
        {/* Floating accent elements */}
        <div className="absolute top-10 right-4 w-8 h-8 bg-primary/10 rounded-full animate-pulse-gentle" />
        <div className="absolute bottom-20 left-4 w-6 h-6 bg-secondary/10 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col h-full px-4 pb-4 pt-1">
          {/* Logo/Brand section */}
          <div className="mb-8 mx-auto text-center animate-fade-in-down">
            <Link to='/'>
            <Logo/>
            </Link>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 animate-slide-in-left ${
                    isActive 
                      ? 'bg-primary text-primary-content shadow-lg shadow-primary/25' 
                      : 'text-base-content hover:bg-base-300/50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-primary-content' : 'text-primary'
                    }`} />
                    {isActive && (
                      <div className="absolute -inset-1 bg-primary-content/20 rounded-full animate-ping" />
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-content rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="mt-auto pt-4 border-t border-base-300/50 animate-fade-in-up">
            <div className="text-center text-sm text-base-content/70">
              <p>Stay Connected</p>
              <div className="flex justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-secondary/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-2 h-2 bg-accent/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Small screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-200/90 backdrop-blur-md border-t border-base-300/50">
        {/* Background effects for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-secondary/3 to-accent/5" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-primary/10 to-transparent" />
        
        {/* Floating accent elements for mobile */}
        <div className="absolute top-2 right-4 w-3 h-3 bg-primary/10 rounded-full animate-pulse-gentle" />
        <div className="absolute top-2 left-4 w-2 h-2 bg-secondary/10 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        
        <nav className="relative z-10 flex items-center justify-around px-2 py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-in-left min-w-0 flex-1 ${
                  isActive 
                    ? 'bg-primary text-primary-content shadow-lg shadow-primary/25' 
                    : 'text-base-content hover:bg-base-300/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-primary-content' : 'text-primary'
                  }`} />
                  {isActive && (
                    <div className="absolute -inset-1 bg-primary-content/20 rounded-full animate-ping" />
                  )}
                </div>
                <span className={`text-xs font-medium truncate max-w-full ${
                  isActive ? 'text-primary-content' : 'text-base-content/70'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-content rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom gradient line for mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </>
  );
};

export default Sidebar;
