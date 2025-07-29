import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Shield,
  Key,
  Bell,
  Monitor,
  Save,
  Edit,
  Clock
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Unknown User',
    email: user?.email || 'unknown@cognizant.com',
    phone: '+91 98765 43210',
    location: 'Bangalore',
    department: 'Infrastructure Services',
    team: isManager ? 'Management' : 'Production Team',
    joinDate: '2022-03-15',
    employeeId: user?.engineerId || user?.id || 'Unknown',
    manager: isManager ? 'Senior Management' : 'Manager',
    role: isManager ? 'Manager' : 'Engineer',
    skills: isManager 
      ? ['Team Management', 'Strategic Planning', 'Process Improvement', 'Leadership'] 
      : ['Network Administration', 'Linux', 'Cloud Operations', 'Monitoring', 'Troubleshooting'],
    preferredShift: 'shift-a',
    shiftStartTime: '06:00',
    shiftEndTime: '16:00',
    isFlexibleTiming: false,
    weeklyHours: 50,
    overtimePreference: 'limited'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    shiftReminders: true,
    systemAlerts: true,
    teamUpdates: true,
    maintenanceAlerts: false
  });

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'schedule', name: 'Shift Schedule', icon: Clock },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Monitor }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  // Load stored shift preferences on component mount
  useEffect(() => {
    if (user?.engineerId) {
      const storedPrefs = localStorage.getItem(`shift_prefs_${user.engineerId}`);
      if (storedPrefs) {
        try {
          const prefs = JSON.parse(storedPrefs);
          setProfileData(prev => ({
            ...prev,
            ...prefs
          }));
        } catch (error) {
          console.error('Error loading shift preferences:', error);
        }
      }
    }
  }, [user?.engineerId]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
    
    // For demonstration: Store shift preferences in localStorage
    if (user?.engineerId) {
      const shiftPrefs = {
        preferredShift: profileData.preferredShift,
        shiftStartTime: profileData.shiftStartTime,
        shiftEndTime: profileData.shiftEndTime,
        isFlexibleTiming: profileData.isFlexibleTiming,
        weeklyHours: profileData.weeklyHours,
        overtimePreference: profileData.overtimePreference
      };
      localStorage.setItem(`shift_prefs_${user.engineerId}`, JSON.stringify(shiftPrefs));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Background */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-8">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xl">
                SG
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your account information and preferences</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`mr-3 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="input w-full"
                      />
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input w-full"
                      />
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="input w-full"
                      />
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                    {isEditing ? (
                      <select
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="input w-full"
                      >
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Kolkata">Kolkata</option>
                      </select>
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profileData.location}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Department</label>
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profileData.department}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Team</label>
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profileData.team}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Join Date</label>
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Employee ID</label>
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <Shield className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{profileData.employeeId}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shift Schedule Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Shift</label>
                    {isEditing ? (
                      <select
                        value={profileData.preferredShift}
                        onChange={(e) => handleInputChange('preferredShift', e.target.value)}
                        className="input w-full"
                      >
                        <option value="shift-a">Shift A (Day) - 06:00 to 16:00</option>
                        <option value="shift-b">Shift B (Evening) - 14:00 to 00:00</option>
                        <option value="shift-c">Shift C (Night) - 22:00 to 08:00</option>
                        <option value="custom">Custom Timing</option>
                      </select>
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profileData.preferredShift === 'shift-a' && 'Shift A (Day) - 06:00 to 16:00'}
                          {profileData.preferredShift === 'shift-b' && 'Shift B (Evening) - 14:00 to 00:00'}
                          {profileData.preferredShift === 'shift-c' && 'Shift C (Night) - 22:00 to 08:00'}
                          {profileData.preferredShift === 'custom' && `Custom - ${profileData.shiftStartTime} to ${profileData.shiftEndTime}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Weekly Hours</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="40"
                        max="60"
                        value={profileData.weeklyHours}
                        onChange={(e) => handleInputChange('weeklyHours', e.target.value)}
                        className="input w-full"
                      />
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profileData.weeklyHours} hours/week</span>
                      </div>
                    )}
                  </div>

                  {(isEditing && profileData.preferredShift === 'custom') && (
                    <>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Shift Start Time</label>
                        <input
                          type="time"
                          value={profileData.shiftStartTime}
                          onChange={(e) => handleInputChange('shiftStartTime', e.target.value)}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Shift End Time</label>
                        <input
                          type="time"
                          value={profileData.shiftEndTime}
                          onChange={(e) => handleInputChange('shiftEndTime', e.target.value)}
                          className="input w-full"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Overtime Preference</label>
                    {isEditing ? (
                      <select
                        value={profileData.overtimePreference}
                        onChange={(e) => handleInputChange('overtimePreference', e.target.value)}
                        className="input w-full"
                      >
                        <option value="none">No Overtime</option>
                        <option value="limited">Limited Overtime (2-4 hours)</option>
                        <option value="flexible">Flexible (As needed)</option>
                        <option value="available">Always Available</option>
                      </select>
                    ) : (
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profileData.overtimePreference === 'none' && 'No Overtime'}
                          {profileData.overtimePreference === 'limited' && 'Limited Overtime'}
                          {profileData.overtimePreference === 'flexible' && 'Flexible'}
                          {profileData.overtimePreference === 'available' && 'Always Available'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Flexible Timing</h3>
                        <p className="text-sm text-gray-600">Allow flexible start/end times within your shift</p>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.isFlexibleTiming}
                            onChange={(e) => handleInputChange('isFlexibleTiming', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          profileData.isFlexibleTiming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profileData.isFlexibleTiming ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="btn btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Schedule Settings
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Password</h3>
                        <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                      </div>
                      <button className="btn btn-secondary">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="btn btn-primary">Enable 2FA</button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                        <p className="text-sm text-gray-600">Manage your active login sessions</p>
                      </div>
                      <button className="btn btn-secondary">View Sessions</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'shiftReminders' && 'Get reminders about upcoming shifts'}
                          {key === 'systemAlerts' && 'Important system maintenance alerts'}
                          {key === 'teamUpdates' && 'Updates from your team and manager'}
                          {key === 'maintenanceAlerts' && 'Planned maintenance notifications'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Theme</label>
                        <select className="input w-full">
                          <option value="system">System Default</option>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Language</label>
                        <select className="input w-full">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        <span className="ml-2 text-gray-900">Show quick actions panel</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
                        <span className="ml-2 text-gray-900">Display holiday calendar</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" defaultChecked />
                        <span className="ml-2 text-gray-900">Show recent activities</span>
                      </label>
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
};

export default Profile; 