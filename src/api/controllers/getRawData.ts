import { Request, Response } from 'express';

import RawDataService from '../services/rawData';

export async function getRawData(req: Request, res: Response): Promise<void> {
    
    try {
        
        const result = await new RawDataService().getAllCases();
        
        res.json(result);

         
    } catch (error) {
        res.status(500).json(`An error occured: ${error.message}`);
    }

}