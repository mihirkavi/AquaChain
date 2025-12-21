import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function WaterQualityChart({ token }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchTrendData();
  }, []);

  async function fetchTrendData() {
    try {
      const response = await fetch('/api/dashboard/quality-trend', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.length === 0) {
          setChartData(generateMockData());
          return;
        }
        
        setChartData({
          labels: data.map(d => new Date(d.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
          datasets: [
            {
              label: 'Water Quality Score',
              data: data.map(d => parseFloat(d.avg_quality)),
              borderColor: '#0066cc',
              backgroundColor: 'rgba(0, 102, 204, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'pH Level',
              data: data.map(d => parseFloat(d.avg_ph) * 10),
              borderColor: '#00b8d4',
              backgroundColor: 'transparent',
              tension: 0.4
            }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch trend data:', error);
      setChartData(generateMockData());
    }
  }

  function generateMockData() {
    const hours = [];
    const qualityData = [];
    const phData = [];
    
    for (let i = 23; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      hours.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      qualityData.push(70 + Math.random() * 25);
      phData.push(70 + Math.random() * 10);
    }
    
    return {
      labels: hours,
      datasets: [
        {
          label: 'Water Quality Score',
          data: qualityData,
          borderColor: '#0066cc',
          backgroundColor: 'rgba(0, 102, 204, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'pH Level (x10)',
          data: phData,
          borderColor: '#00b8d4',
          backgroundColor: 'transparent',
          tension: 0.4
        }
      ]
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  if (!chartData) {
    return <div className="chart-loading">Loading chart...</div>;
  }

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}
