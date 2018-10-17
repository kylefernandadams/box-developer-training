'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _boxAppUserService = require('../services/box-app-user-service');

var _boxAppUserService2 = _interopRequireDefault(_boxAppUserService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoxAppUserRouter = function () {
    function BoxAppUserRouter() {
        _classCallCheck(this, BoxAppUserRouter);
    }

    _createClass(BoxAppUserRouter, [{
        key: 'create',
        value: function create() {
            var api = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _express.Router)();

            var router = new BoxAppUserRouter();
            api.get('/app-users', function (req, res) {
                return router.validateAppUser(req, res);
            });

            return api;
        }
    }, {
        key: 'validateAppUser',
        value: function validateAppUser(req, res) {
            _boxAppUserService2.default.validateAppUser(req.body.auth0AppUserId).then(function (appUserResponse) {
                return res.status(200).send({ mesage: appUserResponse });
            }).catch(function (err) {
                console.log(err);
                return res.status(500).send({ error: err.mesage });
            });
        }
    }]);

    return BoxAppUserRouter;
}();

module.exports = new BoxAppUserRouter();