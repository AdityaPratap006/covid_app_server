import admin, { ServiceAccount } from 'firebase-admin';
require('dotenv').config();


admin.initializeApp({
    credential: admin.credential.cert(<ServiceAccount>{
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      }),
});

export const db = admin.firestore();
