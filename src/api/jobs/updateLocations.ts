import nodeFetch, { Response } from 'node-fetch';
import NodeGeocoder from 'node-geocoder';

import { RawData, RawDataSample } from '../models/RawData';
import { LocationData, StateData, Coordinates } from '../models/LocationData';


import { db } from '../db/config';

const geocoderConfig = <NodeGeocoder.Options>{
    provider: 'google',
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    formatter: null,
};

const googleGeocoder: NodeGeocoder.Geocoder = NodeGeocoder(geocoderConfig);

function delay(ms: number) {

    return new Promise(resolve => {

        return setTimeout(resolve, ms)
    });
}

const organiseDataIntoMap = (data: Array<RawDataSample>): Map<string, Map<string, LocationData>> => {
    let stateData: StateData = new Map();




    data.forEach(async (sample: RawDataSample) => {

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


const fetchAndSetCoordinates = async (locationDataArray: LocationData[]) => {
    locationDataArray.forEach(async (loc: LocationData, index: number) => {

        //artificial delay to prevent overloading of queries for geocoding
        await delay(index * 100);

        try {
            const geocodeRes: Array<NodeGeocoder.Entry> = await googleGeocoder.geocode(loc.location);

            loc.coordinates = <Coordinates>{
                latitude: geocodeRes[0].latitude,
                longitude: geocodeRes[0].longitude,
            };

        } catch (error) {
            loc.coordinates = <Coordinates>{
                latitude: 0,
                longitude: 0,
            };
            console.log(`${loc.location}: error[${(error as Error).message}]`);
        }

    });

    return locationDataArray;
}


export const retrieveLocationsAndUpdateDB = async (): Promise<string | object> => {

    try {

        const response: RawData = await nodeFetch('https://api.covid19india.org/raw_data.json').then((res: Response) => res.json());

        let data: Array<RawDataSample> = response.raw_data;

        let filteredData = data.filter(sample => {
            return sample.currentstatus && sample.detectedstate && (sample.detectedcity || sample.detecteddistrict);
        })

        let organisedStateWiseData = organiseDataIntoMap(filteredData);

        let locationDataArray: LocationData[] = [];

        organisedStateWiseData.forEach((data, key) => {
            data.forEach((locationData) => {
                locationDataArray.push(<LocationData>{
                    state: key,
                    location: locationData.location,
                    caseCount: locationData.caseCount,
                });
            });
        });

        console.log('total length :', locationDataArray.length);
        //fetch the coordinates
        locationDataArray = await fetchAndSetCoordinates(locationDataArray);


        //wait for 2 min while coordinates are fetched
        await delay(2 * 60 * 1000);

        console.log('Re organise data');
        //re organsie stateWiseData with coordinates
        locationDataArray.forEach(async (loc: LocationData) => {
            let state = organisedStateWiseData.get(loc.state) as Map<string, LocationData>;

            let locationWithinState = state.get(loc.location) as LocationData;

            locationWithinState.coordinates = loc.coordinates;
            locationWithinState.state = loc.state;

            state.set(loc.location, locationWithinState);

            organisedStateWiseData.set(loc.state, state);

        });

        organisedStateWiseData.forEach(async (stateData: Map<string, LocationData>, stateKey: string) => {
            // console.log(`\nStateWiseData`);

            let locationsArray: Array<LocationData> = [];

            stateData.forEach(async (loc: LocationData) => {
                locationsArray.push(loc);
            });

            const stateDocRef = db.collection('locations').doc(stateKey);

            await stateDocRef
                .set({
                    state: stateKey,
                    locations: locationsArray,
                }, {
                    merge: true,
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

retrieveLocationsAndUpdateDB();