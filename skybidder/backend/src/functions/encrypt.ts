import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config({ path: '../../data.env' })

export default function encrypt(data: string) {
  return CryptoJS.AES.encrypt(
    data,
    process.env.ENCRYPTION_KEY as string
  ).toString();
}
