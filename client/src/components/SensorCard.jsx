import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Power, Droplets, Thermometer, Activity, Link2 } from 'lucide-react';

export default function SensorCard({ sensor, token, onToggleConnection, onTogglePurifier }) {
  const [latestReading, setLatestReading] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sensor.wifi_connected) {
      fetchLatestReading();
    }
  }, [sensor.id, sensor.wifi_connected]);

  async function fetchLatestReading() {
    try {
      const response = await fetch(`/api/readings/latest/${sensor.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLatestReading(data);
      }
    } catch (error) {
      console.error('Failed to fetch reading:', error);
    }
  }

  function getQualityColor(score) {
    if (!score) return '';
    if (score >= 80) return 'quality-excellent';
    if (score >= 60) return 'quality-good';
    if (score >= 40) return 'quality-fair';
    return 'quality-poor';
  }

  async function handleToggleConnection() {
    setLoading(true);
    await onToggleConnection(sensor.id, !sensor.wifi_connected);
    setLoading(false);
  }

  async function handleTogglePurifier() {
    setLoading(true);
    await onTogglePurifier(sensor.id, !sensor.purifier_active);
    setLoading(false);
  }

  return (
    <div className={`sensor-card ${sensor.wifi_connected ? 'connected' : 'disconnected'}`}>
      <div className="sensor-header">
        <div className="sensor-status-indicator">
          {sensor.wifi_connected ? (
            <Wifi size={20} className="status-icon connected" />
          ) : (
            <WifiOff size={20} className="status-icon disconnected" />
          )}
        </div>
        <div className="sensor-title">
          <h3>{sensor.name}</h3>
          <span className="sensor-location">{sensor.location}</span>
        </div>
        <span className={`sensor-type-badge ${sensor.sensor_type}`}>
          {sensor.sensor_type}
        </span>
      </div>

      {sensor.wifi_connected && latestReading && (
        <div className="sensor-readings">
          <div className="reading-grid">
            <div className="reading-item">
              <div className="reading-icon">
                <Droplets size={16} />
              </div>
              <div className="reading-data">
                <span className="reading-value">{latestReading.ph}</span>
                <span className="reading-label">pH</span>
              </div>
            </div>
            <div className="reading-item">
              <div className="reading-icon">
                <Activity size={16} />
              </div>
              <div className="reading-data">
                <span className="reading-value">{latestReading.tds}</span>
                <span className="reading-label">TDS (ppm)</span>
              </div>
            </div>
            <div className="reading-item">
              <div className="reading-icon">
                <Thermometer size={16} />
              </div>
              <div className="reading-data">
                <span className="reading-value">{latestReading.temperature}°C</span>
                <span className="reading-label">Temp</span>
              </div>
            </div>
          </div>
          
          <div className="quality-display">
            <div className={`quality-score ${getQualityColor(latestReading.water_quality_score)}`}>
              <span className="score-value">{latestReading.water_quality_score}%</span>
              <span className="score-label">Quality Score</span>
            </div>
            {latestReading.tx_hash && (
              <div className="blockchain-status">
                <Link2 size={14} />
                <span>Verified on-chain</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!sensor.wifi_connected && (
        <div className="sensor-offline">
          <WifiOff size={32} />
          <p>Sensor is offline</p>
          <span>Connect to start monitoring</span>
        </div>
      )}

      <div className="sensor-controls">
        <button
          className={`control-btn ${sensor.wifi_connected ? 'active' : ''}`}
          onClick={handleToggleConnection}
          disabled={loading}
        >
          {sensor.wifi_connected ? <Wifi size={18} /> : <WifiOff size={18} />}
          {sensor.wifi_connected ? 'Connected' : 'Connect'}
        </button>
        
        <button
          className={`control-btn purifier ${sensor.purifier_active ? 'active' : ''}`}
          onClick={handleTogglePurifier}
          disabled={loading || !sensor.wifi_connected}
        >
          <Power size={18} />
          {sensor.purifier_active ? 'Purifier On' : 'Purifier Off'}
        </button>
      </div>

      {sensor.last_reading_at && (
        <div className="sensor-footer">
          <span>Last reading: {new Date(sensor.last_reading_at).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
