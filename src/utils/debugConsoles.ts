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
  const key = crypto.randomBytes(IV_LENGTH);

  const base64Key = key.toString('base64');

  console.log(base64Key + ' key');

  const encrypt = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.DIDCREATION);

  const encrypt2 = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.DIDCREATION);

  const txVAl = "0x21020440000bd15092a8c25945004cf750ddfb514f107c9530f31c550bbedf39cd2eaae43eee5d6689d78e26bb5b35b0441740a065c7bd8efdd1c15422075c3f2b2021b5d20000000000176520816db867c23968fd0cc5c14c80634a12bd41a5c02aec81ee45930117fd5fdf9853a76cea47b57a975d60e97f9510867f107c4d4a3af1b2078f2728750c"

    const encrypt4 = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.DATA,
  }).encrypt(txVAl);


  console.log('did endpoint ', encrypt);
  console.log('w3n endpoint ', encrypt2);
  console.log('tx  txx', encrypt4);

}
