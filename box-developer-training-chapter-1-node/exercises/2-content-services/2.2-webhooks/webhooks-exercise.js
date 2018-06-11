import BoxSDK from 'box-node-sdk';
import boxConfig from '../../../box_config.json';
import appConfig from '../../../app_config';
import moment from 'moment';

class BoxWebhooksExercise {

    runExercise2_2() {
        return new Promise((resolve, reject) => {
            const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
            const client = sdk.getAppAuthClient('enterprise');

            let folderId;

            // Get the current date/time for the folder naming convention
            const currentDateTime = moment().format('YYYY-MM-DD-hh-mm-ss');
            console.log('Using current date/time: ', currentDateTime);
                
            // Create a folder at the root folder (id=0) of the service account
            // https://github.com/box/box-node-sdk/blob/master/docs/folders.md#create-a-folder
            client.folders.create('0', `Exercise-2.2-Dev-Training-${currentDateTime}`)
            .then(folderCreationRes => {
                folderId = folderCreationRes.id;
                return client.webhooks.create(
                    folderId,
                    client.itemTypes.FOLDER,
                    appConfig.awsLambdaInvokeUrl,
                    [
                        client.webhooks.triggerTypes.FILE.UPLOADED
                    ]
                );
            })
            .then(webhookRes => {
                console.log('Created webhook: ', JSON.stringify(webhookRes, null, 2));

                // Add folder to favorites
                return this.addFolderToFavorites(client, folderId);
            })
            .then(addToFavoritesRes =>{
                console.log('Successfully added forlder to favorites!');
                resolve(addToFavoritesRes);
            })
            .catch(err => {
                console.log('Failed to create webhook: ', err);
                reject(err);
            });
        });
    }

    addFolderToFavorites(client, folderId) {
        return new Promise((resolve, reject) => {
            let userId;

            // Find a specific user with a given filter
            // https://github.com/box/box-node-sdk/blob/master/docs/enterprise.md#get-enterprise-users
            client.enterprise.getUsers({ filter_term: appConfig.userFilterTerm })
            .then(usersSearchRes => {
                const user = usersSearchRes.entries[0];
                console.log(`Found user with login: ${user.login} and name: ${user.name}`);
                userId = user.id;

                // Create a collaboration on a folder, with a given user, and with the EDITOR role
                // https://github.com/box/box-node-sdk/blob/master/docs/collaborations.md#add-a-collaboration
                return client.collaborations.createWithUserID(userId, folderId, client.collaborationRoles.EDITOR);
            })
            .then(collaborationRes => {
                console.log(`Added collaboration to folder with name:  ${collaborationRes.item.name} and user: ${collaborationRes.accessible_by.login}`);

                // Switch to a managed user and make API calls on behalf of that user.
                // https://github.com/box/box-node-sdk/blob/master/docs/authentication.md#as-user
                client.asUser(userId);

                // Get the current user
                // https://github.com/box/box-node-sdk/blob/master/docs/users.md#get-the-current-users-information
                return client.users.get(client.CURRENT_USER_ID);
            })
            .then(currentUserRes => {
                console.log(`Found current user with login: ${currentUserRes.login} and name: ${currentUserRes.name}`);

                // Get all of the user's collections. Right now Favorites is the only collection.
                // https://github.com/box/box-node-sdk/blob/master/docs/collections.md#get-a-users-collections
                return client.collections.getAll(); 
            })
            .then(collectionsRes => {
                const favoriteCollection = collectionsRes.entries[0];
                console.log(`Found collection with name: ${favoriteCollection.name} and id: ${favoriteCollection.id}`);

                // Add the folder to the favorites collection
                // https://github.com/box/box-node-sdk/blob/master/docs/collections.md#add-folder-to-a-collection
                return client.folders.addToCollection(folderId, favoriteCollection.id);
            })
            .then(addFavoriteRes => {
                console.log(`Added folder to favorites collection with name: ${addFavoriteRes.name} and id: ${addFavoriteRes.id}`);

                resolve(addFavoriteRes);
            })
            .catch(err => {
                console.log('Failed to add folder to favorites: ', err);
                reject(err);
            });
        });
    }
}
module.exports = new BoxWebhooksExercise();
