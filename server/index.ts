import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

app.use(
  cors({
    // origin: productionOrigin,
    origin: developmentOrigin,
    credentials: true,
  })
);
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
      // Change to 'cross-origin' to allow any origin to load these resources
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
