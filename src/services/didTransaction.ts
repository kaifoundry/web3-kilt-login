import { Blockchain } from '@kiltprotocol/chain-helpers';
import { DidTransaction } from '../types/didTransaction';
import { logger } from '../utils/logger';
import * as Kilt from '@kiltprotocol/sdk-js';

export async function DidTransactionHandler(transaction: DidTransaction) {
  try {
    const api = Kilt.ConfigService.get('api');

    const result = await Blockchain.signAndSubmitTx(
      api.tx(transaction.txHex),
      transaction.submitter,
    );

    console.log('results is ', result.isCompleted);
    console.log('results is ', result.toHuman());
  } catch (err: any) {
    logger.error(err.message);
    throw err;
  }
}
