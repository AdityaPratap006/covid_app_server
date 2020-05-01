import express, { Application } from 'express';
import api from './api/api';


const app: Application = express();
const port: string | number = process.env.PORT || 3000;

app.use('/api', api);

app.listen(port, (): void => {
    console.log(`Server running on port:${port}`);
});