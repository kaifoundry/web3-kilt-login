import { Blockchain } from '@kiltprotocol/chain-helpers';
import { DidTransaction } from '../types/didTransaction';
import { logger } from '../utils/logger';
import * as Kilt from '@kiltprotocol/sdk-js';

export interface TransactionResponse {
  success: boolean;
  error?: string | null;
}

export async function DidTransactionHandler(
  transaction: DidTransaction,
): Promise<TransactionResponse> {
  let api = await Kilt.connect(process.env.SERVER_URL || 'NA');

  try {
    const result = await Blockchain.signAndSubmitTx(
      api.tx(transaction.txHex),
      transaction.submitter,
    );

    return { success: result.isCompleted, error: null };
  } catch (err: any) {
    logger.error(err.message);
    return { success: false, error: err.message };
  } finally {
    api.disconnect();
  }
}
