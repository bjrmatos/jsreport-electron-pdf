/* global define */
/* eslint-disable no-unused-vars, no-var */

define(['jquery', 'app', 'marionette', 'backbone', 'core/view.base', './electron.template.model'],
function($, app, Marionette, Backbone, ViewBase, Model) {
  var TemplateView = ViewBase.extend({
    template: 'embed-electron-template',

    initialize: function() {
    }
  });

  app.on('extensions-menu-render', function(contextObj) {
    contextObj.result += '<li><a id="electronMenuCommand" title="define pdf document options" style="display:none"><i data-position="right" data-intro="Define basic pdf settings" class="fa fa-file-pdf-o"></i></a></li>';

    contextObj.on('after-render', function($el) {
      if (contextObj.template.get('recipe') === 'electron-pdf') {
        $('#electronMenuCommand').show();
      } else {
        $('#electronMenuCommand').hide();
      }

      $('#electronMenuCommand').click(function() {
        var model = new Model(),
            view;

        model.setTemplate(contextObj.template);

        view = new TemplateView({ model: model });
        contextObj.region.show(view, 'electron');
      });
    });

    contextObj.template.on('change:recipe', function() {
      if (contextObj.template.get('recipe') === 'electron-pdf') {
        $('#electronMenuCommand').show();
      } else {
        $('#electronMenuCommand').hide();
      }
    });
  });
});
