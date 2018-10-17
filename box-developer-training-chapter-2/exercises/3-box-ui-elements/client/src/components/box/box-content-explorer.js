import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
import { ContentExplorer } from 'box-ui-elements';
import messages from 'box-ui-elements/i18n/en-US';
import 'box-ui-elements/dist/explorer.css';
import { fetchExplorerToken } from '../../actions';

// addLocaleData([...en]);

class BoxContentExplorer extends Component {
    componentDidMount() {
        this.props.fetchExplorerToken();
    }

    render() {
        let { explorer_token } = this.props;
        if((typeof explorer_token !== 'string') || (!explorer_token)) {
        console.log('Null content explorer token...');
        return <div>Loading...</div>; 
        } 
        return(
            <ContentExplorer 
                token={explorer_token}
                language='en-US'
                messages={messages}
                canUpload={true}
                
            />
        );
    }
}

function mapStateToProps(state) {
    return { explorer_token: state.explorer_token };
};

export default connect(mapStateToProps, { fetchExplorerToken })(BoxContentExplorer);