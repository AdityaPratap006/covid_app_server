import { Request, Response } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

export async function getRawData(req: Request, res: Response): Promise<void> {
    
    try {
        const response = await fetch('https://api.covid19india.org/raw_data.json').then((res: FetchResponse) => res.json());
        
        let data = response['raw_data'];

        let filteredData = data.filter((sample: any) => {
            return  sample.currentstatus.toLowerCase() === 'hospitalized';
        });
        
        res.json({
            data: {
                length: filteredData.length,
                list: filteredData,
            },
        });

         
    } catch (error) {
        res.status(500).json(`An error occured: ${error.message}`);
    }

}