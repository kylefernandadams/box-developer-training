/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Header, Icon, Table } from 'semantic-ui-react';

import { checkAuthentication } from './helpers';

export default withAuth(class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { userinfo: null, boxappuser: null, ready: false };
    this.checkAuthentication = checkAuthentication.bind(this);
  }

  async componentDidMount() {
    await this.checkAuthentication();
    this.applyClaims();
  }

  async componentDidUpdate() {
    await this.checkAuthentication();
    this.applyClaims();
  }

  async applyClaims() {
    if (this.state.userinfo && !this.state.claims && 
      this.state.boxappuser && !this.state.appUser) {
      const claims = Object.entries(this.state.userinfo);
      const appuser = Object.entries(this.state.boxappuser);
      this.setState({ claims, appuser, ready:true });
    }
  }

  render() {
    return (
      <div>
        {!this.state.ready && <p>Fetching user profile..</p>}
        {this.state.ready &&
        <div>
          <Header as="h1"><Icon name="drivers license outline" /> Okta User Info</Header>
          <Table>
            <thead>
              <tr>
                <th>Claim</th><th>Value</th>
              </tr>
            </thead>
            <tbody>
              {this.state.claims.map((claimEntry) => {
                const claimName = claimEntry[0];
                const claimValue = claimEntry[1];
                const claimId = `claim-${claimName}`;
                return <tr key={claimName}><td>{claimName}</td><td id={claimId}>{claimValue}</td></tr>;
              })}
            </tbody>
          </Table>
          <Header as="h1"><Icon name="drivers license outline" /> Box App User Info </Header>
          <Table>
            <thead>
              <tr>
                <th>App User Attribute</th><th>Value</th>
              </tr>
            </thead>
            <tbody>
              {this.state.appuser.map((appUserEntry) => {
                const attributeName = appUserEntry[0];
                const attributeValue = appUserEntry[1];
                return <tr key={attributeName}><td>{attributeName}</td><td id={attributeName}>{attributeValue}</td></tr>;
              })}
            </tbody>
          </Table>
        </div>
        }
      </div>
    );
  }
});
