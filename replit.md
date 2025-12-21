# AquaChain - Smart Water Management Platform

## Overview
AquaChain is a comprehensive blockchain-powered water quality monitoring platform. It allows users to:
- Connect smart sensors that monitor water quality in real-time
- View live dashboards with pH, TDS, turbidity, temperature, and quality scores
- Record water quality data on the Ethereum blockchain for transparent verification
- Control built-in water purification systems remotely
- Support both household and business users with role-based access

## Tech Stack
- **Frontend**: React 18 + Vite, Chart.js, Socket.IO Client, Lucide Icons
- **Backend**: Node.js + Express, Socket.IO for real-time updates
- **Database**: PostgreSQL (Neon-backed)
- **Blockchain**: Ethereum (Sepolia testnet) simulation with ethers.js
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure
```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── server/                 # Express backend
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── sensors.js      # Sensor CRUD
│   │   ├── readings.js     # Water quality readings
│   │   ├── blockchain.js   # Blockchain transactions
│   │   └── dashboard.js    # Dashboard stats
│   ├── models/             # Database models
│   ├── middleware/         # Auth middleware
│   └── utils/              # Sensor simulation
└── package.json            # Root package config
```

## Database Schema
- **users**: User accounts with role (household/business)
- **sensors**: IoT sensor devices linked to users
- **readings**: Water quality measurements from sensors
- **blockchain_transactions**: Ethereum transaction records

## Key Features
1. **User Authentication**: Sign up/login with role selection (Household/Business)
2. **Sensor Management**: Add, configure, connect/disconnect sensors
3. **Real-time Monitoring**: Live updates every 10 seconds via WebSocket
4. **Purifier Control**: Remote on/off for built-in purification
5. **Blockchain Recording**: Water quality data stored on Ethereum
6. **Analytics Dashboard**: Charts and trends visualization

## Running the Project
The app runs with concurrent frontend (port 5000) and backend (port 5001):
```bash
npm run dev
```

## Demo Account
- Email: demo@aquachain.com
- Password: demo123

## Recent Changes
- December 21, 2025: Complete rebuild with React + Express architecture
- Added user authentication with JWT
- Implemented sensor simulation with real-time updates
- Created blockchain transaction recording system
- Built comprehensive dashboard with charts
