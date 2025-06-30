import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3,
  Users,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import SocialMediaManager from '../../components/SocialMediaManager';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  image?: string;
}

const SocialMediaManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'schedule' | 'analytics'>('overview');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: 'Join us for the upcoming Emergency Response Training this Saturday! 🚨 Learn essential skills to help your community during disasters.',
      platforms: ['facebook', 'twitter'],
      scheduledTime: '2025-01-25T10:00:00Z',
      status: 'scheduled',
      image: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg'
    },
    {
      id: '2',
      content: 'Weather Alert: Monitoring incoming weather system. Stay updated and follow safety protocols. #WeatherAlert #StaySafe',
      platforms: ['twitter', 'facebook'],
      scheduledTime: '2025-01-24T08:00:00Z',
      status: 'published'
    }
  ]);

  const socialStats = {
    totalFollowers: 8342,
    monthlyReach: 15600,
    engagement: 4.2,
    postsThisMonth: 24
  };

  const platformStats = [
    { platform: 'Facebook', followers: 2500, engagement: 4.8, posts: 8, color: 'bg-blue-600' },
    { platform: 'Twitter', followers: 1800, engagement: 3.2, posts: 12, color: 'bg-sky-500' },
    { platform: 'Instagram', followers: 3200, engagement: 5.1, posts: 6, color: 'bg-pink-600' },
    { platform: 'YouTube', followers: 842, engagement: 6.3, posts: 2, color: 'bg-red-600' }
  ];

  const recentActivity = [
    { type: 'like', platform: 'Facebook', content: 'BDRRM Training Workshop post', time: '2 hours ago' },
    { type: 'comment', platform: 'Instagram', content: 'Water rescue training photo', time: '4 hours ago' },
    { type: 'share', platform: 'Twitter', content: 'Weather alert update', time: '6 hours ago' },
    { type: 'follow', platform: 'Facebook', content: 'New follower: Maria Santos', time: '8 hours ago' }
  ];

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      setScheduledPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600">Manage your social media presence and engagement</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Post</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'posts', label: 'Manage Posts', icon: Edit },
            { id: 'schedule', label: 'Scheduled Posts', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(socialStats.totalFollowers)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Reach</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(socialStats.monthlyReach)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8% from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{socialStats.engagement}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.3% from last month</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Posts This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{socialStats.postsThisMonth}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Send className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+4 from last month</span>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {platformStats.map((platform) => (
                  <div key={platform.platform} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium text-gray-900">{platform.platform}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatNumber(platform.followers)} followers</div>
                      <div className="text-xs text-gray-500">{platform.engagement}% engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'like' && <Heart size={16} className="text-red-500 mt-1" />}
                      {activity.type === 'comment' && <MessageCircle size={16} className="text-blue-500 mt-1" />}
                      {activity.type === 'share' && <Share2 size={16} className="text-green-500 mt-1" />}
                      {activity.type === 'follow' && <Users size={16} className="text-purple-500 mt-1" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.content}</p>
                      <p className="text-xs text-gray-500">{activity.platform} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <SocialMediaManager />
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Posts</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.scheduledTime).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-3">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post content"
                          className="w-32 h-20 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Platforms:</span>
                        {post.platforms.map((platform) => (
                          <span key={platform} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Analytics</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Analytics chart would be displayed here</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">BDRRM Training Workshop</p>
                  <p className="text-xs text-gray-500">45 likes • 12 shares • 8 comments</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Water Rescue Training</p>
                  <p className="text-xs text-gray-500">67 likes • 8 shares • 12 comments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 25-34</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 35-44</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 45-54</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagement;