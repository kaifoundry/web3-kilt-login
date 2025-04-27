import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import {
  DecryptionResults,
  EncryptionHandler,
} from '../../services/EncryptionHandler';
import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTED_ENDPOINTS,
  ENCRYPTION_SECRET,
} from '../../config/constants';
import { submitDidTransaction } from './didTransaction';
import { submitWeb3NameTransaction } from './w3nTransaction';

export async function encryptionController(req: Request, res: Response) {
  const urlWithoutSpecialChar: string = req.url.slice(1);

  try {
    const decryptedEndpoint: DecryptionResults = new EncryptionHandler({
      algorithm: ENCRPYTION_ALGORITHM.AES_256,
      secretKey: ENCRYPTION_SECRET.URL,
    }).decrypt(urlWithoutSpecialChar);

    // throw error is encrpyion fails

    switch (decryptedEndpoint.data) {
      // match endpoints
      case ENCRYPTED_ENDPOINTS.DIDCREATION: {
        submitDidTransaction({ request: req, response: res });
        return;
      }

      case ENCRYPTED_ENDPOINTS.W3NCREATION: {
        submitWeb3NameTransaction({ request: req, response: res });
        return;
      }
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
