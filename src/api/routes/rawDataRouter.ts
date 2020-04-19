import { Router } from 'express';
import { getRawData } from '../controllers/getRawData';

const rawDataRouter: Router = Router();

rawDataRouter.get('/', getRawData);

export default rawDataRouter;