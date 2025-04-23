import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { EncryptionHandler } from '../../services/EncryptionHandler';
import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTED_ENDPOINTS,
  ENCRYPTION_SECRET,
} from '../../config/constants';
import { submitDidTransaction } from './submitDidTransaction';

export async function encryptionController(req: Request, res: Response) {
  const urlWithoutSpecialChar: string = req.url.slice(1);

  try {
    const decryptedEndpoint: string = new EncryptionHandler({
      algorithm: ENCRPYTION_ALGORITHM.AES_256,
      secretKey: ENCRYPTION_SECRET.URL,
    }).decrypt(urlWithoutSpecialChar);

    switch (decryptedEndpoint) {
      // match endpoints
      case ENCRYPTED_ENDPOINTS.TRANSHEX: {
        submitDidTransaction({ request: req, response: res });
        return;
      }
      // other endpoints
      default: {
        res.status(500);
      }
    }

    res.status(200).json('xxo');
  } catch (err: any) {
    logger.error(err.message);
  }

  res.status(200).json('hello');
}
