export interface CustomError extends Error {
  status?: number;
  msg?: string;
  code?: string;
}
