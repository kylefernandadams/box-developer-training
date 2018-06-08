import BoxSDK from 'box-node-sdk';
import boxConfig from '../../../box_config.json';
import appConfig from '../../../app_config';
import moment from 'moment';

class LegalHoldsExercise {

    runExercise4_2() {
        return new Promise((resolve, reject) => {
            const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
            const client = sdk.getAppAuthClient('enterprise');

            let legalHoldId;

            // Set legal hold creation options
            const currentDateTime = moment().format('YYYY-MM-DD-hh-mm-ss');
            const legalHoldPolicyName = `Pied Piper vs Hooli - ${currentDateTime}`;
            const lhOptions = {
                is_ongoing: true
            };

            // Create a legal hold policy with name and options
            // https://github.com/box/box-node-sdk/blob/master/docs/legal-hold-policies.md#create-legal-hold-policy
            client.legalHoldPolicies.create(legalHoldPolicyName, lhOptions)
            .then(legalHoldPolicyRes => {
                console.log(`Created legal hold policy with name: ${legalHoldPolicyRes.policy_name} and id: ${legalHoldPolicyRes.id}`);
                legalHoldId = legalHoldPolicyRes.id;

                // Construct the metadata filter
                const mdFilter = {
                    templateKey: appConfig.metadataTemplateKey,
                    scope: 'enterprise',
                    filters: {}
                };
                mdFilter.filters[`${appConfig.accountNameKey}`] = appConfig.accountNameValue;

                // Add the metadata filter to the query
                const searchQuery = {
                    type: 'file',
                    scope: 'enterprise_content',
                    mdfilters: []
                };
                searchQuery.mdfilters.push(mdFilter);
                console.log('Using search query: ', searchQuery);

                // Search for all enterprise content with metadata filters
                // https://github.com/box/box-node-sdk/blob/master/docs/search.md#search-for-content
                return client.search.query(null, searchQuery);  
            })          
            .then(searchRes => {
                searchRes.entries.forEach(searchResult => {
                    console.log(`Found search result with name: ${searchResult.name} and id: ${searchResult.id}`);

                    // Assign a legal hold policy to the search result
                    // https://github.com/box/box-node-sdk/blob/master/docs/legal-hold-policies.md#assign-legal-hold-policy
                    client.legalHoldPolicies.assign(
                        legalHoldId, 
                        client.legalHoldPolicies.assignmentTypes.FILE,
                        searchResult.id
                    )
                    .then(legalHoldAssignmentRes => {
                        console.log(`Created legal hold assignment for type: ${legalHoldAssignmentRes.assigned_to.type} and id: ${legalHoldAssignmentRes.assigned_to.id}`);  
                    })
                    .catch(err => {
                        console.log('Failed to create legal hold: ', err);
                        reject(err);
                    });
                });
                resolve(searchRes);
            })
            .catch(err => {
                console.log('Failed to create legal hold: ', err);
                reject(err);
            });
            
        });
    }
}
module.exports = new LegalHoldsExercise();
