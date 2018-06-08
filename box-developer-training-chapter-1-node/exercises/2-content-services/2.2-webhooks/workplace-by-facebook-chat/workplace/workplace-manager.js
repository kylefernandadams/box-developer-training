const moment = require('moment-timezone');
const axios = require('axios');

const FB_METADATA_TEMPLATE = 'workplaceByFacebook';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const FB_BASE_GRAPH_URI = 'https://graph.facebook.com';

class WorkplaceManager {
    processFBWebhook(event) {
        return new Promise((resolve, reject) => {
            const fbHub = event.queryStringParameters;
            const mode = fbHub['hub.mode'];
            const token = fbHub['hub.verify_token'];
            const challenge = fbHub['hub.challenge'];
        
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Checks the mode and token sent is correct
                if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
                
                    // Responds with the challenge token from the request
                    console.log('Facebook WEBHOOK_VERIFIED');
                    resolve(parseInt(challenge));
                
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    resolve('Verify tokens do not match!');
                }
            }
        });
    }

    processFBPostback(body, sdk) {
        return new Promise((resolve, reject) => {
            console.log(`Found fb postback body: ${JSON.stringify(body, null, 2)}`);    
            const message = body.entry[0].messaging[0];
            const botId =  message.recipient.id;
            const postbackTimeMillis = message.timestamp;
            const senderId = message.sender.id;
            const communityId = message.sender.community.id;
            const postbackPayload = JSON.parse(message.postback.payload);
            const postbackResponse = postbackPayload.response;
            const fileId = postbackPayload.file_id;
        
            let senderName;
            let senderEmail;
            let botName;
            let communityName;
        
            const getFBSenderUrl = `${FB_BASE_GRAPH_URI}/${senderId}?fields=email,name&access_token=${FB_ACCESS_TOKEN}`;
            axios.get(getFBSenderUrl)
            .then(fbSenderResponse => {
                console.log('Found fb sender: ', fbSenderResponse.data);
                senderName = fbSenderResponse.data.name;
                senderEmail = fbSenderResponse.data.email;
                
                const getBotUrl = `${FB_BASE_GRAPH_URI}/${botId}?access_token=${FB_ACCESS_TOKEN}`;
                return axios.get(getBotUrl);
            })
            .then(fbBotResponse => {
                console.log('Found fb bot: ', fbBotResponse.data);
                botName = fbBotResponse.data.name;
        
                const getCommunityUrl = `${FB_BASE_GRAPH_URI}/community?access_token=${FB_ACCESS_TOKEN}`;
                return axios.get(getCommunityUrl);
            })
            .then(fbCommunityResponse => {
                console.log('Found community: ', fbCommunityResponse.data);
                communityName = fbCommunityResponse.data.name;
                const postbackTime = moment.tz(postbackTimeMillis, moment.tz.guess()).format();
                const workplaceMetadata = {
                    communityId: communityId,
                    communityName: communityName,
                    senderId: senderId,
                    senderName: senderName,
                    botId: botId,
                    botName: botName,
                    postbackResponse: postbackResponse,
                    postbackTime1: postbackTime
                }
                const client = sdk.getAppAuthClient('user', senderEmail);
                return client.files.addMetadata(fileId, client.metadata.scopes.ENTERPRISE, FB_METADATA_TEMPLATE, workplaceMetadata);
            })
            .then(addMetadataResponse => {
                console.log('Found add metadata response: ', addMetadataResponse);
                resolve();
            })
            .catch(err => {
                console.log(err);
                resolve(err);
            });
        });
    }
}
module.exports = new WorkplaceManager();    



