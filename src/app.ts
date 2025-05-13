import { MESSAGES } from './config/constants';
import { encryptionRoutes } from './routes';
import { expressInstance } from './server';
import { debugConsoles } from './utils/debugConsoles';
import { logger } from './utils/logger';
import * as kilt from '@kiltprotocol/sdk-js';

export async function StartServices(port: string | number) {
  let kiltApi: any;

  const serverUrl: string | undefined = process.env.SERVER_URL;

  if (!serverUrl) {
    throw new Error(MESSAGES.ENV_ERROR);
  }

  try {
    kilt.connect(serverUrl);
    process.env.NODE_ENV != 'production' && debugConsoles();
    expressInstance.listen(process.env.PORT || 3000, () => {
      const appName = process.env.APP_NAME || 'N/A';
      const version = process.env.APP_VERSION || 'N/A';
      // const port = process.env.PORT || 3000;
      const instance = process.env.NODE_APP_INSTANCE || 0;
      const mode = process.env.NODE_ENV || 'development';
      const url = `http://localhost:${port}`;
      console.log(`
  ============================================
    🧠 ${appName} - v${version}
  --------------------------------------------
    🔁 Instance     : ${instance}
    🌐 URL          : ${url}
    📦 Port         : ${port}
    🛠️  Mode         : ${mode}
  ============================================
  `);
    });
  } catch (err: any) {
    logger.error(err.message);
  } finally {
    // await kiltApi.disconnect();
  }
}
