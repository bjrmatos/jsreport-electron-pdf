/* global define */
/* eslint-disable no-unused-vars, no-var */

define(['jquery', 'app', 'marionette', 'backbone', './electron.template.view', './electron.template.model'],
function($, app, Marionette, Backbone, TemplateView, Model) {
  app.on('template-extensions-render', function(contextObj) {
    var view;

    function renderRecipeMenu() {
      var model;

      if (contextObj.template.get('recipe') === 'electron-pdf') {
        model = new Model();
        model.setTemplate(contextObj.template);
        view = new TemplateView({ model: model });

        contextObj.extensionsRegion.show(view, 'electron');
      } else {
        if (view != null) {
          $(view.el).remove();
        }
      }
    }

    renderRecipeMenu();

    contextObj.template.on('change:recipe', function() {
      renderRecipeMenu();
    });
  });
});
