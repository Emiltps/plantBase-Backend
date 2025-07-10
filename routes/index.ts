import { Router, Request, Response, NextFunction, json } from "express";
import cors from "cors";
import apiRoutes from "./api.router";

const router = Router();

// Apply CORS and JSON middleware to all routes in this router
router.use(cors());
router.use(json());

// Mount API routes under /api
router.use("/api", apiRoutes);

// Example root route (optional)
// router.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to PlantBase API");
// });

export default router;
