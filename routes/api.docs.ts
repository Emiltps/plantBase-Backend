import { Router, Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";

const router = Router();
const docsPath = path.join(__dirname, "../endpoints.json");

function serveDocs(req: Request, res: Response, next: NextFunction) {
  fs.readFile(docsPath, "utf8", (err, data) => {
    if (err) return next(err);
    try {
      const docs = JSON.parse(data);
      res.json(docs);
    } catch (parseErr) {
      next(parseErr);
    }
  });
}

router.get("/", serveDocs);

router.get("/json", serveDocs);

export default router;
