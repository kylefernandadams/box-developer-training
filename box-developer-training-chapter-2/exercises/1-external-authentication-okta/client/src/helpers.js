import axios from 'axios';
const BOX_APP_USER_URL = 'http://localhost:5000/box/users/app-user';

/**
 * Helper function that watches the authenticate state, then applies it
 * as a boolean (authenticated) as well as attaches the userinfo data.
 */
async function checkAuthentication() {
  const authenticated = await this.props.auth.isAuthenticated();
  if (authenticated !== this.state.authenticated) {
    if (authenticated && !this.state.userinfo) {
      const userinfo = await this.props.auth.getUser();
      console.log('Found Okta User Info: ', userinfo);

      axios.get(`${BOX_APP_USER_URL}?name=${userinfo.name}&externalId=${userinfo.sub}`)
      .then(appUserRes => {
        console.log('Found Box App User Info: ', appUserRes.data);
        const boxappuser = appUserRes.data;
        this.setState({ authenticated, userinfo, boxappuser });

      })
      .catch(err => console.log(err));
    } else {
      this.setState({ authenticated });
    }
  }
}
/* eslint-disable import/prefer-default-export */
export { checkAuthentication };
