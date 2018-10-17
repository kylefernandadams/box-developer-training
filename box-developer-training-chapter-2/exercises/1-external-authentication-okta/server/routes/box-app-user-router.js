import { Router } from 'express';
import BoxAppUserService from '../services/box-app-user-service';



class BoxAppUserRouter {
    create(api = Router()) {
        const router = new BoxAppUserRouter();
        api.get('/app-user', (req, res) => router.getAppUser(req, res));

        return api;
    }

    getAppUser(req, res) {
        const name = req.query.name;
        const externalId = req.query.externalId;
        BoxAppUserService.getAppUser(name, externalId)
        .then(appUserResponse => {
            return res.status(200).send(appUserResponse);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({ error: err.message });
        });
    }
}
module.exports = new BoxAppUserRouter();