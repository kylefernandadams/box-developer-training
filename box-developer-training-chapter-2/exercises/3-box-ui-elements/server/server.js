import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import boxTokenRouter from './routes/box-token-router';

class Server {
    constructor() {
        console.log('Starting server...')
        const app = express();
        const port = process.env.PORT || 5000;

        app.use(logger('dev'));
        // app.use(express.json());
        // app.use(express.urlencoded({ extended: false }));
        app.use(cors({ origin: 'http://localhost:3000'}));
        app.use(cookieParser());
        app.use(bodyParser.json({ type: '*/*' }));



        app.use('/', indexRouter);
        app.use('/box/auth', boxTokenRouter.create());

        const server = app.listen(port, () => console.log(`Listening on port: ${port}`));
        return server;
    }
}
module.exports = new Server();
