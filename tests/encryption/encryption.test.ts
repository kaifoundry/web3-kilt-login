import { EncryptionHandler, EncryptionArgs, DecryptionResults, EncryptedPayload } from '../../src/services/EncryptionHandler'; // Adjust the import path
import * as crypto from 'crypto';


describe('EncryptionHandler', () => {
  let encryptionHandler: EncryptionHandler;
  const secretKey = 'TxmtDd1OsvdPfoP85zyhszNCl4vW8KxZeV1Jt2G9vzk='; 
  const algorithm = 'aes-256-gcm';
  
  beforeEach(() => {
    encryptionHandler = new EncryptionHandler({ algorithm, secretKey });
  });

  describe('encrypt', () => {
    it('should successfully encrypt plain text', () => {
      const plainText = 'Hello, World!';
      const encrypted = encryptionHandler.encrypt(plainText);
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toEqual(plainText); 
    });

    it('should return null if encryption fails', () => {
      // Simulate a failure by passing an invalid key
      const handlerWithInvalidKey = new EncryptionHandler({ algorithm, secretKey: 'invalidKey' });
      const result = handlerWithInvalidKey.encrypt('Hello');
      expect(result).toBeNull();
    });
  });

  describe('decrypt', () => {
    it('should successfully decrypt encrypted text', () => {
      const plainText = 'Hello, World!';
      const encrypted = encryptionHandler.encrypt(plainText);
      expect(encrypted).toBeTruthy();

      const decrypted: DecryptionResults = encryptionHandler.decrypt(encrypted!);
      expect(decrypted.success).toBe(true);
      expect(decrypted.data).toBe(plainText);
    });

    // it('should fail to decrypt when the encrypted text is tampered with', () => {
    //   const plainText = 'Hello, World!';
    //   const encrypted = encryptionHandler.encrypt(plainText);

    //   // Tamper with the encrypted string
    //   const tamperedEncrypted = encrypted?.replace('=', ''); 

    //   const decrypted: DecryptionResults = encryptionHandler.decrypt(tamperedEncrypted!);
    //   expect(decrypted.success).toBe(false);
    //   expect(decrypted.data).toBeUndefined();
    // });

    it('should return false if decryption fails', () => {
      // Pass an invalid encrypted string
      const invalidEncrypted = 'invalidBase64String';
      const decrypted: DecryptionResults = encryptionHandler.decrypt(invalidEncrypted);
      expect(decrypted.success).toBe(false);
      expect(decrypted.data).toBeUndefined();
    });
  });
});

