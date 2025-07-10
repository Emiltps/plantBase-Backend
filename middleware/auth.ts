import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabaseClient";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No auth token" });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user)
    return res.status(401).json({ msg: "Invalid token" });

  req.user = data.user;
  next();
};
