'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (options) {
  var newConfig = _extends({}, _jsreportConfig2.default);

  newConfig.options = options;
  newConfig.main = _electron2.default;
  newConfig.directory = _path2.default.join(__dirname, '../');

  return newConfig;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _electron = require('./electron');

var _electron2 = _interopRequireDefault(_electron);

var _jsreportConfig = require('../jsreport.config.js');

var _jsreportConfig2 = _interopRequireDefault(_jsreportConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];