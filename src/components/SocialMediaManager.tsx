import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Share2, 
  Copy, 
  Check,
  ExternalLink,
  MessageCircle,
  Heart,
  Send
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  image?: string;
  link?: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface SocialMediaManagerProps {
  content?: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  };
}

const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'share' | 'manage' | 'analytics'>('share');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postContent, setPostContent] = useState('');
  const [copied, setCopied] = useState(false);

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      followers: '2.5K',
      shareUrl: (url: string, text: string) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      followers: '1.8K',
      shareUrl: (url: string, text: string) => 
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=MDRRMO,PioDuran,DisasterPreparedness`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-pink-600',
      followers: '3.2K',
      shareUrl: () => 'https://www.instagram.com/' // Instagram doesn't support direct sharing
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'bg-red-600',
      followers: '892',
      shareUrl: (url: string, text: string) => 
        `https://www.youtube.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    }
  ];

  const recentPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'facebook',
      content: 'BDRRM Planning Training Workshop completed successfully! 🎯 Thank you to all barangay officials who participated.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
      status: 'published',
      engagement: { likes: 45, shares: 12, comments: 8 }
    },
    {
      id: '2',
      platform: 'twitter',
      content: 'Nationwide Earthquake Drill: Over 5,000 participants joined our community preparedness exercise! 🏢 #DisasterPreparedness #PioDuran',
      status: 'published',
      engagement: { likes: 23, shares: 18, comments: 5 }
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Water rescue training in action! 🌊 Our volunteers are ready to serve the community.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
      status: 'published',
      engagement: { likes: 67, shares: 8, comments: 12 }
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleShare = (platform: any) => {
    const url = content?.url || window.location.href;
    const text = content?.title || postContent || 'Check out this update from MDRRMO Pio Duran';
    
    if (platform.id === 'instagram') {
      // Instagram requires manual sharing
      copyToClipboard(`${text}\n\n${url}`);
      window.open(platform.shareUrl(), '_blank');
    } else {
      window.open(platform.shareUrl(url, text), '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateHashtags = () => {
    return '#MDRRMO #PioDuran #DisasterPreparedness #CommunityResilience #EmergencyResponse #Albay #Philippines';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Share2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Social Media Hub</h3>
              <p className="text-sm text-gray-600">Share content and manage social presence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'share', label: 'Quick Share' },
            { id: 'manage', label: 'Manage Posts' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'share' && (
          <div className="space-y-6">
            {/* Content Preview */}
            {content && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h4 className="font-medium text-gray-900 mb-2">Content to Share</h4>
                <div className="flex space-x-4">
                  {content.image && (
                    <img 
                      src={content.image} 
                      alt={content.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{content.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                    {content.url && (
                      <p className="text-xs text-blue-600 mt-2">{content.url}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add your custom message here..."
              />
              <div className="mt-2 flex justify-between items-center">
                <button
                  onClick={() => setPostContent(postContent + ' ' + generateHashtags())}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Add Hashtags
                </button>
                <span className="text-xs text-gray-500">{postContent.length}/280</span>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Share to Platforms</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleShare(platform)}
                    className={`${platform.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
                  >
                    <platform.icon size={24} />
                    <span className="text-sm font-medium">{platform.name}</span>
                    <span className="text-xs opacity-90">{platform.followers} followers</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard(content?.url || window.location.href)}
                  className="bg-white text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 flex items-center space-x-2 text-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                <button className="bg-white text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 flex items-center space-x-2 text-sm">
                  <Send size={14} />
                  <span>Email Share</span>
                </button>
                <button className="bg-white text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 flex items-center space-x-2 text-sm">
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Recent Posts */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Recent Posts</h4>
              <div className="space-y-4">
                {recentPosts.map((post) => {
                  const platform = socialPlatforms.find(p => p.id === post.platform);
                  return (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`${platform?.color} p-2 rounded-lg`}>
                          {platform && <platform.icon size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{platform?.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt="Post"
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart size={14} />
                              <span>{post.engagement.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share2 size={14} />
                              <span>{post.engagement.shares}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={14} />
                              <span>{post.engagement.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Platform Stats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Platform Performance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => (
                  <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`${platform.color} p-2 rounded-lg`}>
                          <platform.icon size={16} className="text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{platform.name}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <span className="font-medium">{platform.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-medium text-green-600">4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Posts This Month</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">This Month's Overview</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.2K</div>
                  <div className="text-sm text-gray-600">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Engagements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24</div>
                  <div className="text-sm text-gray-600">New Followers</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaManager;