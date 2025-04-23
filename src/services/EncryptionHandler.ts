import crypto from 'crypto';
import { IV_LENGTH } from '../config/constants';

export interface EncryptionArgs {
  algorithm: string;
  secretKey: string;
}

export class EncryptionHandler {
  algorithm: string;
  secretKey: Buffer<ArrayBuffer>;
  iv: Buffer<ArrayBuffer>;

  constructor(args: EncryptionArgs) {
    this.algorithm = args.algorithm;
    this.secretKey = Buffer.from(args.secretKey);
    // this.iv = crypto.randomBytes(IV_LENGTH);
    this.iv = Buffer.from('1234567890123456');
  }

  encrypt(text: string): string | null {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encodeURIComponent(encrypted);
  }

  decrypt(encryptedText: string): string {
    const decoded = decodeURIComponent(encryptedText);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );

    let decrypted = decipher.update(decoded, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
