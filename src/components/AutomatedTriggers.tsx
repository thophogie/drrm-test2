import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Bell,
  Clock,
  TrendingUp
} from 'lucide-react';

interface TriggerCondition {
  id: string;
  name: string;
  type: 'weather' | 'seismic' | 'water' | 'air' | 'manual';
  parameter: string;
  operator: '>' | '<' | '=' | '>=' | '<=';
  threshold: number;
  unit: string;
  isActive: boolean;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastTriggered?: string;
  triggerCount: number;
}

interface SensorData {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: string;
  location: string;
}

const AutomatedTriggers: React.FC = () => {
  const [triggers, setTriggers] = useState<TriggerCondition[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isAddingTrigger, setIsAddingTrigger] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<TriggerCondition>>({
    type: 'weather',
    operator: '>',
    severity: 'medium',
    isActive: true
  });

  // Sample trigger conditions
  useEffect(() => {
    const sampleTriggers: TriggerCondition[] = [
      {
        id: '1',
        name: 'Heavy Rainfall Alert',
        type: 'weather',
        parameter: 'rainfall',
        operator: '>',
        threshold: 50,
        unit: 'mm/hour',
        isActive: true,
        alertType: 'flood',
        severity: 'high',
        lastTriggered: '2025-01-20T14:30:00Z',
        triggerCount: 3
      },
      {
        id: '2',
        name: 'Strong Wind Warning',
        type: 'weather',
        parameter: 'wind_speed',
        operator: '>=',
        threshold: 60,
        unit: 'km/h',
        isActive: true,
        alertType: 'typhoon',
        severity: 'high',
        triggerCount: 1
      },
      {
        id: '3',
        name: 'Earthquake Detection',
        type: 'seismic',
        parameter: 'magnitude',
        operator: '>=',
        threshold: 5.0,
        unit: 'Richter',
        isActive: true,
        alertType: 'earthquake',
        severity: 'critical',
        triggerCount: 0
      },
      {
        id: '4',
        name: 'River Level Critical',
        type: 'water',
        parameter: 'water_level',
        operator: '>',
        threshold: 8.5,
        unit: 'meters',
        isActive: true,
        alertType: 'flood',
        severity: 'critical',
        triggerCount: 2
      },
      {
        id: '5',
        name: 'High Temperature Alert',
        type: 'weather',
        parameter: 'temperature',
        operator: '>',
        threshold: 35,
        unit: '°C',
        isActive: false,
        alertType: 'heat',
        severity: 'medium',
        triggerCount: 5
      }
    ];
    setTriggers(sampleTriggers);

    // Sample sensor data
    const sampleSensors: SensorData[] = [
      {
        id: '1',
        name: 'Rainfall Gauge - Station 1',
        type: 'rainfall',
        currentValue: 25.4,
        unit: 'mm/hour',
        status: 'normal',
        lastUpdate: new Date().toISOString(),
        location: 'Barangay Centro'
      },
      {
        id: '2',
        name: 'Wind Speed Monitor',
        type: 'wind_speed',
        currentValue: 45.2,
        unit: 'km/h',
        status: 'warning',
        lastUpdate: new Date().toISOString(),
        location: 'Municipal Hall'
      },
      {
        id: '3',
        name: 'River Level Sensor',
        type: 'water_level',
        currentValue: 6.8,
        unit: 'meters',
        status: 'normal',
        lastUpdate: new Date().toISOString(),
        location: 'Pio Duran River'
      },
      {
        id: '4',
        name: 'Temperature Sensor',
        type: 'temperature',
        currentValue: 32.1,
        unit: '°C',
        status: 'normal',
        lastUpdate: new Date().toISOString(),
        location: 'Weather Station'
      },
      {
        id: '5',
        name: 'Seismometer',
        type: 'magnitude',
        currentValue: 2.1,
        unit: 'Richter',
        status: 'normal',
        lastUpdate: new Date().toISOString(),
        location: 'PHIVOLCS Station'
      }
    ];
    setSensorData(sampleSensors);
  }, []);

  const triggerTypes = [
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'text-blue-600' },
    { id: 'seismic', name: 'Seismic', icon: Activity, color: 'text-red-600' },
    { id: 'water', name: 'Water Level', icon: Droplets, color: 'text-cyan-600' },
    { id: 'air', name: 'Air Quality', icon: Wind, color: 'text-green-600' }
  ];

  const parameters = {
    weather: [
      { id: 'rainfall', name: 'Rainfall', unit: 'mm/hour' },
      { id: 'wind_speed', name: 'Wind Speed', unit: 'km/h' },
      { id: 'temperature', name: 'Temperature', unit: '°C' },
      { id: 'humidity', name: 'Humidity', unit: '%' },
      { id: 'pressure', name: 'Atmospheric Pressure', unit: 'hPa' }
    ],
    seismic: [
      { id: 'magnitude', name: 'Earthquake Magnitude', unit: 'Richter' },
      { id: 'intensity', name: 'Intensity', unit: 'PEIS' }
    ],
    water: [
      { id: 'water_level', name: 'Water Level', unit: 'meters' },
      { id: 'flow_rate', name: 'Flow Rate', unit: 'm³/s' }
    ],
    air: [
      { id: 'pm25', name: 'PM2.5', unit: 'μg/m³' },
      { id: 'pm10', name: 'PM10', unit: 'μg/m³' },
      { id: 'aqi', name: 'Air Quality Index', unit: 'AQI' }
    ]
  };

  const handleToggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(trigger => 
      trigger.id === id ? { ...trigger, isActive: !trigger.isActive } : trigger
    ));
  };

  const handleDeleteTrigger = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trigger?')) {
      setTriggers(prev => prev.filter(trigger => trigger.id !== id));
    }
  };

  const handleAddTrigger = () => {
    if (!newTrigger.name || !newTrigger.parameter || !newTrigger.threshold) {
      alert('Please fill in all required fields');
      return;
    }

    const trigger: TriggerCondition = {
      id: Date.now().toString(),
      name: newTrigger.name,
      type: newTrigger.type as any,
      parameter: newTrigger.parameter,
      operator: newTrigger.operator as any,
      threshold: newTrigger.threshold,
      unit: newTrigger.unit || '',
      isActive: newTrigger.isActive || true,
      alertType: newTrigger.alertType || 'general',
      severity: newTrigger.severity as any,
      triggerCount: 0
    };

    setTriggers(prev => [trigger, ...prev]);
    setNewTrigger({
      type: 'weather',
      operator: '>',
      severity: 'medium',
      isActive: true
    });
    setIsAddingTrigger(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'critical':
        return <AlertTriangle className="text-red-500" size={16} />;
      default:
        return <CheckCircle className="text-gray-500" size={16} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const activeTriggers = triggers.filter(t => t.isActive);
  const criticalSensors = sensorData.filter(s => s.status === 'critical');
  const warningSensors = sensorData.filter(s => s.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Triggers</p>
              <p className="text-3xl font-bold text-gray-900">{activeTriggers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sensors Online</p>
              <p className="text-3xl font-bold text-gray-900">{sensorData.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-3xl font-bold text-gray-900">{warningSensors.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{criticalSensors.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Sensor Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Sensor Data</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensorData.map((sensor) => (
              <div key={sensor.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{sensor.name}</h4>
                  {getStatusIcon(sensor.status)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {sensor.currentValue} {sensor.unit}
                </div>
                <div className="text-sm text-gray-600 mb-2">{sensor.location}</div>
                <div className="text-xs text-gray-500">
                  Updated {formatTimeAgo(sensor.lastUpdate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trigger Conditions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Automated Trigger Conditions</h3>
            <button
              onClick={() => setIsAddingTrigger(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Zap size={16} />
              <span>Add Trigger</span>
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {triggers.map((trigger) => {
            const typeConfig = triggerTypes.find(t => t.id === trigger.type);
            const TypeIcon = typeConfig?.icon || Settings;
            
            return (
              <div key={trigger.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${trigger.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <TypeIcon className={`h-5 w-5 ${trigger.isActive ? typeConfig?.color : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{trigger.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(trigger.severity)}`}>
                          {trigger.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trigger.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trigger.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Trigger when {trigger.parameter} {trigger.operator} {trigger.threshold} {trigger.unit}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Triggered {trigger.triggerCount} times</span>
                        {trigger.lastTriggered && (
                          <span>Last: {formatTimeAgo(trigger.lastTriggered)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleTrigger(trigger.id)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        trigger.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {trigger.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeleteTrigger(trigger.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Trigger Modal */}
      {isAddingTrigger && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add Automated Trigger</h3>
                <button
                  onClick={() => setIsAddingTrigger(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Name</label>
                <input
                  type="text"
                  value={newTrigger.name || ''}
                  onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descriptive name for this trigger"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newTrigger.type}
                    onChange={(e) => setNewTrigger({ ...newTrigger, type: e.target.value as any, parameter: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {triggerTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parameter</label>
                  <select
                    value={newTrigger.parameter || ''}
                    onChange={(e) => {
                      const param = parameters[newTrigger.type as keyof typeof parameters]?.find(p => p.id === e.target.value);
                      setNewTrigger({ ...newTrigger, parameter: e.target.value, unit: param?.unit || '' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select parameter</option>
                    {parameters[newTrigger.type as keyof typeof parameters]?.map((param) => (
                      <option key={param.id} value={param.id}>{param.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                  <select
                    value={newTrigger.operator}
                    onChange={(e) => setNewTrigger({ ...newTrigger, operator: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value="=">=</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTrigger.threshold || ''}
                    onChange={(e) => setNewTrigger({ ...newTrigger, threshold: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newTrigger.unit || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                  <select
                    value={newTrigger.alertType || ''}
                    onChange={(e) => setNewTrigger({ ...newTrigger, alertType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">General Alert</option>
                    <option value="typhoon">Typhoon</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="landslide">Landslide</option>
                    <option value="tsunami">Tsunami</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={newTrigger.severity}
                    onChange={(e) => setNewTrigger({ ...newTrigger, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsAddingTrigger(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTrigger}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Zap size={16} />
                  <span>Add Trigger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedTriggers;