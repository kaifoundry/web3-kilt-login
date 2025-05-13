import { Blockchain } from '@kiltprotocol/chain-helpers';
import { DidTransaction } from '../types/didTransaction';
import { logger } from '../utils/logger';
import * as Kilt from '@kiltprotocol/sdk-js';
import { MESSAGES } from '../config/constants';
import { TransactionError } from '../types/transactionErrorType';

export interface TransactionResponse {
  transaction?: {
    transactionStatus: 'completed' | 'failed';
    blockHash: string; // hex string
    txHash: string; // hex string
  };
  success: boolean;
  error?: {
    stack: string;
    identifier: TransactionError;
  };
}

export async function KiltTransactionHandler(
  transaction: DidTransaction,
): Promise<TransactionResponse> {
  const serverUrl: string | undefined = process.env.SERVER_URL;

  if (!serverUrl) {
    throw new Error(MESSAGES.ENV_ERROR);
  }

  const api = await Kilt.connect(serverUrl);

  const transactionResponse: TransactionResponse = {
    success: false,
  };

  try {
    const result = await Blockchain.signAndSubmitTx(
      api.tx(transaction.txHex),
      transaction.submitter,
    );

    const txHash = result.txHash;
    // @ts-expect-error
    const blockHash = result.status.toJSON()!.finalized;

    if (result.isError && !result.isCompleted) {
      throw new Error(result.internalError?.message || 'Unknown');
    }

    transactionResponse.success = true;
    transactionResponse.transaction = {
      blockHash,
      transactionStatus: 'completed',
      txHash: txHash.toString(),
    };

    return transactionResponse;
  } catch (err: any) {
    // console.log('errr is ', err);

    if (err?.method) {
      switch (err.method) {
        case 'AlreadyExists': {
          transactionResponse.error = {
            identifier: TransactionError.AlreadyExists,
            stack: err?.docs?.[0] || 'No stack trace available',
          };

          return transactionResponse;
        }

        case 'InvalidSignature': {
          transactionResponse.error = {
            identifier: TransactionError.InvalidSignature,
            stack: err?.docs?.[0] || 'No stack trace available',
          };

          return transactionResponse;
        }

        case 'InvalidNonce': {
          transactionResponse.error = {
            identifier: TransactionError.InvalidNonce,
            stack: err?.docs?.[0] || 'No stack trace available',
          };

          return transactionResponse;
        }

        default: {
          transactionResponse.error = {
            identifier: TransactionError.UnknownError,
            stack: err?.docs?.[0] || 'No stack trace available',
          };

          return transactionResponse;
        }
      }
    }

    logger.error(err.message);
    return {
      success: false,
      error: {
        identifier: TransactionError.UnknownError,
        stack: 'No stack trace available',
      },
    };
  } finally {
    api.disconnect();
  }
}
