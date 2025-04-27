import {
  ENCRPYTION_ALGORITHM,
  ENCRYPTED_ENDPOINTS,
  ENCRYPTION_SECRET,
} from '../config/constants';
import { EncryptionHandler } from '../services/EncryptionHandler';
import crypto from 'crypto';
import { TransactionResponse } from '../services/kiltTransactionHandler';


export async function debugConsoles() {

  const data  ="eyJpdiI6IkpIWExncnlkVVZmcXQ3SWciLCJhdXRoVGFnIjoieUg4ajV1aVlhVllKaWIzQjBIRlJuQT09IiwiY2lwaGVydGV4dCI6IlBmaDYwdEo1QitUUnQ3ZGFWTW5UaFpiME53d29iZDV5U09jdkxRcDdJZmpXT0JmcDdjOXFsQVBxSE5BTy8wUk9CaFc0eGVvNUFkTmg3VHdMTmhDS1FLOTNMd0t2QksvOTNsa2lzemx6b0hWZFg0Nm54OWxDNXdPYVphNVdkMEc3c21XbXhUaldnMStqOHA0cHdRZ2plOVFTUjNvK2lxU2Q0c2xlRTZUandCVEFGcG9DRnZ4YVN5VEV5VkwzSkhvMytHekwxMUZ3Z2FJaGZqVURua0JpWW5Ib09FMGhSVkFvNnBrMkxJQzM4dDhMS0dKdmR4TjZ5aDJXY1I2SDdaMHIvYzZFNGRCMktMK2NQeXVVTlc5b0dVVVFFaUw5UzdMSEJuTENYM1lUckhUZS9IUHE0RmloRERaT3JjVTIrNGltbFhDWm5hZlFaY0QybXRWbVliWCtjQXRxeG9tZHFzMFo1NTBJVThYOWIxUTZQdG89In0%3D"



  const decdata = new EncryptionHandler({algorithm: ENCRPYTION_ALGORITHM.AES_256, secretKey: ENCRYPTION_SECRET.DATA},).decrypt(data);


  // const xx: TransactionResponse = {
  //   success: true,
  //   transaction: {
  //     blockHash: "fdf",
  //     transactionStatus: 'completed',
  //     txHash: "xyz"
  //   }
  // }

  console.log("xyz ", decdata);

  // console.log("data is ", JSON.stringify(xx));
  // const xyz = crypto.randomBytes(32);

  // const base64Key = xyz.toString('base64');
  
  // console.log("Base64 key is:", base64Key);

  // console.log(Buffer.from(ENCRYPTION_SECRET.URL, 'base64').length); // 32

  // console.log(Buffer.from(ENCRYPTION_SECRET.URL, 'utf8').length); 
  const encrypt = new EncryptionHandler({
    algorithm: ENCRPYTION_ALGORITHM.AES_256,
    secretKey: ENCRYPTION_SECRET.URL,
  }).encrypt(ENCRYPTED_ENDPOINTS.TRANSHEX);

  console.log('emcc ', encrypt);
}
