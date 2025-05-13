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
  MESSAGES,
} from '../../config/constants';
import { submitDidTransaction } from './didTransaction';
import { submitWeb3NameTransaction } from './w3nTransaction';
import { HTTP_STATUS } from '../../config/responseCodes';
import { DecryptionError } from '../../config/errors';
import { ServerResponse } from '../../types/ServerResponse';
import { rootResponse } from '..';

export async function encryptionController(req: Request, res: Response) {
  console.log('Access Endpoint(Encrypted): ', req.url);

  if (req.url === '/') {
    res.status(HTTP_STATUS.ACCEPTED).json(rootResponse());
    return;
  }

  const urlWithoutSpecialChar: string = req.url.slice(1);

  try {
    const decryptedEndpoint: DecryptionResults = new EncryptionHandler({
      algorithm: ENCRPYTION_ALGORITHM.AES_256,
      secretKey: ENCRYPTION_SECRET.URL,
    }).decrypt(urlWithoutSpecialChar);

    // throw error is encrpyion fails
    if (!decryptedEndpoint.data) {
      throw new DecryptionError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.DECRYPTION_ERROR,
      );
    }

    console.log('decrypted text is ', decryptedEndpoint);
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
        throw new DecryptionError(
          HTTP_STATUS.BAD_REQUEST,
          MESSAGES.DECRYPTION_ERROR,
        );
      }
    }
  } catch (err: unknown) {
    const serverResponse: ServerResponse = {
      success: false,
    };
    if (err instanceof Error) {
      logger.error(err.message);
    }

    if (err instanceof DecryptionError) {
      logger.error(err.message);
      serverResponse.message = err;
      res.status(err.code).json(serverResponse);
      return;
    }

    res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(serverResponse);
  }
}
