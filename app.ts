require("dotenv").config();
import express from "express";
import path from "path";
var cookieParser = require("cookie-parser");
var logger = require("morgan");
import { Request, Response, NextFunction } from "express";

import authRouter from "./routes/auth";

const { requireAuth } = require("./middleware/auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Public routes
app.use("/auth", authRouter);

// (no protected routes yet)

export default app;
