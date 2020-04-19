import { Router } from 'express';
import { getRawData } from '../controllers/getRawData';

export const rawDataRouter: Router = Router();

rawDataRouter.get('/', getRawData);

