import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Tag, Eye, Share2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import SocialShareButtons from '../../components/SocialShareButtons';

const NewsPage: React.FC = () => {
  const { news } = useData();
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const publishedNews = news.filter(article => article.status === 'published');
  
  const filteredNews = publishedNews.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const recentNews = filteredNews.slice(0, 8);
  const featuredNews = filteredNews[0] || null;

  useEffect(() => {
    if (featuredNews && !selectedNews) {
      setSelectedNews(featuredNews);
    }
  }, [featuredNews, selectedNews]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const getNewsTypeColor = (title: string) => {
    if (title.toLowerCase().includes('alert') || title.toLowerCase().includes('warning')) {
      return 'bg-red-500';
    }
    if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('hotline')) {
      return 'bg-red-500';
    }
    if (title.toLowerCase().includes('training') || title.toLowerCase().includes('workshop')) {
      return 'bg-blue-500';
    }
    return 'bg-yellow-500';
  };

  const getNewsTypeLabel = (title: string) => {
    if (title.toLowerCase().includes('alert') || title.toLowerCase().includes('warning')) {
      return 'Alert';
    }
    if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('hotline')) {
      return 'Emergency Hotlines!';
    }
    if (title.toLowerCase().includes('training') || title.toLowerCase().includes('workshop')) {
      return 'Training';
    }
    return 'Report and Incident';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-80 bg-blue-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 fixed lg:static z-10 h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 border-b border-blue-900">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Latest Updates</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-blue-200 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-7rem)]">
            {recentNews.map((article, index) => (
              <div
                key={article.id}
                className={`p-4 border-b border-blue-900 hover:bg-blue-900 cursor-pointer transition-colors ${
                  selectedNews?.id === article.id ? 'bg-blue-800 border-l-4 border-yellow-500' : ''
                }`}
                onClick={() => {
                  setSelectedNews(article);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${getNewsTypeColor(article.title)} text-white p-2 rounded-lg flex-shrink-0`}>
                    {getNewsTypeLabel(article.title).includes('Emergency') ? (
                      <Phone size={16} />
                    ) : getNewsTypeLabel(article.title).includes('Alert') ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-blue-200 text-xs">{formatTimeAgo(article.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-20 bg-blue-950 text-white p-3 rounded-full shadow-lg hover:bg-blue-900 lg:hidden"
          >
            <Filter size={20} />
          </button>
          
          {/* News Detail */}
          <div className="p-6 max-w-6xl mx-auto">
            {selectedNews ? (
              <article className="bg-white rounded-xl shadow-md overflow-hidden">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title} 
                  className="w-full h-80 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 ${getNewsTypeColor(selectedNews.title)} text-white rounded-full text-sm font-medium`}>
                      {getNewsTypeLabel(selectedNews.title)}
                    </span>
                    <span className="text-gray-500 text-sm">{formatTimeAgo(selectedNews.date)}</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedNews.author}</p>
                      <p className="text-gray-500 text-sm">MDRRMO Operations Center</p>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="mb-4">{selectedNews.excerpt}</p>
                    <div className="whitespace-pre-line">{selectedNews.content}</div>
                  </div>

                  {/* Social Share */}
                  <div className="border-t border-gray-200 pt-6">
                    <SocialShareButtons
                      url={`${window.location.origin}/news/${selectedNews.id}`}
                      title={selectedNews.title}
                      description={selectedNews.excerpt}
                      image={selectedNews.image}
                      hashtags={['MDRRMO', 'PioDuran', 'News']}
                    />
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">#FloodAlert</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">#DisasterPreparedness</span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">#EmergencyResponse</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">#PublicSafety</span>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a News Article</h2>
                <p className="text-gray-600">Choose an article from the sidebar to read the full content</p>
              </div>
            )}
            
            {/* Related Articles */}
            {selectedNews && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredNews
                    .filter(article => article.id !== selectedNews.id)
                    .slice(0, 3)
                    .map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                         onClick={() => setSelectedNews(article)}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          <span className={`text-xs font-medium ${getNewsTypeColor(article.title)} text-white px-2 py-1 rounded`}>
                            {getNewsTypeLabel(article.title)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                        <span className="text-xs text-gray-500">{formatTimeAgo(article.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;