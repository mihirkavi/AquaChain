import express from 'express';
import { query } from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/sensor/:sensorId', authenticateToken, async (req, res) => {
  try {
    const sensorCheck = await query(
      'SELECT id FROM sensors WHERE id = $1 AND user_id = $2',
      [req.params.sensorId, req.user.id]
    );
    
    if (sensorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    const limit = parseInt(req.query.limit) || 50;
    const result = await query(
      'SELECT r.*, bt.tx_hash, bt.status as blockchain_status FROM readings r LEFT JOIN blockchain_transactions bt ON r.id = bt.reading_id WHERE r.sensor_id = $1 ORDER BY r.timestamp DESC LIMIT $2',
      [req.params.sensorId, limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

router.get('/latest/:sensorId', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, bt.tx_hash, bt.status as blockchain_status 
       FROM readings r 
       LEFT JOIN blockchain_transactions bt ON r.id = bt.reading_id 
       WHERE r.sensor_id = $1 
       ORDER BY r.timestamp DESC 
       LIMIT 1`,
      [req.params.sensorId]
    );
    
    if (result.rows.length === 0) {
      return res.json(null);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest reading' });
  }
});

router.get('/history/:sensorId', authenticateToken, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const result = await query(
      `SELECT * FROM readings 
       WHERE sensor_id = $1 AND timestamp > NOW() - INTERVAL '${hours} hours'
       ORDER BY timestamp ASC`,
      [req.params.sensorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading history' });
  }
});

export default router;
