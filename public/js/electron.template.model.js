/* global define */
/* eslint-disable no-unused-vars, no-var */

define(['app', 'core/basicModel', 'underscore'], function(app, ModelBase, _) {
  function numberOrUndefined(param) {
    if (!isNaN(param)) {
      return Number(param);
    }

    return undefined;
  }

  function parseBoolean(param, defaultValue) {
    if (param === true || param === 'true') {
      return true;
    } else if (param === false || param === 'false') {
      return false;
    }

    return defaultValue;
  }

  return ModelBase.extend({
    setTemplate: function(templateModel) {
      this.templateModel = templateModel;

      if (templateModel.get('electron')) {
        if (templateModel.get('electron').isModel) {
          this.set(templateModel.get('electron').toJSON());
        } else {
          this.set(templateModel.get('electron'));
        }
      }

      templateModel.set('electron', this, { silent: true });

      if (this.get('marginsType') == null) {
        this.set('marginsType', 0);
        this.set('marginsTypeText', 'Default');
      }

      if (this.get('landscape') == null) {
        this.set('landscape', false);
        this.set('orientationText', 'portrait');
      }

      if (this.get('format') == null) {
        this.set('format', 'A4');
      }

      if (this.get('printBackground') == null) {
        this.set('printBackground', true);
      }

      this.listenTo(this, 'change', function() {
        templateModel.trigger('change');
      });

      this.listenTo(templateModel, 'api-overrides', this.apiOverride);
    },

    isDirty: function() {
      return String(this.get('marginsType')) !== '0' || this.get('width') != null || this.get('height') != null ||
          String(this.get('printBackground')) !== 'true' || String(this.get('landscape')) !== 'false' || this.get('format') !== 'A4' ||
          this.get('waitForJS') != null || this.get('printDelay') != null || this.get('blockJavaScript');
    },

    apiOverride: function(req) {
      var electronApi = {};

      if (numberOrUndefined(this.get('marginsType')) !== undefined) {
        electronApi.marginsType = numberOrUndefined(this.get('marginsType'));
      }

      if (this.get('format') != null) {
        electronApi.format = this.get('format');
      }

      electronApi.landscape = parseBoolean(this.get('landscape'), false);
      electronApi.printBackground = parseBoolean(this.get('printBackground'), true);

      if (numberOrUndefined(this.get('width')) !== undefined) {
        electronApi.width = numberOrUndefined(this.get('width'));
      }

      if (numberOrUndefined(this.get('height')) !== undefined) {
        electronApi.height = numberOrUndefined(this.get('height'));
      }

      if (numberOrUndefined(this.get('printDelay')) !== undefined) {
        electronApi.printDelay = numberOrUndefined(this.get('printDelay'));
      }

      if (this.get('waitForJS') != null) {
        electronApi.waitForJS = parseBoolean(this.get('waitForJS'), false);
      }

      if (this.get('blockJavaScript') != null) {
        electronApi.blockJavaScript = parseBoolean(this.get('blockJavaScript'), false);
      }

      req.template.electron = electronApi;
    }
  });
});
