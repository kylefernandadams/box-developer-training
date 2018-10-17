import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import boxAppUsersRouter from './routes/box-app-user-router';

class Server {
    constructor() {
        console.log('Starting server...')
        const app = express();
        const port = process.env.PORT || 5000;

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cors({ origin: 'http://localhost:8080'}));
        app.use(cookieParser());

        app.use('/', indexRouter);
        app.use('/box/users', boxAppUsersRouter.create());

        const server = app.listen(port, () => console.log(`Listening on port: ${port}`));
        return server;
    }
}
module.exports = new Server();
