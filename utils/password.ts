import bcrypt from "bcryptjs";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePasswords(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
