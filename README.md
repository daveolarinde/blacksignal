# Crypto Asset Recovery - Fullstack Demo

A React + Tailwind CSS + Framer Motion website inspired by the provided screenshots, rebuilt with a brown-accent theme, protected superadmin dashboard, JWT auth, MongoDB persistence, and a discreet Socket.io chatbox visible only to signed-in users and admins.

## Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Axios
- Zustand-ready structure
- Socket.io client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Multer file uploads
- Socket.io

## Features
- Brown-accent landing page with sections matching the visual direction of the screenshots
- Recovery request wizard with 4 steps
- Secure client portal for signed-in users
- Protected `/admin` route for superadmins only
- Admin intake table showing contact details and issue summaries
- Hidden chat widget only visible inside authenticated views
- Upload support documents during recovery request intake
- Seeded admin account from environment variables

## Project structure

```bash
crypto-asset-recovery-fullstack/
├── client/
├── server/
├── package.json
└── README.md
```

## Setup

### 1) Install dependencies

```bash
npm install
npm install --workspace client
npm install --workspace server
```

or run:

```bash
npm run install:all
```

### 2) Configure environment variables

#### Server
Copy `server/.env.example` to `server/.env`

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/crypto-recovery
JWT_SECRET=replace-with-a-strong-secret
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

#### Client
Copy `client/.env.example` to `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3) Start MongoDB
Run your local MongoDB service or point the server at MongoDB Atlas.

### 4) Run the app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Important note
This project is a product demo. It deliberately includes warnings not to collect seed phrases or private keys. If you ever deploy something in this niche for real, do not treat the visual clone alone as enough. The trust model, legal position, audit trail, and data handling matter more than the landing page.

## Default admin
A default admin is created automatically on first server boot using the credentials in `server/.env`.

## Suggested next upgrades
- Add message notifications and unread counts
- Add case status editing for admins
- Add S3 or Cloudinary for production file uploads
- Add Redis adapter if chat needs to scale across multiple Node instances
- Replace localStorage token storage with HTTP-only cookie auth
