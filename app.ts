import "dotenv/config";
import cors from 'cors'
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import authRouter from "./routes/auth";
import {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
} from "./middleware/errorHandlers";
import apiRouter from "./routes/api.router";
import apiDocsRouter from "./routes/api.docs";

const app = express();
app.use(cors())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Public routes
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/json", apiDocsRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);

// Protected routes
// (no protected routes yet)
// Example Use:
// app.use('/plants', requireAuth, plantsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleServerError);

export default app;
