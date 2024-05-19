import CryptoJS  from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../../data.env' })

export default function decrypt(data: string) {
    return CryptoJS.AES.decrypt(data, process.env.ENCRYPTION_KEY as string).toString();
}