import  BoxSDK from 'box-node-sdk';
import boxConfig from '../box_config.json';

const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
class BoxAppUserService {
    validateAppUser(auth0AppUserId) {
        return new Promise((resolve, reject) => {
            const client = sdk.getAppAuthClient('enterprise');
            
        });
    }
}
module.exports = new BoxAppUserService();