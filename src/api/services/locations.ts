import admin from 'firebase-admin';
import { StateData } from '../models/LocationData';
const serviceAccount = require('../../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default class LocationService {

    async getAllLocations()  {
        try {
            
            let locations = {} as StateData;

            await db.collection('locations')
                    
            

        } catch (error) {
            const message = (error as Error).message;
            
            return `An error occured: ${message}`;
        }
    }
} 