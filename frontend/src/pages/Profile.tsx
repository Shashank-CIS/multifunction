import { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon, 
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  CameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isPhotoChanged, setIsPhotoChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update states when user prop changes
  useEffect(() => {
    setCurrentUser(user);
    setEditedUser(user);
  }, [user]);

  const handleSave = () => {
    // Update the current user with edited data
    let updatedUser = { ...editedUser };
    
    // If photo was changed, update the user's avatar
    if (isPhotoChanged && previewPhoto) {
      updatedUser = { ...updatedUser, avatar: previewPhoto };
    }
    
    // Update the current user state
    setCurrentUser(updatedUser);
    setEditedUser(updatedUser);
    
    setIsEditing(false);
    setIsPhotoChanged(false);
    setPreviewPhoto(null);
    
    // In a real app, this would make an API call to update the user
    console.log('Saving user profile:', updatedUser);
    
    // Show success message (you could add a toast notification here)
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
    setPreviewPhoto(null);
    setIsPhotoChanged(false);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewPhoto(result);
        setIsPhotoChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreviewPhoto(null);
    setIsPhotoChanged(true);
    // Set to default avatar or empty
    const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
    setEditedUser({ ...editedUser, avatar: defaultAvatar });
  };

  const addSkill = () => {
    const newSkill = prompt('Enter new skill:');
    if (newSkill && !editedUser.skills.includes(newSkill)) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, newSkill]
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addInterest = () => {
    const newInterest = prompt('Enter new interest:');
    if (newInterest && !editedUser.interests.includes(newInterest)) {
      setEditedUser({
        ...editedUser,
        interests: [...editedUser.interests, newInterest]
      });
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setEditedUser({
      ...editedUser,
      interests: editedUser.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  // Get current avatar source
  const getCurrentAvatar = () => {
    if (previewPhoto) return previewPhoto;
    return editedUser.avatar || currentUser.avatar;
  };

  // Use currentUser for display, editedUser for editing
  const displayUser = isEditing ? editedUser : currentUser;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Profile Photo with Edit Capability */}
                <div className="relative">
                  <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                    src={getCurrentAvatar()}
                    alt={displayUser.name}
                  />
                  {isEditing && (
                    <>
                      {/* Camera overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <button
                          onClick={triggerPhotoUpload}
                          className="text-white hover:text-gray-300 transition-colors"
                          title="Change profile photo"
                        >
                          <CameraIcon className="w-6 h-6" />
                        </button>
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      
                      {/* Edit icon */}
                      <button
                        onClick={triggerPhotoUpload}
                        className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg"
                        title="Change profile photo"
                      >
                        <PencilIcon className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900">{displayUser.name}</h1>
                  <p className="text-lg text-gray-600">{displayUser.department}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      displayUser.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${
                        displayUser.isOnline ? 'bg-green-400' : 'bg-gray-400'
                      }`}></span>
                      {displayUser.isOnline ? 'Online' : 'Offline'}
                    </span>
                    <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <StarIcon className="w-3 h-3 mr-1" />
                      {displayUser.points} points
                    </span>
                  </div>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
              {isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {/* Photo Change Options (when editing) */}
            {isEditing && (
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={triggerPhotoUpload}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PhotoIcon className="w-4 h-4 mr-2" />
                  Upload Photo
                </button>
                {previewPhoto && (
                  <button
                    onClick={removePhoto}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                )}
                {isPhotoChanged && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Photo updated
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{displayUser.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{displayUser.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      {isEditing ? (
                        <select
                          value={editedUser.department}
                          onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Customer Intelligence & Insights</option>
                          <option>Engineering</option>
                          <option>Product</option>
                          <option>Design</option>
                          <option>Marketing</option>
                          <option>Sales</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{displayUser.department}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Join Date
                      </label>
                      <div className="flex items-center">
                        <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <span>{new Date(displayUser.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    {isEditing && (
                      <button
                        onClick={addSkill}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Add Skill
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Interests</h3>
                    {isEditing && (
                      <button
                        onClick={addInterest}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Add Interest
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {interest}
                        {isEditing && (
                          <button
                            onClick={() => removeInterest(interest)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {displayUser.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{badge.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{badge.name}</h4>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Make your profile visible to other team members</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <hr />

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Theme Preferences</h4>
                  <select className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                    <div className="space-y-3 max-w-md">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                      Enable 2FA
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Active Sessions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Current session</p>
                          <p className="text-xs text-gray-600">Windows • Chrome • India</p>
                        </div>
                        <span className="text-xs text-green-600">Active now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 