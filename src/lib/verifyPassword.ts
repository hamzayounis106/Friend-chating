// src/lib/verifyPassword.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plainPassword, salt);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
