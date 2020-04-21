import { Request, Response } from 'express';

import LocationService from '../services/locations';

export async function getAllLocations(req: Request, res: Response): Promise<void> {

    try {

        const result = await new LocationService().getAllLocations();

        res.json(result);
        
    } catch (error) {
        const message = (error as Error).message;

        res.status(500).json(`An error occured: ${message}`);
    }
}
