Box Developer Training: Chapter 1 - The Basics
======================

The Box Developer Training repo contains source code used in the Box Partner Developer Training webinar series.

Chapter 1: Table of Contents - Node.js
-------------------------------
* [Exercise 1 - JWT Authentication](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/1-authentication/authentication-services.js)
* Exercise 2 - Content Services
    * [Exercise 2.1 - The Essentials](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/2-content-services/2.1-essentials/content-services.js)
    * [Exercise 2.2 - Webhooks Creation](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/2-content-services/2.2-webhooks/webhooks-exercise.js)
        * [Workplace by Facebook Lambda](https://github.com/kylefernandadams/box-developer-training/tree/master/box-developer-training-chapter-1-node/exercises/2-content-services/2.2-webhooks/workplace-by-facebook-chat) 
        * Workplace by Facebook Instructions: Coming Soon
        * AWS Lambda Instructions: Coming Soon
* [Exercise 3 - Enterprise Services](https://github.com/kylefernandadams/box-developer-training/tree/master/box-developer-training-chapter-1-node/exercises/3-enterprise-services/box-enterprise-events-aws)
    * AWS Lambda Instructions: Coming Soon
    * AWS CloudWatch Events Instructions: Coming Soon
    * AWS Athena Instructions: Coming Soon
    * AWS QuickSight Instructions: Coming Soon
* Exercise 4 - Governance Services
    * [Exercise 4.1 - Metadata-Driven Retention](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/4-governance-services/4.1-metadata-driven-retention/mddr-exercise.js)
    * [Exercise 4.2 - Legal Holds](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/4-governance-services/4.2-legal-holds/legal-holds-exercise.js)
    * [Exercise 4.3 - Security Classifications](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/4-governance-services/4.3-security-classifications/security-classifications-exercise.js)
    * [Exercise 4.4 - Watermarking](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/exercises/4-governance-services/4.4-watermarking/watermarking-exercise.js)


Chapter 1: Setup
----------------
1. Follow the instructions in the [JWT Application Setup documentation](https://developer.box.com/docs/setting-up-a-jwt-app).
2. Copy and the public/private keypair json file to the base project directories. [/box-developer-training-chapter-1-node/](https://github.com/kylefernandadams/box-developer-training/tree/master/box-developer-training-chapter-1-node).
3. Rename the automatically generated *_config.json file to `box_config.json`. 
4. Modify the [app_config.js](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js) as needed. Below are my environment-specific variables used during the exercises.
    * [filePath](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L3) and [fileName](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L4): Used for uploading files. 
    * [userFilterTerm](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L5): Used for searching for a given user that is then used to perform actions leveraging the As-User header. 
    * [metadataTemplateKey](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L8): Used for metadata cascade policies, metadata-driven retention, and legal holds exercises.
    * [accountMetadata](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L9): Used for metadata cascade policies, metadata-driven retention, and legal holds exercises.
    * [awsLambdaInvokeUrl](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L16): Used for creating webhooks in exercise 2.2.
    * [fieldName](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L19): The metadata field key used in the 4.1 metadata-driven retention exercise.
    * [enumOptionValue](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L20): The metadata field enum value key used in the 4.1 metadata-driven retention exercise.
    * [retentionLength](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L21): Length of retention (in days), used in the 4.1 metadata-driven retention exercise.
    * [accountNameValue](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L24): The account name metadata property value used in the 4.2 legal holds exercise.
    * [accountNameKey](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L25): The account name metadata property key used in the 4.2 legal holds exercise. 
    * [classificationMetadata](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/app_config.js#L30): The security classification metadata property value used in the 4.3 security classifications exercise.    
5. Enable and disable the appropriate exercises in the [index.js](https://github.com/kylefernandadams/box-developer-training/blob/master/box-developer-training-chapter-1-node/index.js) file. 
6. Change directory to the Ch. 1 directory: (`cd ./box-developer-training/box-developer-training-chapter-1-node`)
7. Run either `yarn start` or `npm start`.
8. Monitor the console output, to confirm no exceptions were thrown. 
