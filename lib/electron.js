'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (reporter, definition) {
  // eslint-disable-next-line no-param-reassign
  definition.options = Object.assign({}, reporter.options.electron, definition.options);

  // eslint-disable-next-line no-param-reassign
  definition.options.strategy = definition.options.strategy || 'dedicated-process';
  // eslint-disable-next-line no-param-reassign
  definition.options.tmpDir = reporter.options.tempAutoCleanupDirectory;

  var timeoutProp = void 0;

  if (definition.options.timeout != null) {
    if (reporter.options.electron && reporter.options.electron.timeout != null) {
      timeoutProp = 'electron.timeout';
    } else {
      timeoutProp = 'extensions.electron-pdf.timeout';
    }
  }

  if (definition.options.timeout != null && reporter.options.reportTimeout != null) {
    reporter.logger.warn('"' + timeoutProp + '" configuration is ignored when "reportTimeout" is set');
  } else if (definition.options.timeout != null) {
    // eslint-disable-next-line max-len
    reporter.logger.warn('"' + timeoutProp + '" configuration is deprecated and will be removed in the future, please use "reportTimeout" instead');
  }

  // eslint-disable-next-line no-param-reassign
  reporter[definition.name] = new Electron(reporter, definition);
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash.pickby');

var _lodash2 = _interopRequireDefault(_lodash);

var _electronHtmlTo = require('electron-html-to');

var _electronHtmlTo2 = _interopRequireDefault(_electronHtmlTo);

var _recipe = require('./recipe');

var _recipe2 = _interopRequireDefault(_recipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Electron = function () {
  function Electron(reporter, definition) {
    _classCallCheck(this, Electron);

    var _definition$options = definition.options,
        strategy = _definition$options.strategy,
        numberOfWorkers = _definition$options.numberOfWorkers,
        pingTimeout = _definition$options.pingTimeout,
        timeout = _definition$options.timeout,
        tmpDir = _definition$options.tmpDir,
        portLeftBoundary = _definition$options.portLeftBoundary,
        portRightBoundary = _definition$options.portRightBoundary,
        host = _definition$options.host,
        chromeCommandLineSwitches = _definition$options.chromeCommandLineSwitches,
        maxLogEntrySize = _definition$options.maxLogEntrySize;


    var convertOptions = {
      strategy: strategy,
      numberOfWorkers: numberOfWorkers,
      pingTimeout: pingTimeout,
      timeout: timeout,
      tmpDir: tmpDir,
      portLeftBoundary: portLeftBoundary,
      portRightBoundary: portRightBoundary,
      host: host,
      chromeCommandLineSwitches: chromeCommandLineSwitches,
      maxLogEntrySize: maxLogEntrySize
    };

    var shouldAccessLocalFiles = void 0;

    // filter undefined options
    convertOptions = (0, _lodash2.default)(convertOptions, function (val) {
      return val !== undefined;
    });

    this.reporter = reporter;
    this.definition = definition;

    reporter.extensionsManager.recipes.push({
      name: 'electron-pdf',
      execute: Electron.prototype.execute.bind(this)
    });

    reporter.documentStore.registerComplexType('ElectronType', {
      marginsType: { type: 'Edm.Int32' },
      // header: { type: 'Edm.String', document: { extension: 'html', engine: true } },
      // headerHeight: { type: 'Edm.String' },
      // footer: { type: 'Edm.String', document: { extension: 'html', engine: true } },
      // footerHeight: { type: 'Edm.String' },
      landscape: { type: 'Edm.Boolean' },
      format: { type: 'Edm.String' },
      printBackground: { type: 'Edm.Boolean' },
      width: { type: 'Edm.Int32' },
      height: { type: 'Edm.Int32' },
      printDelay: { type: 'Edm.Int32' },
      blockJavaScript: { type: 'Edm.Boolean' },
      waitForJS: { type: 'Edm.Boolean' }
    });

    if (reporter.documentStore.model.entityTypes.TemplateType) {
      // eslint-disable-next-line no-param-reassign
      reporter.documentStore.model.entityTypes.TemplateType.electron = {
        type: 'jsreport.ElectronType'
      };
    }

    shouldAccessLocalFiles = definition.options.hasOwnProperty('allowLocalFilesAccess') ? definition.options.allowLocalFilesAccess : false;

    if (!reporter.__electron_html_to__) {
      // eslint-disable-next-line no-param-reassign
      reporter.__electron_html_to__ = _bluebird2.default.promisify((0, _electronHtmlTo2.default)(_extends({}, convertOptions, {
        allowLocalFilesAccess: shouldAccessLocalFiles
      })));
    }
  }

  _createClass(Electron, [{
    key: 'execute',
    value: function execute(request, response) {
      // eslint-disable-next-line no-param-reassign
      request.template.electron = request.template.electron || {};
      // eslint-disable-next-line no-param-reassign
      request.template.electron.timeout = this.reporter.getAvailableRenderTimeout(request, this.definition.options.timeout);

      this.reporter.logger.debug('Electron Pdf recipe start.');

      return (0, _recipe2.default)(this.reporter, this.reporter.__electron_html_to__, request, response);
    }
  }]);

  return Electron;
}();

module.exports = exports['default'];