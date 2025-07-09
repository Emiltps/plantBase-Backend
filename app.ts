import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import authRouter from "./routes/auth";
import { requireAuth } from "./middleware/auth";
import {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
} from "./middleware/errorHandlers";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Public routes
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
