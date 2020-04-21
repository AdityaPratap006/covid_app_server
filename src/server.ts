import express, { Application, Request, Response } from 'express';
import api from './api/api';

//import all jobs
import { retrieveLocationsAndUpdateDB } from './api/jobs/';

const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use('/api', api);


// execute jobs

// retrieveLocationsAndUpdateDB();
setInterval(() => {
    // console.log('interval ', Date.now())
    retrieveLocationsAndUpdateDB();
}, 2 * 60 * 60 * 1000);

app.listen(port, (): void => {
    console.log(`Server running at: http://localhost:${port}`);
});