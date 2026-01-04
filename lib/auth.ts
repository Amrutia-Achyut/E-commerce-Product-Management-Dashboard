import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const secretKey = process.env.AUTH_SECRET || 'your-secret-key-change-in-production';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  username: string;
  expiresAt: Date;
}

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function encrypt(payload: SessionPayload): Promise<string> {
  // Convert Date to timestamp for JWT serialization
  const jwtPayload = {
    username: payload.username,
    expiresAt: payload.expiresAt.getTime(),
  };
  
  return await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(session: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(session, key, {
    algorithms: ['HS256'],
  });
  
  // Extract payload and reconstruct SessionPayload
  // JWT stores expiresAt as a number (timestamp), so we convert it back to Date
  const jwtPayload = payload as unknown as { username: string; expiresAt: number };
  
  return {
    username: jwtPayload.username,
    expiresAt: new Date(jwtPayload.expiresAt),
  };
}

export async function login(username: string, password: string): Promise<boolean> {
  // Verify credentials
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  // Check if ADMIN_PASSWORD_HASH is set (for production)
  if (process.env.ADMIN_PASSWORD_HASH) {
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    return isValid;
  }

  // Fallback: check plain text password (for development/initial setup)
  return password === ADMIN_PASSWORD;
}

export async function createSession(username: string): Promise<string> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ username, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return session;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return null;
  }

  try {
    const payload = await decrypt(session);
    
    // Check if session is expired
    if (new Date(payload.expiresAt) < new Date()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

