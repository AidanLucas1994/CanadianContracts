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

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',                    // Local development
  'http://localhost:3000',                    // Alternative local port
  'https://canadian-contracts.onrender.com',  // Production frontend
  'https://canadian-contracts-frontend.onrender.com' // Alternative production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked origin:', origin); // Debug logging
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOAD_DIR));

// API routes
app.use('/api/contracts', contractRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/vendors', vendorRoutes);

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