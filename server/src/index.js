import dotenv from "dotenv";
dotenv.config();
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './socket/index.js';
import seedAdmin from './utils/seedAdmin.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

await connectDB();
await seedAdmin();
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
