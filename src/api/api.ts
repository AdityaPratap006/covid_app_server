import express, { Request, Response, Application } from 'express';

import { rawDataRouter, locationsRouter } from './routes/';

const api: Application = express();

api.get('/', (req: Request, res: Response) => {
    res.send({
        message: `Hello World!`,
    });
});

api.use('/raw_data', rawDataRouter);
api.use('/locations', locationsRouter);

export default api;