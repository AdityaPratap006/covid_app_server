import express, { Request, Response, Application } from 'express';

import { rawDataRouter } from './routes/';

const api: Application = express();

api.get('/', (req: Request, res: Response) => {
    res.send({
        message: `Hello World!`,
    });
});

api.use('/raw_data', rawDataRouter);

export default api;