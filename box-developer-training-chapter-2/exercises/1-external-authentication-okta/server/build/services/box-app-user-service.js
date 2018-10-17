'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _boxNodeSdk = require('box-node-sdk');

var _boxNodeSdk2 = _interopRequireDefault(_boxNodeSdk);

var _box_config = require('../box_config.json');

var _box_config2 = _interopRequireDefault(_box_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sdk = _boxNodeSdk2.default.getPreconfiguredInstance(_box_config2.default);

var BoxAppUserService = function () {
    function BoxAppUserService() {
        _classCallCheck(this, BoxAppUserService);
    }

    _createClass(BoxAppUserService, [{
        key: 'getAppUser',
        value: function getAppUser(name, externalId) {
            return new Promise(function (resolve, reject) {
                var client = sdk.getAppAuthClient('enterprise');
                console.log('Found name: ' + name + ' and externalId: ' + externalId);
                client.enterprise.getUsers({
                    external_app_user_id: externalId,
                    fields: 'id,name,login,external_app_user_id'
                }).then(function (appUserRes) {
                    console.log('Found app user: ', JSON.stringify(appUserRes, null, 2));
                    if (appUserRes.total_count == 0) {
                        console.log('User not found! Creating a new app user...');
                        return client.enterprise.addAppUser(name, { external_app_user_id: externalId });
                    } else {
                        resolve(appUserRes.entries[0]);
                    }
                }).then(function (newAppUserRes) {
                    console.log('Created new app user: ', newAppUserRes);
                    resolve(newAppUserRes);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            });
        }
    }]);

    return BoxAppUserService;
}();

module.exports = new BoxAppUserService();