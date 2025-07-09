import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../types/custom-error";

export const handleCustomErrors: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next
) => {
  if (err.status && err.msg) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    next(err);
  }
};
export const handlePSQLErrors: ErrorRequestHandler = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02"];
  if (err.code && psqlBadRequestCodes.includes(err.code)) {
    res.status(400).json({ msg: "Bad request" });
  } else {
    next(err);
  }
};

export const handleServerError: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Internal Server Error" });
};
