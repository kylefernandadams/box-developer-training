import BoxSDK from 'box-node-sdk';
import boxConfig from '../../../box_config.json';
import appConfig from '../../../app_config';

import moment from 'moment';
import fs from 'fs';

class ContentService {
    runExercise2_1() {
        return new Promise((resolve, reject) => {
            const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
            const client = sdk.getAppAuthClient('enterprise');

            let folderId;
            let fileId;
            let userId;

            // Get the current date/time for the folder naming convention
            const currentDateTime = moment().format('YYYY-MM-DD-hh-mm-ss');
            console.log('Using current date/time: ', currentDateTime);

            // Create a folder at the root folder (id=0) of the service account
            // https://github.com/box/box-node-sdk/blob/master/docs/folders.md#create-a-folder
            client.folders.create('0', `Exercise-2.1-Dev-Training-${currentDateTime}`)
            .then(folderCreationRes => {
                console.log(`Successfully created folder with id: ${folderCreationRes.id} and name: ${folderCreationRes.name}`);
                folderId = folderCreationRes.id;

                // This is an example of creating metadata on a folder. With the cascade policy and metadata attached to a folder,
                // all files uploaded will inherit said metadata
                // https://github.com/box/box-node-sdk/blob/master/docs/files.md#create-metadata
                return client.folders.addMetadata(folderId, client.metadata.scopes.ENTERPRISE, appConfig.metadataTemplateKey, appConfig.accountMetadata);
            })
            .then(addMetadataRes => {
                console.log('Metadata resp: ' + JSON.stringify(addMetadataRes, null, 2));

                // Create request body for the metadata cascade policy
                const payload = {
                    body: {
                        folder_id: folderId,
                        scope: `enterprise_${boxConfig.enterpriseID}`,
                        templateKey: appConfig.metadataTemplateKey
                    }
                };

                // Create a metadata cascade policy on a folder
                // https://developer.box.com/v2.0/reference#create-metadata-cascade-policy
                return client.post('/metadata_cascade_policies', payload);
            })
            .then(metadataCascadeRes => {
                console.log(`Created cascade policy with id: ${metadataCascadeRes.body.id}`);

                // Find a specific user with a given filter
                // https://github.com/box/box-node-sdk/blob/master/docs/enterprise.md#get-enterprise-users
                return client.enterprise.getUsers({ filter_term: appConfig.userFilterTerm });
            })
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

                // Get all of the user's collections. Right now Favorites is the only collection type.
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

                // Create a read stream from a local file system and upload the file
                // https://github.com/box/box-node-sdk/blob/master/docs/files.md#upload-a-file
                var stream = fs.createReadStream(`${appConfig.filePath}${appConfig.fileName}`);
                return client.files.uploadFile(folderId, appConfig.fileName, stream);
            })
            .then(fileUploadRes => {
                fileId = fileUploadRes.entries[0].id;
                console.log('Uploaded a file with id: ', fileId);
                
                // Timeout for 5 seconds to wait for metadata to apply async
                return this.delay(5000);
            })
            .then(afterDelay => {
                // Then, get all items in the folder
                // https://github.com/box/box-node-sdk/blob/master/docs/folders.md#get-a-folders-items
                const options = {
                        fields: `metadata.enterprise.${appConfig.metadataTemplateKey}`
                };
                return client.folders.getItems(folderId, options);
            })
            .then(folderItemsRes => {
                // Loop through all folder items
                folderItemsRes.entries.forEach(item => {
                    console.log('Found folder item:', JSON.stringify(item, null, 2));
                });

                // Switch back to service client
                // https://github.com/box/box-node-sdk/blob/master/docs/authentication.md#as-user
                client.asSelf();

                // Get the current user
                // https://github.com/box/box-node-sdk/blob/master/docs/users.md#get-the-current-users-information
                return client.users.get(client.CURRENT_USER_ID);
            })
            .then(currentUserRes => {
                console.log(`Found current user with login: ${currentUserRes.login} and name: ${currentUserRes.name}`);
                resolve(currentUserRes);
            })
            .catch(err => {
                console.log('Failed to run exercise 2.1: ', err);
                reject(err);
            });
        });
    }
        
    delay(delayTime){
        return new Promise((resolve, reject) => {
            console.log(`Waiting for ${delayTime} milliseconds...`);
            setTimeout(() => {
                resolve('Wait complete');
            }, delayTime);
        });
    }
}
module.exports = new ContentService();