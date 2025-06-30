import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Newspaper, 
  Shield, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { news, services, incidents } = useData();

  const stats = [
    {
      title: 'Total News Articles',
      value: news.length,
      icon: Newspaper,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.status === 'active').length,
      icon: Shield,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Incident Reports',
      value: incidents.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '+8%'
    },
    {
      title: 'Pending Reports',
      value: incidents.filter(i => i.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%'
    }
  ];

  const recentIncidents = incidents.slice(0, 5);
  const recentNews = news.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the MDRRMO Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incident Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incident Reports</h2>
          </div>
          <div className="p-6">
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{incident.incidentType}</h3>
                      <p className="text-sm text-gray-600">{incident.location}</p>
                      <p className="text-xs text-gray-500">{incident.referenceNumber}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        incident.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                        incident.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.urgency}
                      </span>
                      {incident.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                      {incident.status === 'resolved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {incident.status === 'in-progress' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No incident reports yet</p>
            )}
          </div>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent News</h2>
          </div>
          <div className="p-6">
            {recentNews.length > 0 ? (
              <div className="space-y-4">
                {recentNews.map((article) => (
                  <div key={article.id} className="flex items-start space-x-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{article.date}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No news articles yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Newspaper className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Add News Article</h3>
            <p className="text-sm text-gray-600">Create a new news post</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Shield className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Services</h3>
            <p className="text-sm text-gray-600">Update service offerings</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="font-medium text-gray-900">Review Reports</h3>
            <p className="text-sm text-gray-600">Check incident reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;