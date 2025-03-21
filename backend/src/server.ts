import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import contractRoutes from "./routes/contractRoutes";
import proposalRoutes from "./routes/proposalRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import { UPLOAD_DIR } from "./config/storage";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOAD_DIR));

// API routes
app.use('/api', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api', vendorRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Contract Management API" });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Error starting server:', err);
  }
});