import jwt, { SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not configured");
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ||
      "7d") as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
};
