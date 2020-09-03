'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (reporter, conversion, request, response) {
  // TODO: add support for header and footer html when electron support printing header/footer
  return new _bluebird2.default(function (resolve) {
    var options = request.template.electron,
        numberOfPages = void 0;

    return resolve(conversion({
      html: response.content,
      delay: options.printDelay,
      timeout: options.timeout,
      waitForJS: options.waitForJS != null ? options.waitForJS : false,
      waitForJSVarName: 'JSREPORT_READY_TO_START',
      converterPath: _electronHtmlTo2.default.converters.PDF,

      browserWindow: {
        width: options.width,
        height: options.height,
        webPreferences: {
          javascript: !(options.blockJavaScript != null ? options.blockJavaScript : false)
        }
      },

      pdf: {
        marginsType: options.marginsType,
        pageSize: parseIfJSON(options.format),
        printBackground: options.printBackground != null ? options.printBackground : true,
        landscape: options.landscape != null ? options.landscape : false
      }
    }).then(function (result) {
      numberOfPages = result.numberOfPages;

      /* eslint-disable no-param-reassign */
      response.meta.contentType = 'application/pdf';
      response.meta.fileExtension = 'pdf';
      response.meta.numberOfPages = numberOfPages;
      /* eslint-enable no-param-reassign */

      if (Array.isArray(result.logs)) {
        result.logs.forEach(function (msg) {
          reporter.logger[msg.level](msg.message, _extends({ timestamp: msg.timestamp.getTime() }, request));
        });
      }

      return (0, _streamToArray2.default)(result.stream);
    }).then(function (arr) {
      // eslint-disable-next-line no-param-reassign
      response.content = Buffer.concat(arr);

      reporter.logger.debug('electron-pdf recipe finished with ' + numberOfPages + ' pages generated', request);
    }));
  });
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _streamToArray = require('stream-to-array');

var _streamToArray2 = _interopRequireDefault(_streamToArray);

var _electronHtmlTo = require('electron-html-to');

var _electronHtmlTo2 = _interopRequireDefault(_electronHtmlTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseIfJSON(val) {
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
    return val;
  }

  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

module.exports = exports['default'];