import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { ServerResponse } from '../../types/ServerResponse';
import { HTTP_STATUS } from '../../config/responseCodes';
import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTION_SECRET,
  MESSAGES,
} from '../../config/constants';
import { HttpHandler } from '../../types/functionArgs';
import * as Kilt from '@kiltprotocol/sdk-js';
import type { SignerInterface, KiltAddress } from '@kiltprotocol/types';
import {
  KiltTransactionHandler,
  TransactionResponse,
} from '../../services/kiltTransactionHandler';
import {
  DecryptionResults,
  EncryptionHandler,
} from '../../services/EncryptionHandler';
import {
  DecryptionError,
  DidCreationError,
  KiltTransactionError,
  ValidationError,
} from '../../config/errors';
import { faucetAccount } from '../../config/faucet';
import { TransactionError } from '../../types/transactionErrorType';

export async function submitDidTransaction(args: HttpHandler) {
  const serverResponse: ServerResponse = {
    success: false,
  };

  const { request, response } = args;

  try {
    const { tx } = request.query;

    if (!tx) {
      throw new ValidationError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.DECRYPTION_FAILED,
      );
    }

    // decrypt tx-hex
    // const decryptedHex: DecryptionResults = new EncryptionHandler({
    //   algorithm: ENCRPYTION_ALGORITHM.AES_256,
    //   secretKey: ENCRYPTION_SECRET.DATA,
    // }).decrypt(tx.toString());

    // if (decryptedHex.success === false) {
    //   throw new DecryptionError(
    //     HTTP_STATUS.BAD_REQUEST,
    //     MESSAGES.DECRYPTION_FAILED,
    //   );
    // }

    // console.log('tx is ', tx);

    const [submitter] = (await Kilt.getSignersForKeypair({
      keypair: faucetAccount,
      type: 'Ed25519',
    })) as Array<SignerInterface<'Ed25519', KiltAddress>>;

    const transactionResponse: TransactionResponse =
      await KiltTransactionHandler({
        submitter: submitter,
        txHex: tx.toString(),
      });

    if (transactionResponse.success === false) {
      if (
        transactionResponse.error?.identifier ===
          TransactionError.AlreadyExists ||
        transactionResponse.error?.identifier ===
          TransactionError.InvalidSignature
      ) {
        throw new KiltTransactionError(
          HTTP_STATUS.BAD_REQUEST,
          transactionResponse.error!.stack,
          MESSAGES.DID_FAILED,
        );
      }

      throw new Error(transactionResponse.error!.stack);
    }

    serverResponse.success = true;
    serverResponse.data = transactionResponse;
    serverResponse.timestamp = Date.now().toString();

    // encrypt response
    // const encryptedData = new EncryptionHandler({algorithm: ENCRPYTION_ALGORITHM.AES_256, secretKey: ENCRYPTION_SECRET.DATA},).encrypt(JSON.stringify(serverResponse));

    response.status(HTTP_STATUS.ACCEPTED).json(serverResponse);
    return;
  } catch (err: any) {
    logger.error(err.message);

    serverResponse.timestamp = Date.now().toString();

    if (err instanceof DecryptionError) {
      serverResponse.message = err.message;
      response.status(err.code).json(serverResponse);
      return;
    }

    if (err instanceof ValidationError) {
      serverResponse.message = err.message;
      response.status(err.code).json(serverResponse);
      return;
    }

    if (err instanceof DidCreationError) {
      logger.error(err.errorTxt);
      serverResponse.message = err.errorTxt;
      response.status(err.code).json(serverResponse);
      return;
    }

    if (err instanceof KiltTransactionError) {
      logger.error(err.errorTxt);
      serverResponse.message = err.errorTxt;
      response.status(err.code).json(serverResponse);
      return;
    }

    serverResponse.message = MESSAGES.ERROR_MESSAGE;
    serverResponse.timestamp = Date.now().toString();
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(serverResponse);
    return;
  }
}
