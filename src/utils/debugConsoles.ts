import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTED_ENDPOINTS,
  ENCRYPTION_SECRET,
} from '../config/constants';
import { EncryptionHandler } from '../services/EncryptionHandler';

export async function debugConsoles() {
  const encrypt = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.TRANSHEX);

  console.log('emcc ', encrypt);
}
