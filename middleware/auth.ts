import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabaseClient";

const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

export const requireAuth = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "test") {
    req.user = { id: TEST_USER_ID, email: "test@example.com" };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No auth token" });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user)
    return res.status(401).json({ msg: "Invalid token" });

  req.user = data.user;
  next();
};
