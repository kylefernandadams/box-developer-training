const axios = require('axios');

const BOX_CONTENT_PREVIEW_BASE_URI = process.env.BOX_CONTENT_PREVIEW_BASE_URI;

const FB_BASE_GRAPH_URI = 'https://graph.facebook.com';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

class BoxManager {
    processBoxWebhook(fileId, fileName, createdByName, createdByLogin, sdk) {
            return new Promise((resolve, reject) => {
            const baseFileUrl = `${sdk.config.apiRootURL}/2.0/files/${fileId}`;
            console.log('Found files root url: ', baseFileUrl);
        
            let fbUserId;
            const getFBUserIdUrl = `${FB_BASE_GRAPH_URI}/${createdByLogin}?access_token=${FB_ACCESS_TOKEN}`;
            console.log('FB User Id URL: ', getFBUserIdUrl);
            axios.get(getFBUserIdUrl)
            .then(fbMemberResponse => {
                console.log('Found fb user: ', fbMemberResponse.data);
        
                if(fbMemberResponse.data){
                    fbUserId = fbMemberResponse.data.id;
                    const client = sdk.getAppAuthClient('user', createdByLogin);
                    const scopes = ['base_preview', 'item_read'];
                    return client.exchangeToken(scopes, baseFileUrl);
                } 
                else {
                    resolve({ message: `FB user not found for login: ${createdByLogin}` });    
                }
            })
            .then(downscopedTokenRes => {
                console.log('Found new downscoped token: ', downscopedTokenRes);
                const accessToken = downscopedTokenRes.accessToken;
                const fileUrl = `${baseFileUrl}/content?access_token=${accessToken}`;
                const contentPreviewUrl = `${BOX_CONTENT_PREVIEW_BASE_URI}?file_id=${fileId}&access_token=${accessToken}`;
                const fbMessagePayload = {
                    recipient: {
                        id: fbUserId
                    },
                    message: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: [
                                    {
                                        title: `Please review ${fileName}`,
                                        image_url: fileUrl,
                                        subtitle: `Created By: ${createdByName}`,
                                        default_action: {
                                            type: 'web_url',
                                            url: contentPreviewUrl,
                                            messenger_extensions: false,
                                            webview_height_ratio: 'tall'
                                        },
                                        buttons: [
                                            {
                                                type: 'postback',
                                                title: 'Approve',
                                                payload: `{ "response": "Approved" , "file_id": "${fileId}" }`
                                            },
                                            {
                                                type: 'postback',
                                                title: 'Reject',
                                                payload: `{ "response": "Rejected" , "file_id": "${fileId}" }`
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };
                return axios.post(`${FB_BASE_GRAPH_URI}/me/messages?access_token=${FB_ACCESS_TOKEN}`, fbMessagePayload);
            })
            .then(fbMessageRes => {
                console.log('FB message response: ', fbMessageRes);
        
                resolve({ message: fbMessageRes });
            })
            .catch(err => {
                console.log(err);
                resolve(err);
            });  
        });
    }
}
module.exports = new BoxManager();    