import * as Kilt from '@kiltprotocol/sdk-js';
import type {
  SignerInterface,
  DidDocument,
  MultibaseKeyPair,
  KiltAddress,
} from '@kiltprotocol/types';
import { DidTransactionHandler } from '../../services/didTransaction';

export async function generateDid(
  submitter: SignerInterface<'Ed25519', KiltAddress>,
  authenticationKeyPair: MultibaseKeyPair,
) {
  const api = Kilt.ConfigService.get('api');
  const transactionHandler = Kilt.DidHelpers.createDid({
    api,
    signers: [authenticationKeyPair],
    submitter: submitter,
    fromPublicKey: authenticationKeyPair.publicKeyMultibase,
  });

  // const didDocumentTransactionResult = await transactionHandler.submit();

  const didDocumentTransactionResult =
    await transactionHandler.getSubmittable();
  console.log('did ', didDocumentTransactionResult['txHex']);

  return didDocumentTransactionResult;

  // if (didDocumentTransactionResult.status !== "confirmed") {
  //   console.log(didDocumentTransactionResult.status);
  //   throw new Error("create DID failed");
  // }

  // let { didDocument, signers } = didDocumentTransactionResult.asConfirmed;
  // console.log(`ISSUER_DID_URI=${didDocument.id}`);
  // return { didDocument, signers };
}
