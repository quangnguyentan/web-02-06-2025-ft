import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initRoutes } from "./src/routes/index.routes";
import path from "path";
import { connectDB } from "./src/configs/connectDB";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import http from "http";
import { startPolling } from "./seed";

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 5000;
const allowedOrigins = ["https://hoiquan.live", "http://localhost:5173"];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
initRoutes(app);
connectDB();

// Cache ETag
const etags: { [key: string]: string } = {};

const setETag = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const endpoint = req.path;
  const data = res.locals.data || {}; // Giả sử data được lưu trong res.locals
  const etag = require("crypto")
    .createHash("md5")
    .update(JSON.stringify(data))
    .digest("hex");
  etags[endpoint] = etag;
  res.set("ETag", etag);
  next();
};

app.use((req, res, next) => {
  const endpoint = req.path;
  const clientEtag = req.headers["if-none-match"];
  if (clientEtag && etags[endpoint] === clientEtag) {
    res.status(304).end();
    return;
  }
  next();
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let lastUpdate: { [key: string]: Date } = {
  matches: new Date(0),
  replays: new Date(0),
  sports: new Date(0),
};

const broadcastUpdate = (endpoint: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({
          type: "data_updated",
          endpoint: endpoint,
          timestamp: new Date().toISOString(),
        })
      );
    }
  });
};

// Kiểm tra thay đổi từ DB (cần triển khai)
const checkUpdates = () => {
  const now = new Date();
  // Giả sử có logic kiểm tra thay đổi (ví dụ: timestamp từ DB)
  if (now.getTime() - lastUpdate.matches.getTime() > 10000) {
    broadcastUpdate("/api/matches");
    lastUpdate.matches = now;
  }
  if (now.getTime() - lastUpdate.replays.getTime() > 10000) {
    broadcastUpdate("/api/replays");
    lastUpdate.replays = now;
  }
  if (now.getTime() - lastUpdate.sports.getTime() > 300000) {
    broadcastUpdate("/api/sports");
    lastUpdate.sports = now;
  }
};

setInterval(checkUpdates, 5000); // Kiểm tra mỗi 5 giây

wss.on("connection", (ws) => {
  console.log(
    "Client connected to WebSocket at",
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  ws.on("close", () => {
    console.log(
      "Client disconnected at",
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
  });
  ws.onerror = (error) => {
    console.error(
      "WebSocket error at",
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
      (error as any).message
    );
  };
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err.message, new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  res.status(err.name === "NotAllowedError" ? 403 : 500).json({ error: err.message });
});

server.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} and ws://localhost:${PORT} at`,
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  startPolling();
});
// import express from "express";
// import cors, { CorsOptions } from "cors";
// import dotenv from "dotenv";
// import { initRoutes } from "./src/routes/index.routes";
// import path from "path";
// import { connectDB } from "./src/configs/connectDB";
// import cookieParser from "cookie-parser";
// import { startPolling } from "./seed";
// import { WebSocketServer } from "ws";
// import http from "http";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT ?? 5000;
// const allowedOrigins = ["https://hoiquan.live", "http://localhost:5173"];

// const corsOptions: CorsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean | string) => void
//   ) => {
//     console.log("Request origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       console.log("Allowed origin set to:", origin ?? allowedOrigins[0]);
//       callback(null, origin ?? allowedOrigins[0]);
//     } else {
//       console.log("Blocked origin:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.removeHeader("Access-Control-Allow-Origin");
//   res.removeHeader("Access-Control-Allow-Credentials");
//   const origin = req.headers.origin;
//   if (origin && allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//   }
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   if (req.method === "OPTIONS") {
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     res.status(204).end(); // Proper preflight response
//     return;
//   }
//   next();
// });

// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     const origin = req.headers.origin;
//     if (origin && allowedOrigins.includes(origin)) {
//       res.header("Access-Control-Allow-Origin", origin);
//       res.header("Access-Control-Allow-Credentials", "true");
//     }
//     res
//       .status(err.name === "NotAllowedError" ? 403 : 500)
//       .json({ error: err.message });
//   }
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// initRoutes(app);
// connectDB();

// // Tạo server HTTP để hỗ trợ cả Express và WebSocket
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// // Xử lý WebSocket connections
// wss.on("connection", (ws) => {
//   console.log(
//     "Client connected to WebSocket at",
//     new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//   );

//   // Xử lý message từ client (nếu cần)
//   ws.on("message", (message) => {
//     console.log(`Received from client: ${message}`);
//     // Có thể gửi lại dữ liệu nếu cần
//     ws.send(JSON.stringify({ type: "ack", message: "Message received" }));
//   });

//   // Gửi cập nhật dữ liệu định kỳ (ví dụ: thông báo data_updated)
//   const interval = setInterval(() => {
//     ws.send(
//       JSON.stringify({
//         type: "data_updated",
//         endpoint: "/api/replays",
//         timestamp: new Date().toISOString(),
//       })
//     );
//   }, 10000); // Cập nhật mỗi 10 giây

//   // Xử lý khi client disconnect
//   ws.on("close", () => {
//     console.log(
//       "Client disconnected at",
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//     );
//     clearInterval(interval); // Dừng interval khi client disconnect
//   });
// });

// // Khởi động server
// server.listen(PORT, () => {
//   console.log(
//     `Server is running on http://localhost:${PORT} and ws://localhost:${PORT}/ws at`,
//     new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//   );
//   startPolling();
// });

// import express from "express";
// import cors, { CorsOptions } from "cors";
// import dotenv from "dotenv";
// import { initRoutes } from "./src/routes/index.routes";
// import path from "path";
// import { connectDB } from "./src/configs/connectDB";
// import cookieParser from "cookie-parser";
// import { startPolling } from "./seed";
// const app = express();
// dotenv.config();
// const PORT = process.env.PORT ?? 5000;
// const allowedOrigins = ["https://hoiquan.live", "http://localhost:5173"];

// const corsOptions: CorsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean | string) => void
//   ) => {
//     console.log("Request origin:", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       console.log("Allowed origin set to:", origin ?? allowedOrigins[0]);
//       callback(null, origin ?? allowedOrigins[0]);
//     } else {
//       console.log("Blocked origin:", origin);
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.removeHeader("Access-Control-Allow-Origin");
//   res.removeHeader("Access-Control-Allow-Credentials");
//   const origin = req.headers.origin;
//   if (origin && allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//   }
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   if (req.method === "OPTIONS") {
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );
//     res.status(204).end(); // Proper preflight response
//     return;
//   }
//   next();
// });

// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     const origin = req.headers.origin;
//     if (origin && allowedOrigins.includes(origin)) {
//       res.header("Access-Control-Allow-Origin", origin);
//       res.header("Access-Control-Allow-Credentials", "true");
//     }
//     res
//       .status(err.name === "NotAllowedError" ? 403 : 500)
//       .json({ error: err.message });
//   }
// );

// app.use(cookieParser());
// // app.use(
// //   "/static",
// //   (req, res, next) => {
// //     const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
// //     const ext = path.extname(req.path).toLowerCase();
// //     if (imageExtensions.includes(ext)) {
// //       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
// //     }
// //     next();
// //   },
// //   express.static(path.join(__dirname, "./assets/images"))
// //   // express.static(path.join(__dirname, "../../var/www/hoiquantv/assets/images"))
// // );
// // app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);
// connectDB();
// app.use(express.static(path.join(__dirname, "public")));
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   startPolling();
// });
