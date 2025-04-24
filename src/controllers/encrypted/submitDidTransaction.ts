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
  ValidationError,
} from '../../config/errors';
import { faucetAccount } from '../../config/faucet';

export async function submitDidTransaction(args: ControllerArgs) {
  const res: ServerResponse = {
    success: false,
  };

  const { request, response } = args;

  try {
    // let api = await Kilt.connect('wss://peregrine.kilt.io/');

    const { tx } = request.query;

    if (!tx) {
      throw new ValidationError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.DECRYPTION_FAILED,
      );
    }

    // decrypt tx-hex
    const decryptedHex: DecryptionResults = new EncryptionHandler({
      algorithm: ENCRPYTION_ALGORITHM.AES_256,
      secretKey: ENCRYPTION_SECRET.DATA,
    }).decrypt(tx.toString());

    if (decryptedHex.success === false) {
      throw new DecryptionError(
        HTTP_STATUS.BAD_REQUEST,
        MESSAGES.DECRYPTION_FAILED,
      );
    }

    const [submitter] = (await Kilt.getSignersForKeypair({
      keypair: faucetAccount,
      type: 'Ed25519',
    })) as Array<SignerInterface<'Ed25519', KiltAddress>>;

    const transactionResponse: TransactionResponse =
      await DidTransactionHandler({
        submitter: submitter,
        txHex: decryptedHex.data!,
      });

    if (transactionResponse.success === false) {
      throw new DidCreationError(
        HTTP_STATUS.BAD_GATEWAY,
        transactionResponse.error!,
        MESSAGES.DID_FAILED,
      );
    }

    res.success = true;
    res.message = MESSAGES.TRANSACTION_COMPLETED;
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
      res.message = err.message;
      response.status(err.code).json(res);
      return;
    }
    res.message = MESSAGES.ERROR_MESSAGE;
    res.timestamp = Date.now().toString();
    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(res);
    return;
  }
}
