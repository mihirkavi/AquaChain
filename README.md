# AquaChain

AquaChain is a water-quality monitoring prototype that explores how sensor dashboards and traceable records could make clean-water operations easier to understand.

## Current implementation

- A React and Vite frontend with a landing page, sign-in, sensor dashboards, and reading charts.
- An Express API with PostgreSQL storage and Socket.IO updates.
- Simulated sensor readings and demonstration blockchain transaction records.
- Venture planning, product-development, and commercialization documents.

## Run locally

Install Node.js and provision a local PostgreSQL database, then install both dependency sets from the repository root:

```bash
npm install
npm --prefix client install
```

Create a local `.env` file with `DATABASE_URL` pointing to that database and a strong `JWT_SECRET`. Keep this file out of Git. The server initializes its tables and demonstration data on startup.

```bash
npm run dev
```

Open `http://localhost:5000`. The API runs at `http://localhost:5001`.

## Build

```bash
npm run build
npm start
```

## Status and limitations

This is a demonstration, not a deployed water-safety system. Sensor readings and blockchain transaction hashes are simulated; the current implementation does not prove physical sensor integration or submit those records to Ethereum. Use a local development database: startup seeds a demonstration account. The venture materials describe a broader product direction.

## License

No license file is included in this repository. This README grants no additional reuse or redistribution permissions; contact the repository owner about permitted use.
