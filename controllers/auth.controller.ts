import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabaseClient";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return next({ status: 400, msg: error.message });
  res.status(201).json({ user: data.user });
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return next({ status: 401, msg: error.message });
  res.json({ accessToken: data.session?.access_token, user: data.user });
};
