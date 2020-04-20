import nodeFetch, { Response } from 'node-fetch';
import { RawData, RawDataSample } from '../models/RawData';


export default class RawDataService {

    async getAllCases(): Promise<string | object> {

        try {

            const response: RawData = await nodeFetch('https://api.covid19india.org/raw_data.json').then((res: Response) => res.json());

            let data: Array<RawDataSample> = response.raw_data;

            let filteredData: Array<RawDataSample> = data.filter((sample: RawDataSample): boolean => {
                 
                return sample.currentstatus.toLowerCase() !== '';
            });

         
            return {
                length: filteredData.length,
                data: filteredData,
            }

        } catch (error) {
            let result: string = (error as Error).message;

            return result;
        }
    }
}
