import * as crypto from 'crypto';
import { IV_LENGTH } from '../config/constants';
import { logger } from '../utils/logger';

export interface EncryptionArgs {
  algorithm: string;
  secretKey: string;
}

export interface DecryptionResults {
  success: boolean;
  data?: string;
}

export interface EncryptedPayload {
  iv: string;
  authTag: string;
  ciphertext: string;
}

export class EncryptionHandler {
  private algorithm: string;
  private secretKey: Buffer;

  constructor(args: EncryptionArgs) {
    this.algorithm = args.algorithm;
    this.secretKey = Buffer.from(args.secretKey, 'base64');
  }

  encrypt(plainText: string): string | null {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);

      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.secretKey,
        iv,
      ) as crypto.CipherGCM;

      let encrypted = cipher.update(plainText, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      const authTag = cipher.getAuthTag();

      const payload: EncryptedPayload = {
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        ciphertext: encrypted,
      };

      return encodeURIComponent(
        Buffer.from(JSON.stringify(payload)).toString('base64'),
      );
    } catch (error: any) {
      console.log('errrr ', error);
      logger.error('Encryption failed:', error.message);
      return null;
    }
  }

  decrypt(encryptedText: string): DecryptionResults {
    try {
      const decoded = Buffer.from(
        decodeURIComponent(encryptedText),
        'base64',
      ).toString('utf8');
      const payload: EncryptedPayload = JSON.parse(decoded);

      const iv = Buffer.from(payload.iv, 'base64');
      const authTag = Buffer.from(payload.authTag, 'base64');
      const ciphertext = payload.ciphertext;

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        iv,
      ) as crypto.DecipherGCM;

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return { success: true, data: decrypted };
    } catch (error: any) {
      // logger.error('Decryption failed:', error.message);
      return { success: false, data: undefined };
    }
  }
}

// import crypto from 'crypto';
// import { IV_LENGTH } from '../config/constants';
// import { logger } from '../utils/logger';

// export interface EncryptionArgs {
//   algorithm: string;
//   secretKey: string;
// }

// export interface DecryptionResults {
//   success: boolean;
//   data?: string;
// }

// export class EncryptionHandler {
//   algorithm: string;
//   secretKey: Buffer<ArrayBuffer>;
//   iv: Buffer<ArrayBuffer>;

//   constructor(args: EncryptionArgs) {
//     this.algorithm = args.algorithm;
//     this.secretKey = Buffer.from(args.secretKey);
//     // this.iv = crypto.randomBytes(IV_LENGTH);
//     this.iv = Buffer.from('1234567890123456');
//   }

//   encrypt(text: string): string | null {
//     const cipher = crypto.createCipheriv(
//       this.algorithm,
//       this.secretKey,
//       this.iv,
//     );
//     let encrypted = cipher.update(text, 'utf8', 'base64');
//     encrypted += cipher.final('base64');

//     return encodeURIComponent(encrypted);
//   }

//   decrypt(encryptedText: string): DecryptionResults {
//     try {
//       const decoded = decodeURIComponent(encryptedText);
//       const decipher = crypto.createDecipheriv(
//         this.algorithm,
//         this.secretKey,
//         this.iv,
//       );

//       let decrypted = decipher.update(decoded, 'base64', 'utf8');
//       decrypted += decipher.final('utf8');

//       return { success: true, data: decrypted };
//     } catch (err: any) {
//       logger.error(err.message);
//       return { success: false };
//     }

//     // return decrypted;
//   }
// }
