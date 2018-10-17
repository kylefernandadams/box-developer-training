import { Router } from 'express';
import BoxAppUserService from '../services/box-app-user-service';

class BoxAppUserRouter {
    create(api = Router()) {
        const router = new BoxAppUserRouter();
        api.get('/app-users', (req, res) => router.validateAppUser(req, res));

        return api;
    }

    validateAppUser(req, res) {
        BoxAppUserService.validateAppUser(req.body.auth0AppUserId)
        .then(appUserResponse => {
            return res.status(200).send({ mesage: appUserResponse });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({ error: err.mesage });
        });
    }
}
module.exports = new BoxAppUserRouter();