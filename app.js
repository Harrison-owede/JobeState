import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';

import sanitize from './src/middlewares/sanitize.js';
import authRoutes from './src/routes/auth.routes.js';
import fileRoutes from './src/routes/files.routes.js';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import jobRoutes from "./src/routes/job.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import blogRoutes from "./src/routes/blog.routes.js";
import applicationRoutes from "./src/routes/application.routes.js";

const app = express();



// Trust proxy (needed for Render/Heroku)
if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(sanitize());
app.use(hpp());
app.use(compression());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Body & Cookies
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.get("/jobestate", (req, res) => {
  res.send("✅ Jobestate Api is running successfully");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/applications", applicationRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);



export default app;
