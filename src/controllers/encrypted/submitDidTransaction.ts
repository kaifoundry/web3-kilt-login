import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { ServerResponse } from '../../types/ServerResponse';
import { HTTP_STATUS } from '../../config/responseCodes';
import { MESSAGES } from '../../config/constants';
import { ControllerArgs } from '../../types/functionArgs';
import * as Kilt from '@kiltprotocol/sdk-js';
import type { SignerInterface, KiltAddress } from '@kiltprotocol/types';
import { generateAccounts } from './generateAccount';
import { generateDid } from './generateDid';
import { DidTransactionHandler } from '../../services/didTransaction';

export async function submitDidTransaction(args: ControllerArgs) {
  const response: ServerResponse = {
    success: false,
  };

  try {
    // const { did, txData } = req.body;
    console.log('method is ', args.request.method);
    console.log('bodt is ', args.request.body);

    // const { name, age } = req.query;
    console.log('req quert is ', args.request.query);

    let api = await Kilt.connect('wss://peregrine.kilt.io/');

    console.log('connected');

    const faucet = {
      publicKey: new Uint8Array([
        238, 93, 102, 137, 215, 142, 38, 187, 91, 53, 176, 68, 23, 64, 160, 101,
        199, 189, 142, 253, 209, 193, 84, 34, 7, 92, 63, 43, 32, 33, 181, 210,
      ]),
      secretKey: new Uint8Array([
        205, 253, 96, 36, 210, 176, 235, 162, 125, 84, 204, 146, 164, 76, 217,
        166, 39, 198, 155, 45, 189, 161, 94, 215, 229, 128, 133, 66, 81, 25,
        174, 3,
      ]),
    };

    const [submitter] = (await Kilt.getSignersForKeypair({
      keypair: faucet,
      type: 'Ed25519',
    })) as Array<SignerInterface<'Ed25519', KiltAddress>>;

    const balance = await api.query.system.account(submitter.id);
    console.log('balance', balance.toHuman());

    let { holderAccount, issuerAccount } = generateAccounts();

    let holderDid = await generateDid(submitter, holderAccount);

    console.log('Received DID:', holderDid);

    const hx = holderDid['txHex'];
    await DidTransactionHandler({ submitter: submitter, txHex: hx });
    // console.log('Transaction Data:', txData);

    // console.log("params are ", params)

    throw new Error('lol');
    return;
  } catch (err: any) {
    logger.error(err.message);

    response.message = MESSAGES.ERROR_MESSAGE;
    response.timestamp = Date.now().toString();
    args.response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
    return;
  }
}
