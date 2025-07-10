import { Request, Response, NextFunction, RequestHandler } from "express";
import { supabase } from "../lib/supabaseClient";

const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const requireAuth: RequestHandler = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    (req as any).user = { id: TEST_USER_ID, email: "test@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ msg: "No auth token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ msg: "Invalid token" });
    return;
  }

  (req as any).user = data.user;
  next();
};
