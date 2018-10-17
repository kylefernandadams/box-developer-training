'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _boxNodeSdk = require('box-node-sdk');

var _boxNodeSdk2 = _interopRequireDefault(_boxNodeSdk);

var _box_config = require('../box_config.json');

var _box_config2 = _interopRequireDefault(_box_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sdk = _boxNodeSdk2.default.getPreconfiguredInstance(_box_config2.default);

var BoxTokenService = function () {
    function BoxTokenService() {
        _classCallCheck(this, BoxTokenService);
    }

    _createClass(BoxTokenService, [{
        key: 'generateDownScopedToken',
        value: function generateDownScopedToken(scopes, resource) {
            return new Promise(function (resolve, reject) {
                console.log('Received scopes: ', scopes);
                console.log('Received resource: ', resource);
                var client = sdk.getAppAuthClient('enterprise');
                client.exchangeToken(scopes, resource).then(function (tokenInfo) {
                    console.log('Found token info: ', tokenInfo);
                    resolve({ access_token: tokenInfo.accessToken });
                }).catch(function (err) {
                    console.log('Failed to generate down-scoped token: ', err);
                    reject(err);
                });
            });
        }
    }]);

    return BoxTokenService;
}();

module.exports = new BoxTokenService();