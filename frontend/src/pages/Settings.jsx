import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download, 
  LogOut,
  ChevronRight,
  Check,
  X
} from 'lucide-react';

const Settings = () => {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState('account');

  // Fetch user settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/settings');
      return response?.data;
    },
    retry: false
  });

  // Update settings mutation
  const { mutate: updateSettings } = useMutation({
    mutationFn: async (settingsData) => {
      const response = await axiosInstance.put('/user/settings', settingsData);
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast.success('Settings updated successfully!');
    },
    onError: () => toast.error('Failed to update settings')
  });

  // Delete account mutation
  const { mutate: deleteAccount } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete('/user/account');
      return response?.data;
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      // Redirect to login or home
    },
    onError: () => toast.error('Failed to delete account')
  });

  const settingsMenu = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'data', label: 'Data & Storage', icon: Download },
  ];

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading settings...</p>
        </div>
      </div>
    );
  }

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

        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-float-gentle { animation: float-gentle 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-300/30 relative overflow-hidden">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-accent/3" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/8 rounded-full blur-2xl animate-float-gentle" />

        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-base-100/95 backdrop-blur-sm border-b border-base-300/50">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">Settings</h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Menu */}
            <div className="w-full lg:w-80 bg-base-100/90 backdrop-blur-sm border-r border-base-300/50 p-4 sm:p-6">
              <nav className="space-y-2">
                {settingsMenu.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 animate-slide-in-left ${
                        activeSection === item.id
                          ? 'bg-primary text-primary-content shadow-lg shadow-primary/25'
                          : 'text-base-content hover:bg-base-200/50 hover:shadow-md'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="max-w-4xl">
                {/* Account Settings */}
                {activeSection === 'account' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Account Information
                      </h2>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Email Address</span>
                          </label>
                          <input
                            type="email"
                            className="input input-bordered bg-base-200/50"
                            value={settings?.email || ''}
                            onChange={(e) => handleSettingChange('email', e.target.value)}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Phone Number</span>
                          </label>
                          <input
                            type="tel"
                            className="input input-bordered bg-base-200/50"
                            value={settings?.phone || ''}
                            onChange={(e) => handleSettingChange('phone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h3 className="text-lg font-semibold text-primary mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="input input-bordered w-full bg-base-200/50"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="input input-bordered w-full bg-base-200/50"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="input input-bordered w-full bg-base-200/50"
                        />
                        <button className="btn btn-primary">Update Password</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </h2>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                          { key: 'messageNotifications', label: 'Message Notifications', desc: 'Get notified of new messages' },
                          { key: 'friendRequests', label: 'Friend Requests', desc: 'Notifications for friend requests' },
                          { key: 'callNotifications', label: 'Call Notifications', desc: 'Notifications for incoming calls' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-base-200/30 rounded-xl">
                            <div>
                              <h4 className="font-medium text-base-content">{item.label}</h4>
                              <p className="text-sm text-base-content/70">{item.desc}</p>
                            </div>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={settings?.[item.key] || false}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeSection === 'privacy' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Privacy & Security
                      </h2>
                      <div className="space-y-4">
                        {[
                          { key: 'profileVisibility', label: 'Profile Visibility', desc: 'Who can see your profile' },
                          { key: 'onlineStatus', label: 'Show Online Status', desc: 'Let others see when you\'re online' },
                          { key: 'lastSeen', label: 'Show Last Seen', desc: 'Let others see when you were last active' },
                          { key: 'readReceipts', label: 'Read Receipts', desc: 'Show when you\'ve read messages' },
                          { key: 'twoFactorAuth', label: 'Two-Factor Authentication', desc: 'Add extra security to your account' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-base-200/30 rounded-xl">
                            <div>
                              <h4 className="font-medium text-base-content">{item.label}</h4>
                              <p className="text-sm text-base-content/70">{item.desc}</p>
                            </div>
                            <input
                              type="checkbox"
                              className="toggle toggle-primary"
                              checked={settings?.[item.key] || false}
                              onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance */}
                {activeSection === 'appearance' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Appearance Settings
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Theme</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['light', 'dark', 'forest', 'aqua', 'luxury', 'dracula'].map((theme) => (
                              <button
                                key={theme}
                                className={`p-3 rounded-xl border-2 transition-all duration-300 capitalize ${
                                  settings?.theme === theme
                                    ? 'border-primary bg-primary/10'
                                    : 'border-base-300 hover:border-primary/50'
                                }`}
                                onClick={() => handleSettingChange('theme', theme)}
                              >
                                {theme}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Font Size</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">Small</span>
                            <input
                              type="range"
                              min="12"
                              max="20"
                              className="range range-primary flex-1"
                              value={settings?.fontSize || 16}
                              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                            />
                            <span className="text-lg">Large</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language & Region */}
                {activeSection === 'language' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Language & Region
                      </h2>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Language</span>
                          </label>
                          <select
                            className="select select-bordered bg-base-200/50"
                            value={settings?.language || 'en'}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Time Zone</span>
                          </label>
                          <select
                            className="select select-bordered bg-base-200/50"
                            value={settings?.timezone || 'UTC'}
                            onChange={(e) => handleSettingChange('timezone', e.target.value)}
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                            <option value="IST">India Standard Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data & Storage */}
                {activeSection === 'data' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-2xl p-6 border border-base-300/50 shadow-lg">
                      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Data & Storage
                      </h2>
                      <div className="space-y-4">
                        <div className="p-4 bg-base-200/30 rounded-xl">
                          <h4 className="font-medium mb-2">Download Your Data</h4>
                          <p className="text-sm text-base-content/70 mb-3">
                            Download a copy of all your data including messages, photos, and profile information.
                          </p>
                          <button className="btn btn-primary btn-sm">Request Download</button>
                        </div>
                        
                        <div className="p-4 bg-base-200/30 rounded-xl">
                          <h4 className="font-medium mb-2">Clear Cache</h4>
                          <p className="text-sm text-base-content/70 mb-3">
                            Clear cached data to free up storage space.
                          </p>
                          <button className="btn btn-outline btn-sm">Clear Cache</button>
                        </div>

                        <div className="p-4 bg-error/10 rounded-xl border border-error/20">
                          <h4 className="font-medium mb-2 text-error">Delete Account</h4>
                          <p className="text-sm text-base-content/70 mb-3">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => document.getElementById('delete-modal').showModal()}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        <dialog id="delete-modal" className="modal">
          <div className="modal-box bg-base-100/95 backdrop-blur-sm">
            <h3 className="font-bold text-lg text-error mb-4">Delete Account</h3>
            <p className="mb-4">
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
              All your data, messages, and connections will be lost.
            </p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn btn-ghost">Cancel</button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteAccount()}
                >
                  Delete Account
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default Settings;
