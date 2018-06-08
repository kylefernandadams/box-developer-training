import BoxSDK from 'box-node-sdk';
import boxConfig from '../../box_config.json';
import express from 'express';
import http from'http';
import bodyParser from 'body-parser';
import querystring from 'querystring';


const BOX_OAUTH_CLIENT_ID = process.env.BOX_OAUTH_CLIENT_ID;
const BOX_OAUTH_CLIENT_SECRET = process.env.BOX_OAUTH_CLIENT_SECRET;


class AuthenticationService {
    getJwtAuthClient() {
        return new Promise((resolve, reject) => {
            // Get an enterprise/service client 
            const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
            const client = sdk.getAppAuthClient('enterprise');

            // Get the current user
            client.users.get(client.CURRENT_USER_ID)
            .then(currentUser => {
                console.log(`Found current user with login: ${currentUser.login} and name: ${currentUser.name}`);
                resolve(client);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    getOAuthClient() {

        const oauth2ClientId = 'OAUTH_CLIENT_ID_HERE';
        const oauth2ClientSecret = 'OAUTH_CLIENT_SECRET_HERE';

        const app = express();
        app.use(bodyParser.json({ type: '*/*' }));
        app.use(bodyParser.urlencoded({ extended: true }));
        
        // Express server setup
        const port = process.env.PORT || 3000;
        const server = http.createServer(app);
        server.listen(port);

        app.get('/start', (req, res) => {
            // Create oauth payload
            const payload = {
              'response_type': 'code',
              'client_id': oauth2ClientId,
              'redirect_uri': 'http://localhost:3000/return'
            };
          
            // Call box authorization endpoint
            const qs = querystring.stringify(payload);
            const authEndpoint = `https://account.box.com/api/oauth2/authorize?${qs}`;
            res.redirect(authEndpoint);
          });

          app.get('/return', (req, res) => {
            // Extract auth code and state
            const state = req.query.state;
            const code = req.query.code;
        
            // Create a new Box SDK instance
            const sdk = new BoxSDK({
                clientID: oauth2ClientId,
                clientSecret: oauth2ClientSecret
            });

            // Exchange auth code for an access token
            sdk.getTokensAuthorizationCodeGrant(code)
            .then(tokenInfo => {
                const client = sdk.getBasicClient(tokenInfo.accessToken);
                // Get current user information and display
                client.users.get(client.CURRENT_USER_ID)
                .then(currentUser => {
                    console.log(`Found current user with login: ${currentUser.login} and name: ${currentUser.name}`);
                    res.status(200).send({ 
                        user_login: currentUser.login, 
                        user_name: currentUser.name,
                        user_id: currentUser.id
                    });
                })
                .catch(err => console.log(err));;
            })
            .catch(err => console.log(err));
          });
    }

    getManualJwtAuthClient() {

    }
}
module.exports = new AuthenticationService();