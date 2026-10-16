# AquaChain

AquaChain is a water-quality monitoring prototype that explores how sensor dashboards and traceable records could make clean-water operations easier to understand.

## Current implementation

- A React and Vite frontend with a landing page, registration and sign-in (household or business accounts), sensor dashboards, and reading charts.
- An Express API with JWT authentication, PostgreSQL storage, and Socket.IO live updates.
- Sensor management: add, edit, connect/disconnect, and toggle a simulated purifier per sensor.
- A sensor simulator that generates pH, TDS, turbidity, and temperature readings every 10 seconds.
- Demonstration blockchain transaction records (simulated hashes and block numbers) with a lookup endpoint.
- Venture planning, product-development, and commercialization documents from the original team project.

## Tech stack

- **Frontend:** React 18, Vite, Chart.js, Socket.IO client, Lucide icons
- **Backend:** Node.js, Express, Socket.IO, `pg`, `jsonwebtoken`, `bcryptjs`
- **Database:** PostgreSQL

## Project structure

```text
client/                  React + Vite frontend (pages, components, auth context)
server/
├── index.js             Express + Socket.IO entry point (serves client/dist in production)
├── models/database.js   Table creation and demonstration seed data
├── middleware/auth.js   JWT verification
├── routes/              auth, sensors, readings, dashboard, blockchain APIs under /api
└── utils/               Sensor reading simulator
*.docx, *.pptx, *.xlsx   Venture, product-development, and commercialization materials
```

## Run locally

Install Node.js and provision a local PostgreSQL database, then install both dependency sets from the repository root:

```bash
npm install
npm --prefix client install
```

Create a local `.env` file with `DATABASE_URL` pointing to that database and a strong `JWT_SECRET` (optionally `PORT` for the API, default 5001). Keep this file out of Git. The server initializes its tables and demonstration data on startup.

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

<!-- project-artwork:start -->
## Project artwork

![Conceptual artwork for AquaChain](assets/brand/cover.png)

Conceptual project artwork. [Asset files, design notes, and generation prompts](assets/brand/README.md).
<!-- project-artwork:end -->
