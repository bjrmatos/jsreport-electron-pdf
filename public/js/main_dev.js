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

        //wait until phantom-pdf or potentially other view unbinds from extensions menu
        //otherwise binding electron.width won't apply because phantom.width is still taking place
        setTimeout(function() {
          contextObj.extensionsRegion.show(view, 'electron');
        }, 0);
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
