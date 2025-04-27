import { MESSAGES } from './config/constants';
import { encryptionRoutes } from './routes';
import { expressInstance } from './server';
import { debugConsoles } from './utils/debugConsoles';
import { logger } from './utils/logger';
import * as kilt from '@kiltprotocol/sdk-js';

export async function StartServices() {
  let kiltApi: any;

  const serverUrl: string | undefined = process.env.SERVER_URL;

  if (!serverUrl) {
    throw new Error(MESSAGES.ENV_ERROR);
  }

  try {
    // kiltApi = await kilt.connect(serverUrl);
    console.log('connected');

    debugConsoles();
    expressInstance.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT || 3000}`,
      );
    });

    console.log('hello, connected');
  } catch (err: any) {
    logger.error(err.message);
  } finally {
    // await kiltApi.disconnect();
  }

  console.log('lol');
}
