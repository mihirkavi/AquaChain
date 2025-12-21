import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { 
  Droplets, LogOut, LayoutDashboard, Cpu, Activity, Link2, 
  Settings, Plus, Wifi, WifiOff, Power, RefreshCw, AlertTriangle,
  TrendingUp, TrendingDown, Minus, ChevronRight, X
} from 'lucide-react';
import WaterQualityChart from '../components/WaterQualityChart';
import SensorCard from '../components/SensorCard';
import BlockchainPanel from '../components/BlockchainPanel';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [recentReadings, setRecentReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    
    const socket = io();
    
    socket.on('sensor-update', (data) => {
      setRecentReadings(prev => [data.reading, ...prev.slice(0, 9)]);
      fetchStats();
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchSensors(),
      fetchRecentReadings(),
      fetchAlerts()
    ]);
    setLoading(false);
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  async function fetchSensors() {
    try {
      const response = await fetch('/api/sensors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSensors(data);
      }
    } catch (error) {
      console.error('Failed to fetch sensors:', error);
    }
  }

  async function fetchRecentReadings() {
    try {
      const response = await fetch('/api/dashboard/recent-readings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentReadings(data);
      }
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    }
  }

  async function fetchAlerts() {
    try {
      const response = await fetch('/api/dashboard/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }

  async function toggleSensorConnection(sensorId, connect) {
    try {
      const endpoint = connect ? 'connect' : 'disconnect';
      await fetch(`/api/sensors/${sensorId}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSensors();
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle connection:', error);
    }
  }

  async function togglePurifier(sensorId, active) {
    try {
      await fetch(`/api/sensors/${sensorId}/purifier`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      });
      fetchSensors();
    } catch (error) {
      console.error('Failed to toggle purifier:', error);
    }
  }

  async function addSensor(sensorData) {
    try {
      await fetch('/api/sensors', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sensorData)
      });
      setShowAddSensor(false);
      fetchSensors();
      fetchStats();
    } catch (error) {
      console.error('Failed to add sensor:', error);
    }
  }

  function getQualityColor(score) {
    if (score >= 80) return 'quality-excellent';
    if (score >= 60) return 'quality-good';
    if (score >= 40) return 'quality-fair';
    return 'quality-poor';
  }

  function getQualityLabel(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Droplets size={28} />
            <span>AquaChain</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'sensors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sensors')}
          >
            <Cpu size={20} />
            <span>Sensors</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'readings' ? 'active' : ''}`}
            onClick={() => setActiveTab('readings')}
          >
            <Activity size={20} />
            <span>Readings</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            <Link2 size={20} />
            <span>Blockchain</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role === 'business' ? 'Business' : 'Household'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'sensors' && 'Sensor Management'}
              {activeTab === 'readings' && 'Water Quality Readings'}
              {activeTab === 'blockchain' && 'Blockchain Records'}
            </h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={fetchData}>
              <RefreshCw size={18} />
              Refresh
            </button>
            {activeTab === 'sensors' && (
              <button className="btn btn-primary" onClick={() => setShowAddSensor(true)}>
                <Plus size={18} />
                Add Sensor
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon sensors">
                      <Cpu size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.totalSensors || 0}</span>
                      <span className="stat-label">Total Sensors</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon active">
                      <Wifi size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.activeSensors || 0}</span>
                      <span className="stat-label">Active Sensors</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon readings">
                      <Activity size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.readingsToday || 0}</span>
                      <span className="stat-label">Readings Today</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className={`stat-icon quality ${getQualityColor(stats?.averageQuality)}`}>
                      <Droplets size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.averageQuality || 0}%</span>
                      <span className="stat-label">Avg Quality</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon blockchain">
                      <Link2 size={24} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.blockchainRecords || 0}</span>
                      <span className="stat-label">On-Chain Records</span>
                    </div>
                  </div>
                </div>

                {alerts.length > 0 && (
                  <div className="alerts-panel">
                    <h3><AlertTriangle size={20} /> Water Quality Alerts</h3>
                    <div className="alerts-list">
                      {alerts.slice(0, 3).map((alert, index) => (
                        <div key={index} className="alert-item">
                          <div className="alert-icon">
                            <AlertTriangle size={16} />
                          </div>
                          <div className="alert-content">
                            <strong>{alert.sensor_name}</strong>
                            <span>Quality score: {alert.water_quality_score}% - {alert.location}</span>
                          </div>
                          <span className="alert-time">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="dashboard-grid">
                  <div className="chart-panel">
                    <h3>Water Quality Trend (24h)</h3>
                    <WaterQualityChart token={token} />
                  </div>
                  
                  <div className="readings-panel">
                    <h3>Recent Readings</h3>
                    <div className="readings-list">
                      {recentReadings.slice(0, 5).map((reading, index) => (
                        <div key={index} className="reading-item">
                          <div className="reading-info">
                            <span className="reading-sensor">{reading.sensor_name}</span>
                            <span className="reading-time">
                              {new Date(reading.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="reading-metrics">
                            <span className={`quality-badge ${getQualityColor(reading.water_quality_score)}`}>
                              {reading.water_quality_score}%
                            </span>
                            {reading.tx_hash && (
                              <span className="blockchain-badge">
                                <Link2 size={12} /> On-chain
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sensors-overview">
                  <h3>Your Sensors</h3>
                  <div className="sensors-mini-grid">
                    {sensors.map(sensor => (
                      <div key={sensor.id} className="sensor-mini-card" onClick={() => {
                        setSelectedSensor(sensor);
                        setActiveTab('sensors');
                      }}>
                        <div className="sensor-status">
                          {sensor.wifi_connected ? (
                            <Wifi size={16} className="connected" />
                          ) : (
                            <WifiOff size={16} className="disconnected" />
                          )}
                        </div>
                        <h4>{sensor.name}</h4>
                        <p>{sensor.location}</p>
                        <div className="sensor-badges">
                          <span className={`type-badge ${sensor.sensor_type}`}>
                            {sensor.sensor_type}
                          </span>
                          {sensor.purifier_active && (
                            <span className="purifier-badge">Purifier On</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sensors' && (
              <div className="sensors-content">
                <div className="sensors-grid">
                  {sensors.map(sensor => (
                    <SensorCard 
                      key={sensor.id}
                      sensor={sensor}
                      token={token}
                      onToggleConnection={toggleSensorConnection}
                      onTogglePurifier={togglePurifier}
                      onSelect={() => setSelectedSensor(sensor)}
                    />
                  ))}
                </div>
                
                {sensors.length === 0 && (
                  <div className="empty-state">
                    <Cpu size={48} />
                    <h3>No Sensors Yet</h3>
                    <p>Add your first sensor to start monitoring water quality</p>
                    <button className="btn btn-primary" onClick={() => setShowAddSensor(true)}>
                      <Plus size={18} />
                      Add Sensor
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'readings' && (
              <div className="readings-content">
                <div className="readings-table-container">
                  <table className="readings-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Sensor</th>
                        <th>pH</th>
                        <th>TDS (ppm)</th>
                        <th>Turbidity</th>
                        <th>Temp (°C)</th>
                        <th>Quality</th>
                        <th>Blockchain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReadings.map((reading, index) => (
                        <tr key={index}>
                          <td>{new Date(reading.timestamp).toLocaleString()}</td>
                          <td>{reading.sensor_name}</td>
                          <td>{reading.ph}</td>
                          <td>{reading.tds}</td>
                          <td>{reading.turbidity}</td>
                          <td>{reading.temperature}</td>
                          <td>
                            <span className={`quality-badge ${getQualityColor(reading.water_quality_score)}`}>
                              {reading.water_quality_score}%
                            </span>
                          </td>
                          <td>
                            {reading.tx_hash ? (
                              <span className="tx-hash" title={reading.tx_hash}>
                                {reading.tx_hash.slice(0, 10)}...
                              </span>
                            ) : (
                              <span className="pending">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'blockchain' && (
              <BlockchainPanel token={token} />
            )}
          </>
        )}
      </main>

      {showAddSensor && (
        <AddSensorModal 
          onClose={() => setShowAddSensor(false)}
          onAdd={addSensor}
          userRole={user?.role}
        />
      )}
    </div>
  );
}

function AddSensorModal({ onClose, onAdd, userRole }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    sensorType: userRole === 'business' ? 'commercial' : 'residential'
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(formData);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Sensor</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Sensor Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Kitchen Sensor"
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Building A - Floor 2"
              required
            />
          </div>
          <div className="form-group">
            <label>Sensor Type</label>
            <select
              value={formData.sensorType}
              onChange={(e) => setFormData({ ...formData, sensorType: e.target.value })}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Sensor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
