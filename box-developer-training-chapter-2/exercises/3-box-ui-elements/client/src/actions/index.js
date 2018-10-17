import axios from 'axios';
export const CONTENT_EXPLORER = 'get-content-exlorer';

const TOKEN_SERVICE_URL = 'http://localhost:5000/box/auth/token-service';


export function fetchExplorerToken(){
    console.log('Getting content explorer access token...');

    return (dispatch) => {
        const scopes = ['base_explorer', 'item_delete', 'item_download', 'item_preview', 'item_rename', 'item_share', 'item_upload'];
        // const resource = 'https://api.box.com/2.0/folders/0';

        const body = {
            scopes: scopes,
            // resource: resource
        };
        axios.post(TOKEN_SERVICE_URL, body)
        .then(tokenInfo => {
            dispatch({
                type: CONTENT_EXPLORER,
                payload: tokenInfo.data.access_token
            });
        })
        .catch(err => {
            console.log('Failed to exchange token: ', err);
        });
    };
}