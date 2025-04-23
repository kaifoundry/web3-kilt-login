import * as Kilt from '@kiltprotocol/sdk-js';
import type { SignerInterface, KiltAddress } from '@kiltprotocol/types';

const faucet = {
  publicKey: new Uint8Array([
    238, 93, 102, 137, 215, 142, 38, 187, 91, 53, 176, 68, 23, 64, 160, 101,
    199, 189, 142, 253, 209, 193, 84, 34, 7, 92, 63, 43, 32, 33, 181, 210,
  ]),
  secretKey: new Uint8Array([
    205, 253, 96, 36, 210, 176, 235, 162, 125, 84, 204, 146, 164, 76, 217, 166,
    39, 198, 155, 45, 189, 161, 94, 215, 229, 128, 133, 66, 81, 25, 174, 3,
  ]),
};

export async function getSubmitterAccount() {
  const [submitter] = (await Kilt.getSignersForKeypair({
    keypair: faucet,
    type: 'Ed25519',
  })) as Array<SignerInterface<'Ed25519', KiltAddress>>;

  return submitter;
}
