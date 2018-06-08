const boxManager = require('./box/box-manager');
const workplaceManager = require('./workplace/workplace-manager');

const BoxSDK = require('box-node-sdk');
const boxConfig = JSON.parse(process.env.BOX_CONFIG);;
const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);

const FB_WEBHOOK_USER_AGENT = 'facebookplatform';
const FB_POSTBACK_USER_AGENT = 'facebookexternalua';
const BOX_WEBHOOK_USER_AGENT = 'Box-WH-Client';

exports.handler = async (event) => {
    console.log('Found event: ', event);

    // "I am Zuul. I am the Gatekeeper."
    const gateKeeperResponse = await processEvent(event);
    if(gateKeeperResponse) {
        const response = {
            statusCode: 200,
            body: gateKeeperResponse
        }; 
        console.log('Returning response:', response);
        return response;
    } 
    else {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Response from process event function is null!' })
        };
    }
};

async function processEvent(event) {
    const userAgent = event.requestContext.identity.userAgent;
    console.log('Found user agent: ', userAgent);

    let response;
    if(userAgent.startsWith(BOX_WEBHOOK_USER_AGENT) || userAgent.startsWith('PostmanRuntime')) {
        // Check if the user agent is coming from Box
        const body = JSON.parse(event.body);
        const fileId = body.source.id;
        const fileName = body.source.name;
        const createdByName = body.created_by.name;
        const createdByLogin = body.created_by.login;

        await boxManager.processBoxWebhook(fileId, fileName, createdByName, createdByLogin, sdk)
        .then(boxWebhookResponse => {
            console.log('Found box webhook processing response: ', boxWebhookResponse);
            if(boxWebhookResponse) {
                response = JSON.stringify({ message: 'Successfully invoked Workplace by Facebook webhook.'});
            } else {
                response = JSON.stringify({ message: 'Failed to process box webhook.' });
            }
            return response;
        })
        .catch(err => {
            console.log('Failed to process Box webhook', err);
            return err;
        });
    } else if(userAgent.startsWith(FB_WEBHOOK_USER_AGENT)) {
        // Check if the user agent is coming from the FB webhook registration
        await workplaceManager.processFBWebhook(event)
        .then(fbResponse => {
            console.log('Found fb webhook response: ', fbResponse);
            response = fbResponse;
            return response;
        })
        .catch(err => {
            console.log('Failed to process Facebook webhook.', err);
            return err;
        });
        
    } else if(userAgent.startsWith(FB_POSTBACK_USER_AGENT)) {
        // Check if the user agent is coming from the FB chat postback
        const body = JSON.parse(event.body);
        
        await workplaceManager.processFBPostback(sdk, body)
        .then(fbPostbackResponse => {
            console.log('Found fb postback response: ', fbPostbackResponse);
            response = JSON.stringify({ message: 'Successfully processed Facebook Postback message.'});
        })
        .catch(err => {
            console.log('Failed to process Facebook postback message.', err);
            return err;
        });
    }
    else {
        console.log('Returning default response!!!');
        return JSON.stringify({ message: 'User Agent Not Recognized!' });
    }
    return response;

};
