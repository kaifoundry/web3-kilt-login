import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { ServerResponse } from '../../types/ServerResponse';
import { HTTP_STATUS } from '../../config/responseCodes';
import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTION_SECRET,
  MESSAGES,
} from '../../config/constants';
import { ControllerArgs } from '../../types/functionArgs';
import * as Kilt from '@kiltprotocol/sdk-js';
import type { SignerInterface, KiltAddress } from '@kiltprotocol/types';
import { generateAccounts } from './generateAccount';
import { generateDid } from './generateDid';
import {
  DidTransactionHandler,
  TransactionResponse,
} from '../../services/didTransaction';
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

export async function submitDidTransaction(args: ControllerArgs) {
  const res: ServerResponse = {
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

    console.log('tx is ', tx);

    const [submitter] = (await Kilt.getSignersForKeypair({
      keypair: faucetAccount,
      type: 'Ed25519',
    })) as Array<SignerInterface<'Ed25519', KiltAddress>>;

    const transactionResponse: TransactionResponse =
      await DidTransactionHandler({
        submitter: submitter,
        txHex: tx.toString(),
      });

    if (transactionResponse.success === false) {

      if (transactionResponse.error?.identifier === TransactionError.AlreadyExists || transactionResponse.error?.identifier === TransactionError.InvalidSignature) {
        throw new KiltTransactionError(
          HTTP_STATUS.BAD_REQUEST,
          transactionResponse.error!.stack,
          MESSAGES.DID_FAILED,
        );
      }

      throw new Error(
        transactionResponse.error!.stack,
      );
    }

    res.success = true;
    res.data = transactionResponse;
    res.timestamp = Date.now().toString();

    response.status(HTTP_STATUS.ACCEPTED).json(res);
    return;
  } catch (err: any) {
    logger.error(err.message);

    res.timestamp = Date.now().toString();

    if (err instanceof DecryptionError) {
      res.message = err.message;
      response.status(err.code).json(res);
      return;
    }

    if (err instanceof ValidationError) {
      res.message = err.message;
      response.status(err.code).json(res);
      return;
    }

    if (err instanceof DidCreationError) {
      logger.error(err.errorTxt);
      res.message = err.errorTxt;
      response.status(err.code).json(res);
      return;
    }

    if (err instanceof KiltTransactionError) {
      logger.error(err.errorTxt);
      res.message = err.errorTxt;
      response.status(err.code).json(res);
      return;
    }

    res.message = MESSAGES.ERROR_MESSAGE;
    res.timestamp = Date.now().toString();
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(res);
    return;
  }
}
