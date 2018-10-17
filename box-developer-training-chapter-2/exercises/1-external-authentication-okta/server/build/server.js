'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _boxAppUserRouter = require('./routes/box-app-user-router');

var _boxAppUserRouter2 = _interopRequireDefault(_boxAppUserRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function Server() {
    _classCallCheck(this, Server);

    console.log('Starting server...');
    var app = (0, _express2.default)();
    var port = process.env.PORT || 5000;

    app.use((0, _morgan2.default)('dev'));
    app.use(_express2.default.json());
    app.use(_express2.default.urlencoded({ extended: false }));
    app.use((0, _cors2.default)({ origin: 'http://localhost:8080' }));
    app.use((0, _cookieParser2.default)());

    app.use('/', _index2.default);
    app.use('/box/users', _boxAppUserRouter2.default.create());

    var server = app.listen(port, function () {
        return console.log('Listening on port: ' + port);
    });
    return server;
};

module.exports = new Server();