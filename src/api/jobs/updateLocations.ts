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
    let stateData: StateData = new Map();

    data.forEach((sample: RawDataSample) => {

        const { detectedcity, detecteddistrict, detectedstate } = sample;
        const stateKey: string = `${detectedstate}`;
        let locationKey = `${detectedcity}, ${detecteddistrict}, ${detectedstate}`;

        if (stateData?.has(stateKey)) {
            let locations: Map<string, LocationData> | undefined = stateData.get(stateKey);

            if (locations?.has(locationKey)) {
                let locData = locations.get(locationKey);
                locData!.caseCount++;
                locations.set(locationKey, locData!);
            } else {
                let locData = <LocationData>{
                    location: locationKey,
                    caseCount: 1,
                };
                locations!.set(locationKey, locData!);
            }
        } else {
            let locations: Map<string, LocationData> = new Map();
            locations.set(locationKey, <LocationData>{ location: locationKey, caseCount: 1 });
            stateData.set(stateKey, locations);
        }

    });


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
            // console.log(`\nStateWiseData`);

            let locationsArray: Array<LocationData> = [];

            stateData.forEach(async (loc: LocationData) => {
                // console.log('locData: ', loc);
                locationsArray.push(loc);
            });

            const stateDocRef = db.collection('locations').doc(stateKey);

            await stateDocRef
                .set({
                    state: stateKey,
                    locations: locationsArray,
                });


        });


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

