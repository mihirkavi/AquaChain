import { useState, useEffect } from 'react';
import { Link2, ExternalLink, CheckCircle, Clock, Hash, Blocks } from 'lucide-react';

export default function BlockchainPanel({ token }) {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  async function fetchBlockchainData() {
    setLoading(true);
    try {
      const [statsRes, txRes] = await Promise.all([
        fetch('/api/blockchain/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/blockchain/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading blockchain data...</p>
      </div>
    );
  }

  return (
    <div className="blockchain-content">
      <div className="blockchain-header">
        <div className="blockchain-info">
          <div className="chain-badge">
            <Blocks size={20} />
            <span>Ethereum Sepolia Testnet</span>
          </div>
          <p>All water quality readings are permanently recorded on the Ethereum blockchain for transparency and verification.</p>
        </div>
      </div>

      <div className="blockchain-stats">
        <div className="blockchain-stat-card">
          <div className="stat-icon">
            <Link2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalTransactions || 0}</span>
            <span className="stat-label">Total Transactions</span>
          </div>
        </div>
        <div className="blockchain-stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">100%</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
        <div className="blockchain-stat-card">
          <div className="stat-icon">
            <Hash size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.network || 'Sepolia'}</span>
            <span className="stat-label">Network</span>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Recent Blockchain Transactions</h3>
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Block</th>
                <th>Sensor</th>
                <th>Quality Score</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>
                    <div className="tx-hash-cell">
                      <Hash size={14} />
                      <span className="tx-hash">{tx.tx_hash?.slice(0, 18)}...</span>
                      <button 
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(tx.tx_hash)}
                        title="Copy full hash"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td>#{tx.block_number}</td>
                  <td>{tx.sensor_name}</td>
                  <td>
                    <span className={`quality-badge ${getQualityColor(tx.water_quality_score)}`}>
                      {tx.water_quality_score}%
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${tx.status}`}>
                      {tx.status === 'confirmed' ? (
                        <><CheckCircle size={12} /> Confirmed</>
                      ) : (
                        <><Clock size={12} /> Pending</>
                      )}
                    </span>
                  </td>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="empty-transactions">
            <Link2 size={48} />
            <h4>No Transactions Yet</h4>
            <p>When your sensors record water quality data, it will be stored on the blockchain here.</p>
          </div>
        )}
      </div>

      <div className="blockchain-explainer">
        <h3>How It Works</h3>
        <div className="explainer-grid">
          <div className="explainer-step">
            <div className="step-number">1</div>
            <h4>Sensor Reading</h4>
            <p>Your WiFi-connected sensor measures water quality parameters every 10 seconds.</p>
          </div>
          <div className="explainer-step">
            <div className="step-number">2</div>
            <h4>Data Transmission</h4>
            <p>Readings are securely transmitted to AquaChain servers via encrypted connection.</p>
          </div>
          <div className="explainer-step">
            <div className="step-number">3</div>
            <h4>Blockchain Recording</h4>
            <p>Data is hashed and recorded on Ethereum using our smart contract.</p>
          </div>
          <div className="explainer-step">
            <div className="step-number">4</div>
            <h4>Permanent Verification</h4>
            <p>Transaction hash serves as immutable proof of water quality at that moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getQualityColor(score) {
  if (!score) return '';
  if (score >= 80) return 'quality-excellent';
  if (score >= 60) return 'quality-good';
  if (score >= 40) return 'quality-fair';
  return 'quality-poor';
}
