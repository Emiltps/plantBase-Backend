import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index", { title: "Express" });
});

module.exports = router;
