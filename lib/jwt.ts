import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'donanim-oyunu-gizli-anahtar-2026-meb-guvenlik';
const JWT_SECRET = new TextEncoder().encode(secretKey);

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
