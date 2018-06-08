const AWS = require('aws-sdk');
const moment = require('moment');
const BoxSDK = require('box-node-sdk');
const boxConfig = JSON.parse(process.env.BOX_CONFIG);
const sdk = BoxSDK.getPreconfiguredInstance(boxConfig);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

class BoxManager {
    processBoxEnterpriseEvents() {
        return new Promise((resolve, reject) => {
            const client = sdk.getAppAuthClient('enterprise');
            const now = moment.utc(new Date()).format();
            console.log('Now: ', now);
            const startDate = moment(now).subtract(5, 'days').utc().format();
            console.log('Start date: ', startDate);
        
            
        
            const EVENT_TYPES = [
                client.events.enterpriseEventTypes.UPLOAD,
                client.events.enterpriseEventTypes.PREVIEW
            ];   
            client.events.getEnterpriseEventStream({
                startDate: startDate,
                pollingInterval: 0,
                eventTypeFilter: EVENT_TYPES
            })
            .then(stream => {
                stream.on('error', (err) => {
                    console.log('Found error streaming events:', err);
                });
                stream.on('data', event => {
                    console.log('Streaming events...');
                    console.log('Found event:', JSON.stringify(event, null, 2));
                    
                    const s3Params = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `box-event-${event.event_id}.json`,
                        Body: JSON.stringify(event)
                    };
                    
                    const s3Upload = s3.upload(s3Params).promise();
                    s3Upload
                    .then(s3UploadRes => {
                        console.log('Uploaded json to S3: ', s3UploadRes);
                    })
                    .catch(err => {
                        console.log('Failed to upload json to S3: ', err);
                        reject(err);
                    });
                });
                stream.on('end', () => {
                    console.log('End of enterprise event stream');
                    const currentDateTime = moment().format('YYYY-MM-DD-hh-mm-ss');
                    resolve('Completed!');                    
                });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
        });
        
    }
}
module.exports = new BoxManager();    