import bodyParser from 'body-parser';
import { StartServices } from './app';
import { Request, Response } from 'express';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import express from 'express';
import { MESSAGES } from './config/constants';
import { encryptionRoutes } from './routes';
import { swaggerSpec } from './services/swagger';
import swaggerUi from 'swagger-ui-express';
import { submitWeb3NameTransaction } from './controllers/encrypted/w3nTransaction';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

dotenv.config();
console.log(MESSAGES.MODE_OF_DEVELOPMENT + process.env.NODE_ENV);

export const expressInstance = express();

expressInstance.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
expressInstance.use(bodyParser.json({ limit: '50mb' }));

expressInstance.use('/', encryptionRoutes);
expressInstance.get('/', (req: Request, res: Response) => {
  res.status(200).json('helllo');
});

// app.use()

// process.env.NODE_ENV != "production" && expressInstance.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.MAINTENANCE == 'false') {
  StartServices()
    .then
    // handle errrror
    ();
} else {
  // show maintenance thing //
}

// app.get("*", missingRoutes);
