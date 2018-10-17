import  BoxSDK from 'box-node-sdk';
import boxConfig from '../box_config.json';

const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
class BoxAppUserService {
    getAppUser(name, externalId) {
        return new Promise((resolve, reject) => {
            const client = sdk.getAppAuthClient('enterprise');
            console.log(`Found name: ${name} and externalId: ${externalId}`);
            client.enterprise.getUsers({
                external_app_user_id: externalId,
                fields: 'id,name,login,external_app_user_id'
            })
            .then(appUserRes => {
                console.log('Found app user: ', JSON.stringify(appUserRes, null, 2));
                if(appUserRes.total_count == 0) {
                    console.log('User not found! Creating a new app user...');
                    return client.enterprise.addAppUser(name, { external_app_user_id: externalId });
                }
                else {
                    resolve(appUserRes.entries[0]);
                }
            })
            .then(newAppUserRes => {
                console.log('Created new app user: ', newAppUserRes);
                resolve(newAppUserRes);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}
module.exports = new BoxAppUserService();