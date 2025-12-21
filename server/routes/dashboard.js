import express from 'express';
import { query } from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const sensorCount = await query(
      'SELECT COUNT(*) as count FROM sensors WHERE user_id = $1',
      [req.user.id]
    );
    
    const activeSensors = await query(
      'SELECT COUNT(*) as count FROM sensors WHERE user_id = $1 AND wifi_connected = true',
      [req.user.id]
    );
    
    const readingsToday = await query(
      `SELECT COUNT(*) as count FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND r.timestamp > CURRENT_DATE`,
      [req.user.id]
    );
    
    const avgQuality = await query(
      `SELECT AVG(r.water_quality_score) as avg FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND r.timestamp > NOW() - INTERVAL '24 hours'`,
      [req.user.id]
    );
    
    const blockchainRecords = await query(
      `SELECT COUNT(*) as count FROM blockchain_transactions bt
       JOIN readings r ON bt.reading_id = r.id
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND bt.status = 'confirmed'`,
      [req.user.id]
    );
    
    res.json({
      totalSensors: parseInt(sensorCount.rows[0].count),
      activeSensors: parseInt(activeSensors.rows[0].count),
      readingsToday: parseInt(readingsToday.rows[0].count),
      averageQuality: Math.round(parseFloat(avgQuality.rows[0].avg) || 0),
      blockchainRecords: parseInt(blockchainRecords.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

router.get('/recent-readings', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, s.name as sensor_name, s.location, bt.tx_hash
       FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       LEFT JOIN blockchain_transactions bt ON r.id = bt.reading_id
       WHERE s.user_id = $1
       ORDER BY r.timestamp DESC
       LIMIT 10`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent readings' });
  }
});

router.get('/quality-trend', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT DATE_TRUNC('hour', r.timestamp) as hour,
              AVG(r.water_quality_score) as avg_quality,
              AVG(r.ph) as avg_ph,
              AVG(r.tds) as avg_tds
       FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND r.timestamp > NOW() - INTERVAL '24 hours'
       GROUP BY DATE_TRUNC('hour', r.timestamp)
       ORDER BY hour ASC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quality trend' });
  }
});

router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, s.name as sensor_name, s.location
       FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 
         AND r.timestamp > NOW() - INTERVAL '24 hours'
         AND (r.water_quality_score < 50 OR r.ph < 6.5 OR r.ph > 8.5 OR r.tds > 500)
       ORDER BY r.timestamp DESC
       LIMIT 10`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
