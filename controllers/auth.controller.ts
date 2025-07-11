import { Request, Response, NextFunction, RequestHandler } from "express";
import { supabase } from "../lib/supabaseClient";
import db from "../db/connection";

// POST /auth/signup
export const signUp: RequestHandler = async (req, res, next) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(400).json({ msg: "Email, password and username are required" });
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    next({ status: 400, msg: error.message });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    await db.query(`
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL
      );
    `);
    await db.query(
      `INSERT INTO auth.users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;`,
      [data.user.id, email]
    );
  }

  try {
    await db.query(
      `INSERT INTO profiles (id, username, email) 
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING;`,
      [data.user.id, username, email]
    );
  } catch (seedErr) {
    console.warn("Warning: seeding profiles failed:", seedErr);
  }

  res.status(201).json({ user: data.user });
};

// POST /auth/login
export const signIn: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Email and password are required" });
    return;
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    next({ status: 401, msg: error.message });
    return;
  }
  res.json({ accessToken: data.session?.access_token, user: data.user });
};
