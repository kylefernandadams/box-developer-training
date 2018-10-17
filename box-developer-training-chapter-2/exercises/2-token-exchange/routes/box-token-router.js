import { Router } from 'express';
import BoxTokenService from '../services/box-token-service';

class BoxTokenRouter {
    create(api = Router()) {
        const router = new BoxTokenRouter();
        api.post('/token-service', (req, res) => router.generateDownScopedToken(req, res));

        return api;
    }

    generateDownScopedToken(req, res) {
        const { scopes, resource } = req.body;
        BoxTokenService.generateDownScopedToken(scopes, resource)
        .then(tokenResponse => {
            return res.status(200).send(tokenResponse);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({ error: err.mesage });
        });
    }
}
module.exports = new BoxTokenRouter();