import nodeFetch, { Response } from 'node-fetch';
import { RawData, RawDataSample } from '../models/RawData';
import { LocationData, StateData } from '../models/LocationData';

import admin from 'firebase-admin';
const serviceAccount = require('../../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const organiseDataIntoMap = (data: Array<RawDataSample>): StateData => {
    let stateData = new Map<string, Map<string, LocationData>>();

    data.forEach((sample: RawDataSample) => {

        const { detectedcity, detecteddistrict, detectedstate } = sample;
        const stateKey: string = `${detectedstate}`;
        let locationKey = `${detectedcity}, ${detecteddistrict}, ${detectedstate}`;

        if (stateData?.has(stateKey)) {
            let locationMap: Map<string, LocationData> | undefined = stateData.get(stateKey);


            if (locationMap?.has(locationKey)) {
                let locData = locationMap.get(locationKey);

                locationMap!.set(locationKey, {
                    caseCount: locData!.caseCount + 1,
                });

            } else {

                locationMap?.set(locationKey, {
                    caseCount: 1,
                });


            }
        } else {
            let locationMap = new Map<string, LocationData>();
            locationMap?.set(locationKey, {
                caseCount: 1,
            });
            stateData.set(stateKey, locationMap);
        }

    });

    // console.log('StateWiseData', stateData);
    return stateData;

}


export const retrieveLocationsAndUpdateDB = async (): Promise<string | object> => {

    try {

        const response: RawData = await nodeFetch('https://api.covid19india.org/raw_data.json').then((res: Response) => res.json());

        let data: Array<RawDataSample> = response.raw_data;

        let filteredData = data.filter(sample => {
            return sample.currentstatus && sample.detectedcity && sample.detecteddistrict && sample.detectedstate;
        })

        let organisedStateWiseData = organiseDataIntoMap(filteredData);

        organisedStateWiseData.forEach(async (stateData: Map<string, LocationData>, stateKey: string) => {

            stateData.forEach(async (locationData: LocationData, locationKey: string) => {
                await db
                    .collection('locations')
                    .doc(stateKey)
                    .collection('locationData')
                    .doc(locationKey)
                    .set({
                        caseCount: locationData.caseCount,
                    });

                    // console.log('saved! ', Date.now());
            });
        });

        // console.log(organisedStateWiseData);
        let result: any = {
            size: organisedStateWiseData.size,
            data: organisedStateWiseData,
        };

        return result;

    } catch (error) {
        let result: string = (error as Error).message;

        return result;
    }
}

