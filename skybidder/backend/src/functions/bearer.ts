import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../../data.env" });

export function createBearer(
  email: string,
  uid: string,
  session: string | undefined
) {
  return jwt.sign({ email, uid, session }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function validateToken(token: string) {
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return "";
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return "Token expired.";
    } else if (error instanceof jwt.JsonWebTokenError) {
      return "Invalid token.";
    } else {
      return "Unknown error.";
    }
  }
}

