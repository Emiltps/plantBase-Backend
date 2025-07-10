import { Request, Response, NextFunction } from "express";
import cors from "cors";
const express = require("express");
const router = express.Router();
import apiRoutes from "./api.router";

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

export default app;

// router.get("/", function (req: Request, res: Response, next: NextFunction) {
//   res.render("index", { title: "Express" });
// });

// module.exports = router;
