import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux'; 
import elements from './elements';

export default combineReducers({
    // intl: intlReducer,
    explorer_token: elements
});
