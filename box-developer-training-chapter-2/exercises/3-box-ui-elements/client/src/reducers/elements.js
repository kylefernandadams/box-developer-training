import { CONTENT_EXPLORER } from '../actions';

export default function(state = {}, action) {
    switch(action.type) {
        case CONTENT_EXPLORER:
            return action.payload;
        default:
            return state;
    }
}