import _ from 'lodash';
import BoxSDK from 'box-node-sdk';
import boxConfig from '../../../box_config.json';
import appConfig from '../../../app_config';
import moment from 'moment';

class MetadataDrivenRetentionExercise {

    runExercise4_1() {
        return new Promise((resolve, reject) => {
            const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);
            const client = sdk.getAppAuthClient('enterprise');
            let retentionPolicyId;

            // Set Retention Policy Options
            const currentDateTime = moment().format('YYYY-MM-DD-hh-mm-ss');
            const retentionPolicyName = `MDDRDemo-${currentDateTime}`;
            const retentionOptions = {
                retention_length: appConfig.retentionLength
            };
    
            // Create a retention policy
            // https://github.com/box/box-node-sdk/blob/master/docs/retention-policies.md
            client.retentionPolicies.create(
                retentionPolicyName,
                client.retentionPolicies.policyTypes.FINITE,
                client.retentionPolicies.dispositionActions.PERMANENTLY_DELETE,
                retentionOptions
            )
            .then(retentionPolicyRes => {
                console.log('Created retention policy:', JSON.stringify(retentionPolicyRes, null, 2));
                retentionPolicyId = retentionPolicyRes.id;

                // Get metadata template schema
                // https://github.com/box/box-node-sdk/blob/master/docs/metadata.md#get-by-template-scope-and-key
                return client.metadata.getTemplateSchema('enterprise', appConfig.metadataTemplateKey);
            })
            .then(metadataTemplateSchemaRes => {
                console.log('Found template schema: ', JSON.stringify(metadataTemplateSchemaRes, null, 2));

                // Get the metadata template id
                const metadataTemplateId = metadataTemplateSchemaRes.id;

                // Get the account status field id
                const field = _.filter(metadataTemplateSchemaRes.fields, ({key}) => key === appConfig.fieldName);
                const fieldId = field[0].id;

                // Get the false inactive status enum id
                const enumOption = _.filter(field[0].options, ({key}) => key === appConfig.enumOptionValue);
                const enumOptionId = enumOption[0].id;

                // Set retention policy assignment options
                const options = {
                    filter_fields: [
                        {
                            field: fieldId,
                            value: enumOptionId
                        }
                    ]
                };
                // Assign a retention policy using the metadata filter type
                // https://github.com/box/box-node-sdk/blob/master/docs/retention-policies.md#assign-retention-policy
                return client.retentionPolicies.assign(retentionPolicyId, client.retentionPolicies.assignmentTypes.METADATA, metadataTemplateId, options);
            })
            .then(metadataAssignmentRes => {
                console.log('Created metadata assignment:', JSON.stringify(metadataAssignmentRes, null, 2));
                resolve(metadataAssignmentRes);
            })
            .catch(err => {
                console.log('Failed to create mddr: ', err);
                reject(err);
            });
        });
    }
}
module.exports = new MetadataDrivenRetentionExercise();


