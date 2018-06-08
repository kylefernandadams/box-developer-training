import auth from './exercises/1-authentication/authentication-services';
import content from './exercises/2-content-services/2.1-essentials/content-services';
import webhooks from './exercises/2-content-services/2.2-webhooks/webhooks-exercise';
import mddr from './exercises/4-governance-services/4.1-metadata-driven-retention/mddr-exercise';
import legalHolds from './exercises/4-governance-services/4.2-legal-holds/legal-holds-exercise';
import securityClassifications from './exercises/4-governance-services/4.3-security-classifications/security-classifications-exercise';
import watermarking from './exercises/4-governance-services/4.4-watermarking/watermarking-exercise';

class Index {

    constructor() {
        // Exercise 1 - Authentication
        auth.getJwtAuthClient()
        .then(() => {
            // Exercise 2.1- Content Services
            // return content.runExercise2_1();
        })
        .then(() => {
            // Exercise 2.2 - Enterprise Services - Webhooks
            // return webhooks.runExercise2_2();
        })
        .then(() => {
            // Exercise 4.1 - Metadata Driven Retention
            // return mddr.runExercise4_1();
        })
        .then(() => {
            // Exercise 4.2 - Legal Holds
            // return legalHolds.runExercise4_2();
        })
        .then(() => {
            // Exercise 4.3 - Security Classifications
            // return securityClassifications.runExercise4_3();
        })
        .then(() => {
            // Exercise 4.4 - Watermarking
            // return watermarking.runExercise4_4();
        })
        .then(() => {
            console.log('Finished running exercises!');
        })
        .catch(err => {
            console.log('Failed to run exercises.', err);
        });
    }
}
module.exports = new Index();