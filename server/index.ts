import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors"; // Import CorsOptions type
import cookieParser from "cookie-parser";
import { connectDB } from "./src/configs/connectDB";
import { initRoutes } from "./src/routes/index.routes";
import "./src/passport/index";
import path from "path";

const app = express();
dotenv.config();
const PORT = process.env.PORT ?? 5000;
const productionOrigin = "https://hoiquan.live";
const developmentOrigin = "http://localhost:5173";

// Define allowed origins
const allowedOrigins = [productionOrigin, developmentOrigin];

// Define the corsOptions with typed origin function
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean | string) => void
  ) => {
    // Allow requests with no origin (e.g., mobile apps, curl) and origins in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || "*"); // Use the specific origin or * for no-origin cases
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cookieParser());
app.use(
  "/static",
  (req, res, next) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    const ext = path.extname(req.path).toLowerCase();

    if (imageExtensions.includes(ext)) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  },
  express.static(path.join(__dirname, "./assets/images"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
