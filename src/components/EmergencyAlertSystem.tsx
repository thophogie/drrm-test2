import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Siren, 
  Send, 
  Clock, 
  MapPin, 
  Users, 
  Zap,
  CheckCircle,
  X,
  Settings,
  Bell,
  Smartphone,
  Radio,
  Megaphone
} from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'typhoon' | 'earthquake' | 'flood' | 'fire' | 'landslide' | 'tsunami' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  issuedAt: string;
  expiresAt?: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  channels: string[];
  sentTo: {
    platform: string;
    status: 'pending' | 'sent' | 'failed';
    sentAt?: string;
    reach?: number;
  }[];
  priority: 1 | 2 | 3 | 4 | 5; // 5 = highest priority
  autoTriggers?: {
    weatherCondition?: string;
    magnitude?: number;
    waterLevel?: number;
  };
}

interface EmergencyAlertSystemProps {
  onAlertSent?: (alert: EmergencyAlert) => void;
}

const EmergencyAlertSystem: React.FC<EmergencyAlertSystemProps> = ({ onAlertSent }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history' | 'settings'>('active');
  
  const [newAlert, setNewAlert] = useState<Partial<EmergencyAlert>>({
    type: 'general',
    severity: 'medium',
    title: '',
    message: '',
    location: '',
    channels: ['social-media', 'sms', 'email'],
    priority: 3
  });

  const alertTypes = [
    { id: 'typhoon', name: 'Typhoon/Storm', icon: '🌪️', color: 'bg-purple-500' },
    { id: 'earthquake', name: 'Earthquake', icon: '🌍', color: 'bg-red-600' },
    { id: 'flood', name: 'Flood', icon: '🌊', color: 'bg-blue-600' },
    { id: 'fire', name: 'Fire', icon: '🔥', color: 'bg-orange-600' },
    { id: 'landslide', name: 'Landslide', icon: '⛰️', color: 'bg-amber-600' },
    { id: 'tsunami', name: 'Tsunami', icon: '🌊', color: 'bg-blue-800' },
    { id: 'general', name: 'General Alert', icon: '⚠️', color: 'bg-gray-600' }
  ];

  const severityLevels = [
    { id: 'low', name: 'Advisory', color: 'bg-green-500', description: 'Information only' },
    { id: 'medium', name: 'Watch', color: 'bg-yellow-500', description: 'Be prepared' },
    { id: 'high', name: 'Warning', color: 'bg-orange-500', description: 'Take action' },
    { id: 'critical', name: 'Emergency', color: 'bg-red-600', description: 'Immediate action required' }
  ];

  const communicationChannels = [
    { id: 'social-media', name: 'Social Media', icon: Megaphone, description: 'Facebook, Twitter, Instagram' },
    { id: 'sms', name: 'SMS Alerts', icon: Smartphone, description: 'Text messages to registered numbers' },
    { id: 'email', name: 'Email Alerts', icon: Send, description: 'Email notifications' },
    { id: 'radio', name: 'Radio Broadcast', icon: Radio, description: 'Local radio stations' },
    { id: 'loudspeaker', name: 'Public Address', icon: Megaphone, description: 'Community loudspeakers' },
    { id: 'sirens', name: 'Emergency Sirens', icon: Siren, description: 'Municipal warning sirens' }
  ];

  // Sample alerts for demonstration
  useEffect(() => {
    const sampleAlerts: EmergencyAlert[] = [
      {
        id: '1',
        type: 'typhoon',
        severity: 'high',
        title: 'Typhoon Warning - Signal No. 2',
        message: 'Typhoon "Pepito" is approaching. Expected landfall in 12 hours. Residents in low-lying areas should evacuate immediately to designated evacuation centers.',
        location: 'Municipality-wide',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        channels: ['social-media', 'sms', 'radio', 'sirens'],
        sentTo: [
          { platform: 'Facebook', status: 'sent', sentAt: new Date().toISOString(), reach: 2500 },
          { platform: 'Twitter', status: 'sent', sentAt: new Date().toISOString(), reach: 1800 },
          { platform: 'SMS', status: 'sent', sentAt: new Date().toISOString(), reach: 5000 },
          { platform: 'Radio', status: 'sent', sentAt: new Date().toISOString(), reach: 15000 }
        ],
        priority: 5
      },
      {
        id: '2',
        type: 'flood',
        severity: 'medium',
        title: 'Flood Advisory',
        message: 'Heavy rainfall may cause flooding in low-lying areas. Monitor water levels and be prepared to evacuate if necessary.',
        location: 'Coastal Barangays',
        issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        channels: ['social-media', 'email'],
        sentTo: [
          { platform: 'Facebook', status: 'sent', sentAt: new Date().toISOString(), reach: 1200 },
          { platform: 'Email', status: 'sent', sentAt: new Date().toISOString(), reach: 800 }
        ],
        priority: 3
      }
    ];
    setAlerts(sampleAlerts);
  }, []);

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message) {
      alert('Please fill in all required fields');
      return;
    }

    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      type: newAlert.type as any,
      severity: newAlert.severity as any,
      title: newAlert.title,
      message: newAlert.message,
      location: newAlert.location || 'Municipality-wide',
      issuedAt: new Date().toISOString(),
      status: 'draft',
      channels: newAlert.channels || [],
      sentTo: [],
      priority: newAlert.priority || 3
    };

    setAlerts(prev => [alert, ...prev]);
    setNewAlert({
      type: 'general',
      severity: 'medium',
      title: '',
      message: '',
      location: '',
      channels: ['social-media', 'sms', 'email'],
      priority: 3
    });
    setIsCreating(false);
  };

  const handleSendAlert = async (alertId: string) => {
    setIsSending(true);
    
    // Simulate sending to different platforms
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    const updatedSentTo = alert.channels.map(channel => {
      const platform = communicationChannels.find(c => c.id === channel);
      return {
        platform: platform?.name || channel,
        status: 'sent' as const,
        sentAt: new Date().toISOString(),
        reach: Math.floor(Math.random() * 5000) + 500 // Simulate reach
      };
    });

    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: 'active', sentTo: updatedSentTo }
        : a
    ));

    // Simulate API delay
    setTimeout(() => {
      setIsSending(false);
      if (onAlertSent && alert) {
        onAlertSent({ ...alert, status: 'active', sentTo: updatedSentTo });
      }
    }, 2000);
  };

  const handleCancelAlert = (alertId: string) => {
    if (window.confirm('Are you sure you want to cancel this alert?')) {
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, status: 'cancelled' } : a
      ));
    }
  };

  const getAlertTypeConfig = (type: string) => {
    return alertTypes.find(t => t.id === type) || alertTypes[alertTypes.length - 1];
  };

  const getSeverityConfig = (severity: string) => {
    return severityLevels.find(s => s.id === severity) || severityLevels[1];
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const totalReach = activeAlerts.reduce((sum, alert) => 
    sum + alert.sentTo.reduce((alertSum, sent) => alertSum + (sent.reach || 0), 0), 0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Siren className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Alert System</h3>
              <p className="text-sm text-gray-600">Automated emergency notifications across all channels</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{activeAlerts.length} Active Alerts</div>
              <div className="text-xs text-gray-500">{totalReach.toLocaleString()} Total Reach</div>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <AlertTriangle size={16} />
              <span>New Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'active', label: 'Active Alerts', icon: Bell },
            { id: 'create', label: 'Create Alert', icon: Send },
            { id: 'history', label: 'Alert History', icon: Clock },
            { id: 'settings', label: 'Auto Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
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
      <div className="p-6">
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                <p className="text-gray-500">All clear! No emergency alerts are currently active.</p>
              </div>
            ) : (
              activeAlerts.map((alert) => {
                const typeConfig = getAlertTypeConfig(alert.type);
                const severityConfig = getSeverityConfig(alert.severity);
                
                return (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${typeConfig.color} text-white p-2 rounded-lg text-lg`}>
                          {typeConfig.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <span className={`${severityConfig.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                              {severityConfig.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin size={12} />
                              <span>{alert.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{formatTimeAgo(alert.issuedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users size={12} />
                              <span>{alert.sentTo.reduce((sum, sent) => sum + (sent.reach || 0), 0).toLocaleString()} reached</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelAlert(alert.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Alert"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Sent via:</span>
                        {alert.sentTo.map((sent, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {sent.platform}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        Priority: {alert.priority}/5
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Create Emergency Alert</h4>
            
            <div className="space-y-6">
              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {alertTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewAlert({ ...newAlert, type: type.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newAlert.type === type.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {severityLevels.map((severity) => (
                    <button
                      key={severity.id}
                      onClick={() => setNewAlert({ ...newAlert, severity: severity.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newAlert.severity === severity.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${severity.color} mx-auto mb-1`}></div>
                      <div className="text-xs font-medium">{severity.name}</div>
                      <div className="text-xs text-gray-500">{severity.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={newAlert.title || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief, clear title for the alert"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
                <textarea
                  value={newAlert.message || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Detailed information about the emergency, what people should do, and any important instructions"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {(newAlert.message || '').length}/280 characters
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affected Area</label>
                <input
                  type="text"
                  value={newAlert.location || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Specific location or 'Municipality-wide'"
                />
              </div>

              {/* Communication Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Channels</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {communicationChannels.map((channel) => (
                    <label key={channel.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={newAlert.channels?.includes(channel.id) || false}
                        onChange={(e) => {
                          const channels = newAlert.channels || [];
                          if (e.target.checked) {
                            setNewAlert({ ...newAlert, channels: [...channels, channel.id] });
                          } else {
                            setNewAlert({ ...newAlert, channels: channels.filter(c => c !== channel.id) });
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <channel.icon size={16} className="text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                        <div className="text-xs text-gray-500">{channel.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewAlert({ ...newAlert, priority: priority as any })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newAlert.priority === priority
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">1 = Low priority, 5 = Highest priority</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAlert}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <AlertTriangle size={16} />
                  <span>Create Alert</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Alert History</h4>
            {alerts.filter(a => a.status !== 'active').map((alert) => {
              const typeConfig = getAlertTypeConfig(alert.type);
              const severityConfig = getSeverityConfig(alert.severity);
              
              return (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${typeConfig.color} text-white p-2 rounded-lg text-sm`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-gray-900">{alert.title}</h5>
                          <span className={`${severityConfig.color} text-white text-xs px-2 py-1 rounded-full`}>
                            {severityConfig.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            alert.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                            alert.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {alert.location} • {formatTimeAgo(alert.issuedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {alert.sentTo.reduce((sum, sent) => sum + (sent.reach || 0), 0).toLocaleString()} reached
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Automated Alert Settings</h4>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="text-blue-600" size={16} />
                <span className="font-medium text-blue-900">Auto-Trigger Conditions</span>
              </div>
              <p className="text-sm text-blue-800">
                Configure conditions that automatically trigger emergency alerts based on weather data, seismic activity, and other monitoring systems.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Weather-Based Alerts</h5>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert when typhoon signal is raised</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert for heavy rainfall warnings (&gt;50mm/hour)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert for storm surge warnings</span>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Seismic Activity</h5>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert for earthquakes magnitude 5.0+</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert for tsunami warnings</span>
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Water Level Monitoring</h5>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert when river levels reach critical stage</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm">Auto-alert for flash flood conditions</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Create Emergency Alert</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Modal content would go here - same as the create tab */}
              <p className="text-gray-600">Alert creation form would be displayed here...</p>
            </div>
          </div>
        </div>
      )}

      {/* Sending Alert Loading */}
      {isSending && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sending Emergency Alert</h3>
              <p className="text-gray-600">Broadcasting to all selected channels...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlertSystem;