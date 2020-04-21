import { Router } from 'express';
import { getAllLocations } from '../controllers/getAllLocations';

export const locationsRouter: Router = Router();

locationsRouter.get('/', getAllLocations);

