'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _boxTokenService = require('../services/box-token-service');

var _boxTokenService2 = _interopRequireDefault(_boxTokenService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoxTokenRouter = function () {
    function BoxTokenRouter() {
        _classCallCheck(this, BoxTokenRouter);
    }

    _createClass(BoxTokenRouter, [{
        key: 'create',
        value: function create() {
            var api = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _express.Router)();

            var router = new BoxTokenRouter();
            api.post('/token-service', function (req, res) {
                return router.generateDownScopedToken(req, res);
            });

            return api;
        }
    }, {
        key: 'generateDownScopedToken',
        value: function generateDownScopedToken(req, res) {
            var _req$body = req.body,
                scopes = _req$body.scopes,
                resource = _req$body.resource;

            _boxTokenService2.default.generateDownScopedToken(scopes, resource).then(function (tokenResponse) {
                return res.status(200).send(tokenResponse);
            }).catch(function (err) {
                console.log(err);
                return res.status(500).send({ error: err.mesage });
            });
        }
    }]);

    return BoxTokenRouter;
}();

module.exports = new BoxTokenRouter();