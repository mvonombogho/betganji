import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, userId: payload.sub as string };
  } catch (error) {
    return { valid: false, userId: null };
  }
}
