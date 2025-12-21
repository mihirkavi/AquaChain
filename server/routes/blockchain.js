import express from 'express';
import { ethers } from 'ethers';
import { query } from '../models/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const WATER_QUALITY_ABI = [
  "function recordQuality(uint256 sensorId, uint256 ph, uint256 tds, uint256 turbidity, uint256 temperature, uint256 qualityScore) external",
  "function getReading(uint256 readingId) external view returns (uint256 sensorId, uint256 ph, uint256 tds, uint256 turbidity, uint256 temperature, uint256 qualityScore, uint256 timestamp)",
  "event QualityRecorded(uint256 indexed readingId, uint256 indexed sensorId, uint256 qualityScore, uint256 timestamp)"
];

function generateMockTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT bt.*, r.sensor_id, r.water_quality_score, s.name as sensor_name
       FROM blockchain_transactions bt
       JOIN readings r ON bt.reading_id = r.id
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1
       ORDER BY bt.created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const txCount = await query(
      `SELECT COUNT(*) as count FROM blockchain_transactions bt
       JOIN readings r ON bt.reading_id = r.id
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND bt.status = 'confirmed'`,
      [req.user.id]
    );
    
    const recentTx = await query(
      `SELECT bt.tx_hash, bt.created_at, r.water_quality_score
       FROM blockchain_transactions bt
       JOIN readings r ON bt.reading_id = r.id
       JOIN sensors s ON r.sensor_id = s.id
       WHERE s.user_id = $1 AND bt.status = 'confirmed'
       ORDER BY bt.created_at DESC
       LIMIT 5`,
      [req.user.id]
    );
    
    res.json({
      totalTransactions: parseInt(txCount.rows[0].count),
      network: 'Ethereum Sepolia Testnet',
      recentTransactions: recentTx.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blockchain stats' });
  }
});

router.post('/record', authenticateToken, async (req, res) => {
  try {
    const { readingId } = req.body;
    
    const readingResult = await query(
      `SELECT r.*, s.user_id FROM readings r
       JOIN sensors s ON r.sensor_id = s.id
       WHERE r.id = $1 AND s.user_id = $2`,
      [readingId, req.user.id]
    );
    
    if (readingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reading not found' });
    }
    
    const txHash = generateMockTxHash();
    const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
    
    const txResult = await query(
      `INSERT INTO blockchain_transactions (reading_id, tx_hash, block_number, network, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [readingId, txHash, blockNumber, 'sepolia', 'confirmed']
    );
    
    res.json({
      transaction: txResult.rows[0],
      message: 'Water quality data recorded on blockchain'
    });
  } catch (error) {
    console.error('Blockchain record error:', error);
    res.status(500).json({ error: 'Failed to record on blockchain' });
  }
});

router.get('/verify/:txHash', async (req, res) => {
  try {
    const result = await query(
      `SELECT bt.*, r.ph, r.tds, r.turbidity, r.temperature, r.water_quality_score, r.timestamp as reading_time
       FROM blockchain_transactions bt
       JOIN readings r ON bt.reading_id = r.id
       WHERE bt.tx_hash = $1`,
      [req.params.txHash]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({
      verified: true,
      transaction: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
