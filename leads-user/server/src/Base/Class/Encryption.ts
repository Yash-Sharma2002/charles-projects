import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config({ path: "../data.env" });

/**
 * Encryption class
 */
class Encyrption {
  private  EncryptionKey: string = process.env.ENCRYPTION_KEY as string;
  private  data: string = "";

  /**
   * Constructor
   * @param data
   */
  constructor(data: string) {
    this.data = data;
  }

  /**
   * Encrypt data
   */
  encrypt(): string {
   return CryptoJS.AES.encrypt(this.data, this.EncryptionKey).toString();
  }

  /**
   * Decrypt data
   */
  decrypt(): string {
   return CryptoJS.AES.decrypt(this.data, this.EncryptionKey).toString(
      CryptoJS.enc.Utf8
    );
  }

  /**
   * Get data
   */
  get get(): string {
    return this.data;
  }
}

export default Encyrption;
