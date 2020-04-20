import nodeFetch, { Response } from 'node-fetch';
import { RawData, RawDataSample } from '../models/RawData';
import { LocationMap } from '../models/LocationMap';

import admin from 'firebase-admin';
const serviceAccount = require('../../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const organiseDataIntoMap: object = (data: Array<RawDataSample>) => {

}


export const retrieveLocationsAndUpdateDB = async (): Promise<string | object> => {

    try {

        const response: RawData = await nodeFetch('https://api.covid19india.org/raw_data.json').then((res: Response) => res.json());

        let data: Array<RawDataSample> = response.raw_data;

        let filteredData: Array<RawDataSample> = data.filter((sample: RawDataSample): boolean => {

            return sample.currentstatus.toLowerCase() === 'hospitalized' && sample.detecteddistrict.toLowerCase() === 'mumbai';
        });

        await db.collection('locations').doc('length')
            .set({
                length: filteredData.length,
                time: Date.now().toLocaleString(),
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

