import express from 'express';
import { query } from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sensors WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sensors WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, location, sensorType } = req.body;
    
    const result = await query(
      'INSERT INTO sensors (user_id, name, location, sensor_type, wifi_connected, purifier_active) VALUES ($1, $2, $3, $4, false, false) RETURNING *',
      [req.user.id, name, location, sensorType || 'residential']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sensor' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, location, sensorType, wifiConnected, purifierActive } = req.body;
    
    const result = await query(
      'UPDATE sensors SET name = $1, location = $2, sensor_type = $3, wifi_connected = $4, purifier_active = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [name, location, sensorType, wifiConnected, purifierActive, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sensor' });
  }
});

router.patch('/:id/connect', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'UPDATE sensors SET wifi_connected = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect sensor' });
  }
});

router.patch('/:id/disconnect', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'UPDATE sensors SET wifi_connected = false WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect sensor' });
  }
});

router.patch('/:id/purifier', authenticateToken, async (req, res) => {
  try {
    const { active } = req.body;
    
    const result = await query(
      'UPDATE sensors SET purifier_active = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [active, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle purifier' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM sensors WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sensor' });
  }
});

export default router;
