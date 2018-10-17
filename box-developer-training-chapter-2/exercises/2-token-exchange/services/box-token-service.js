import  BoxSDK from 'box-node-sdk';
import boxConfig from '../box_config.json';

const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
class BoxTokenService {
    generateDownScopedToken(scopes, resource) {
        return new Promise((resolve, reject) => {
            console.log('Received scopes: ', scopes);
            console.log('Received resource: ', resource);
            const client = sdk.getAppAuthClient('enterprise');
            client.exchangeToken(scopes, resource)
            .then(tokenInfo => {
                console.log('Found token info: ', tokenInfo);
                resolve({ access_token: tokenInfo.accessToken });
            })
            .catch(err => {
                console.log('Failed to generate down-scoped token: ', err);
                reject(err);
            });
        });
    }
}
module.exports = new BoxTokenService();