import { ResponseLocationObject } from '../models/LocationData';

import { db } from '../db/config';


export default class LocationService {

    async getAllLocations() {
        try {

            let locations: ResponseLocationObject = {

            };
            const locationsRef = db.collection('locations');
            const snapshot = await locationsRef.get();
            let docCount = 0;
            snapshot.forEach(async (doc) => {
               
                const data = doc.data();
                // console.log(`${snapshot.id}: `, data);
                locations[doc.id.toLowerCase()] = data;

                docCount += data!.locations.length;
                
            });

            return {
                count: docCount,
                stateWiseLocations: locations,
            }


        } catch (error) {
            const message = (error as Error).message;

            return `An error occured: ${message}`;
        }
    }
} 