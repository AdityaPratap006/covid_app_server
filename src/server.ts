import express, { Application, Request, Response } from 'express';
import api from './api/api';

const app: Application = express();
const port: string | number = process.env.PORT || 3000;




app.use('/api', api);

app.listen(port, ():void => {
    console.log(`Server running at: http://localhost:${port}`);
});