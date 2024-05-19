import bcrypt from "bcryptjs";
import encrypt from "./encrypt";
import decrypt from "./decrypt";

export function hash(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function createSession() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return encrypt(date.toString());
}

export const validateSession = (session: string) => {
  const date = new Date();
  const decrypted = decrypt(session);
  const sessionDate = new Date(decrypted);
  return date > sessionDate;
};
