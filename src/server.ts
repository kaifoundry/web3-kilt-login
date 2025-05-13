import bodyParser from 'body-parser';
import { StartServices } from './app';
import dotenv from 'dotenv';
import express from 'express';
import { MESSAGES } from './config/constants';
import { encryptionRoutes } from './routes';


dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
});

dotenv.config();
console.log(MESSAGES.MODE_OF_DEVELOPMENT + process.env.NODE_ENV);

export const expressInstance = express();

expressInstance.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
expressInstance.use(bodyParser.json({ limit: '50mb' }));

expressInstance.use('/', encryptionRoutes);


if (process.env.MAINTENANCE == 'false') {
  const PORT = process.argv[2] || process.env.PORT || 3000;
  StartServices(PORT)
    .then
    // handle errrror
    ();
} else {
  
  // show maintenance thing //
}

// app.get("*", missingRoutes);
