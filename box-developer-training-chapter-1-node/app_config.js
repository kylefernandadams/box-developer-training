
// Exercise 2 - Content Services Variables
const filePath = exports.filePath = '/path/to/file/';
const fileName = exports.fileName = 'Test.pdf';
const userFilterTerm = exports.userFilterTerm = 'Richard Hendricks';

// Used in Exercise 2.1, 4.1, 4.2
const metadataTemplateKey = exports.metadataTemplateKey = 'account';
const accountMetadata = exports.accountMetadata = {
    accountId: '123456',
    accountName: 'Pied Piper',
    accountOwner: 'Erlich Bachman'
};

// Exercise 2.2 - Webhook Variables
const awsLambdaInvokeUrl = exports.awsLambdaInvokeUrl = 'WEBHOOK_INVOCATION_URL_HERE';

// Exercise 4.1 - Metadata Driven Retention Variables
const fieldName = exports.fieldName = 'accountStatus';
const enumOptionValue = exports.enumOptionValue = 'false';
const retentionLength = exports.retentionLength = 5;

// Exercise 4.2 - Legal Holds Variables
const accountNameValue = exports.accountNameValue = 'Pied Piper';
const accountNameKey = exports.accountNameKey = 'accountName';

// Exercise 4.3 - Security Classifications Variables
const classifciationTemplateKey = exports.classifciationTemplateKey = 'securityClassification-6VMVochwUWo';
const classificationMetadata = exports.classificationMetadata = {
    Box__Security__Classification__Key: 'Confidential'
};
