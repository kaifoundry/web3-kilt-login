import type { SignerInterface, KiltAddress } from '@kiltprotocol/types';

export interface DidTransaction {
  readonly txHex: string;
  readonly submitter: SignerInterface<'Ed25519', KiltAddress>;
}
