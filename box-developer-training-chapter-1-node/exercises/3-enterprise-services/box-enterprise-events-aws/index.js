
const boxManager = require('./box-manager');


exports.handler = async (event) => {
    
    console.log('Getting box enterprise events...');
    console.log('Found event', JSON.stringify(event));
    const result  = await boxManager.processBoxEnterpriseEvents();
    console.log('Result: ', result);
    return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Processed event...' })
    };
};

