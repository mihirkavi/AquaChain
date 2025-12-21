import { query } from '../models/database.js';

function generateReading(purifierActive) {
  const baseQuality = purifierActive ? 85 : 65;
  const qualityVariation = Math.random() * 20 - 10;
  
  return {
    ph: (7 + (Math.random() * 1.5 - 0.75)).toFixed(2),
    tds: Math.floor(150 + Math.random() * 200),
    turbidity: (0.5 + Math.random() * 3).toFixed(2),
    temperature: (20 + Math.random() * 8).toFixed(1),
    chlorine: (0.2 + Math.random() * 0.6).toFixed(2),
    waterQualityScore: Math.max(0, Math.min(100, Math.floor(baseQuality + qualityVariation))),
    purificationStatus: purifierActive ? 'active' : 'inactive'
  };
}

function generateMockTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export async function startSensorSimulation(io) {
  console.log('Starting sensor simulation...');
  
  setInterval(async () => {
    try {
      const sensorsResult = await query(
        'SELECT * FROM sensors WHERE wifi_connected = true'
      );
      
      for (const sensor of sensorsResult.rows) {
        const reading = generateReading(sensor.purifier_active);
        
        const readingResult = await query(
          `INSERT INTO readings (sensor_id, ph, tds, turbidity, temperature, chlorine, water_quality_score, purification_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [sensor.id, reading.ph, reading.tds, reading.turbidity, reading.temperature, reading.chlorine, reading.waterQualityScore, reading.purificationStatus]
        );
        
        const newReading = readingResult.rows[0];
        
        await query(
          'UPDATE sensors SET last_reading_at = CURRENT_TIMESTAMP WHERE id = $1',
          [sensor.id]
        );
        
        if (Math.random() > 0.3) {
          const txHash = generateMockTxHash();
          const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
          
          await query(
            `INSERT INTO blockchain_transactions (reading_id, tx_hash, block_number, network, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [newReading.id, txHash, blockNumber, 'sepolia', 'confirmed']
          );
          
          newReading.tx_hash = txHash;
          newReading.blockchain_status = 'confirmed';
        }
        
        io.to(`sensor-${sensor.id}`).emit('new-reading', {
          sensorId: sensor.id,
          reading: newReading
        });
        
        io.emit('sensor-update', {
          sensorId: sensor.id,
          reading: newReading
        });
      }
    } catch (error) {
      console.error('Sensor simulation error:', error);
    }
  }, 10000);
}
