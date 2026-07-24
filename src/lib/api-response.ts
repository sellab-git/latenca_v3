import { NextResponse } from "next/server";

/** Standard API error shape: `{ data, error: { code, message } }`. */
export type ApiError = { code: string; message: string };
export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

export function apiOk<T>(data: T): ApiResult<T> {
  return { data, error: null };
}

export function apiError(code: string, message: string): ApiResult<never> {
  return { data: null, error: { code, message } };
}

/** JSON Response helpers for Route Handlers. */
export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data, error: null }, { status });
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
): NextResponse {
  return NextResponse.json({ data: null, error: { code, message } }, { status });
}

export function jsonRateLimited(): NextResponse {
  return jsonError("rate_limited", "Too many requests", 429);
}
