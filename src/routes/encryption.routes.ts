import { Router } from 'express';
import { encryption } from '../controllers';

export const router: Router = Router();

router.use('/', encryption);
