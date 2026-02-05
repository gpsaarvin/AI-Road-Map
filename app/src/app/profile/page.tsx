"use client";
import { useState, useEffect } from 'react';
import { SettingsCard } from '@/components/SettingsCard';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { MultiSelect } from '@/components/MultiSelect';
import { Toast } from '@/components/Toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { saveProfile } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();

  // Basic User Information
  const [profilePic, setProfilePic] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
      setPhone(user.phone || '');
      setCountry(user.country || 'India');
      setProfilePic(user.profileImage || '');
    }
  }, [user]);

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  // Learning Preferences
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [interestedDomains, setInterestedDomains] = useState<string[]>(['Web Development', 'AI / ML']);
  const [studyTime, setStudyTime] = useState('1 hr');

  // Theme & UI Settings
  const [fontSize, setFontSize] = useState('Medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [progressReminders, setProgressReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [youtubeAlerts, setYoutubeAlerts] = useState(true);

  // UI State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    if (phone && !/^\+?[\d\s\-()]+$/.test(phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle profile save with API integration
   * Validates form data and sends to backend
   */
  const handleSaveChanges = async () => {
    // Step 1: Validate form data
    if (!validateForm()) {
      setToast({ message: 'Please fix the errors before saving', type: 'error' });
      return;
    }

    // Step 2: Set loading state
    setIsSaving(true);
    setErrors({});

    try {
      // Step 3: Prepare profile data
      const profileData = {
        email,
        fullName: fullName.trim(),
        username: username.trim(),
        phone: phone.trim(),
        country,
        profileImage: profilePic
      };

      // Step 4: Send to API
      const response = await saveProfile(profileData);

      // Step 5: Handle success
      if (response.success) {
        // Update auth context
        updateUser({
          fullName: fullName.trim(),
          username: username.trim(),
          phone: phone.trim(),
          country,
          profileImage: profilePic
        });
        
        setToast({ 
          message: 'Profile updated successfully! 🎉', 
          type: 'success' 
        });
      } else {
        throw new Error(response.message || 'Failed to save profile');
      }

    } catch (error: any) {
      console.error('Profile save error:', error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          backendErrors[err.field] = err.message;
        });
        setErrors(backendErrors);
        setToast({ 
          message: error.response.data.message || 'Validation failed', 
          type: 'error' 
        });
      } else {
        // Handle network or unexpected errors
        setToast({ 
          message: error.response?.data?.message || 'Failed to save profile. Please try again.', 
          type: 'error' 
        });
      }
    } finally {
      // Step 6: Reset loading state
      setIsSaving(false);
    }
  };

  const handleClearHistory = () => {
    // TODO: API call to clear learning history
    setToast({ message: 'Learning history cleared', type: 'success' });
  };

  const handleDownloadData = () => {
    // TODO: API call to generate and download user data
    setToast({ message: 'Download started...', type: 'info' });
  };

  const handleLogoutAll = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // TODO: API call to delete account
    setShowDeleteDialog(false);
    setToast({ message: 'Account deletion initiated', type: 'info' });
  };

  const domainOptions = [
    'Web Development',
    'AI / ML',
    'Data Structures',
    'Cloud Computing',
    'Cybersecurity',
    'Mobile Development',
    'DevOps',
    'Database Management'
  ];

  return (
    <ProtectedRoute>
      <div className="pb-20 md:pb-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your preferences, learning goals, and account settings</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* 1. BASIC USER INFORMATION */}
        <SettingsCard title="Basic Information" icon="👤">
          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md text-sm font-medium transition">
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                error={errors.fullName}
              />
              
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                error={errors.username}
              />
              
              <FormInput
                label="Phone Number (Optional)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                error={errors.phone}
              />
            </div>

            <FormSelect
              label="Country / Region"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'India', label: 'India' },
                { value: 'United States', label: 'United States' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Canada', label: 'Canada' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Other', label: 'Other' }
              ]}
            />

            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full md:w-auto px-6 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </SettingsCard>

        {/* 2. LEARNING PREFERENCES */}
        <SettingsCard title="Learning Preferences" icon="🎯">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Preferred Learning Language"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
                  { value: 'Hindi', label: 'हिन्दी (Hindi)' },
                  { value: 'Spanish', label: 'Español (Spanish)' },
                  { value: 'French', label: 'Français (French)' },
                  { value: 'German', label: 'Deutsch (German)' }
                ]}
              />

              <FormSelect
                label="Current Skill Level"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                options={[
                  { value: 'Beginner', label: '🌱 Beginner' },
                  { value: 'Intermediate', label: '🚀 Intermediate' },
                  { value: 'Advanced', label: '⭐ Advanced' }
                ]}
              />
            </div>

            <MultiSelect
              label="Interested Domains"
              options={domainOptions}
              selected={interestedDomains}
              onChange={setInterestedDomains}
            />

            <FormSelect
              label="Daily Study Time Goal"
              value={studyTime}
              onChange={(e) => setStudyTime(e.target.value)}
              options={[
                { value: '30 min', label: '30 minutes' },
                { value: '1 hr', label: '1 hour' },
                { value: '2 hrs', label: '2 hours' },
                { value: '3 hrs', label: '3 hours' },
                { value: '4+ hrs', label: '4+ hours' }
              ]}
            />
          </div>
        </SettingsCard>

        {/* 3. THEME & UI SETTINGS */}
        <SettingsCard title="Theme & UI Settings" icon="🎨">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme Mode</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Switch between light and dark theme</p>
              </div>
              <ThemeToggle />
            </div>

            <div className="border-t dark:border-neutral-800" />

            <FormSelect
              label="Font Size"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              options={[
                { value: 'Small', label: 'Small (14px)' },
                { value: 'Medium', label: 'Medium (16px)' },
                { value: 'Large', label: 'Large (18px)' }
              ]}
            />

            <ToggleSwitch
              label="Animations & Transitions"
              description="Enable smooth animations throughout the app"
              checked={animationsEnabled}
              onChange={setAnimationsEnabled}
            />
          </div>
        </SettingsCard>

        {/* 4. NOTIFICATION SETTINGS */}
        <SettingsCard title="Notification Settings" icon="🔔">
          <div className="space-y-2">
            <ToggleSwitch
              label="Email Notifications"
              description="Receive updates and announcements via email"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />

            <div className="border-t dark:border-neutral-800" />

            <ToggleSwitch
              label="Course Progress Reminders"
              description="Get reminded about incomplete courses"
              checked={progressReminders}
              onChange={setProgressReminders}
            />

            <div className="border-t dark:border-neutral-800" />

            <ToggleSwitch
              label="Weekly Learning Summary"
              description="Receive a summary of your weekly progress"
              checked={weeklySummary}
              onChange={setWeeklySummary}
            />

            <div className="border-t dark:border-neutral-800" />

            <ToggleSwitch
              label="YouTube Recommendation Alerts"
              description="Get notified about new recommended videos"
              checked={youtubeAlerts}
              onChange={setYoutubeAlerts}
            />
          </div>
        </SettingsCard>

        {/* 5. SECURITY & ACCOUNT */}
        <SettingsCard title="Security & Account" icon="🔒">
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Update your password</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <button
              onClick={handleLogoutAll}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Logout from All Devices</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sign out of all active sessions</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">Permanently delete your account and data</p>
                </div>
                <span className="text-red-400">→</span>
              </div>
            </button>
          </div>
        </SettingsCard>

        {/* 6. DATA & PRIVACY */}
        <SettingsCard title="Data & Privacy" icon="🛡️">
          <div className="space-y-3">
            <button
              onClick={handleClearHistory}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Clear Learning History</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Remove all course progress and history</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <button
              onClick={handleDownloadData}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Download User Data</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Export your data in JSON format</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <a
              href="/privacy-policy"
              className="block w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Privacy Policy</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Read our privacy policy and terms</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </a>
          </div>
        </SettingsCard>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Logout from All Devices?"
        message="You will be logged out from all your active sessions. You'll need to sign in again on each device."
        confirmText="Logout All"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Account?"
        message="This action cannot be undone. All your data including course progress, preferences, and personal information will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        danger
      />
      </div>
    </ProtectedRoute>
  );
}
