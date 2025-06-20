import express from "express";
import cors, { CorsOptions } from "cors"; // Ensure 'cors' package is installed
import dotenv from "dotenv";
import path from "path";

// Initialize Express app
const app = express();
dotenv.config();

const PORT = process.env.PORT ?? 5000;
const allowedOrigins = ["https://hoiquan.live", "http://localhost:5173"]; // Define allowed origins

// Define CORS options
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean | string) => void
  ) => {
    console.log("Request origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log("Allowed origin set to:", origin || allowedOrigins[0]);
      callback(null, origin || allowedOrigins[0]);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to clean headers and set additional policies
app.use((req, res, next) => {
  res.removeHeader("Access-Control-Allow-Origin");
  res.removeHeader("Access-Control-Allow-Credentials");
  console.log("Response headers before setting:", res.getHeaders());
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Other middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/sports", (req, res) => {
  res.json({ message: "Sports data" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
