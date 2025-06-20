import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import { initRoutes } from "./src/routes/index.routes";
import path from "path";
import { connectDB } from "./src/configs/connectDB";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
const PORT = process.env.PORT ?? 5000;
const allowedOrigins = ["*", "https://hoiquan.live", "http://localhost:5173"];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean | string) => void
  ) => {
    console.log("Request origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log("Allowed origin set to:", origin ?? allowedOrigins[0]);
      callback(null, origin ?? allowedOrigins[0]);
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

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.removeHeader("Access-Control-Allow-Origin");
//   res.removeHeader("Access-Control-Allow-Credentials");
//   console.log("Response headers before setting:", res.getHeaders());
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     res.header("Access-Control-Allow-Origin", "localhost:5173");
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.status(500).json({ error: err.message });
//   }
// );
app.use(cookieParser());
app.use(
  "/static",
  (req, res, next) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    const ext = path.extname(req.path).toLowerCase();

    if (imageExtensions.includes(ext)) {
      // Change to 'cross-origin' to allow any origin to load these resources
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  },
  express.static(path.join(__dirname, "./assets/images"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
