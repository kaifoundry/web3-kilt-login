import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTED_ENDPOINTS,
  ENCRYPTION_SECRET,
  IV_LENGTH,
} from '../config/constants';
import { EncryptionHandler } from '../services/EncryptionHandler';
import crypto from 'crypto';
import { TransactionResponse } from '../services/kiltTransactionHandler';

export async function debugConsoles() {

  const key = crypto.randomBytes(IV_LENGTH)

  const base64Key = key.toString('base64');

  console.log(base64Key + " key");

  const encrypt = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.DIDCREATION);

  const encrypt2 = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.DIDCREATION);

  console.log('did endpoint ', encrypt);
  console.log('w3n endpoint ', encrypt2);
}
