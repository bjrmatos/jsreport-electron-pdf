
import Promises from 'bluebird';
import pick from 'lodash.pick';
import electronConvert from 'electron-html-to';
import recipe from './recipe';

class Electron {
  constructor(reporter, definition) {
    let {
      strategy,
      numberOfWorkers,
      timeout,
      tmpDir
    } = definition.options;

    let convertOptions = {
      strategy,
      numberOfWorkers,
      timeout,
      tmpDir
    };

    // filter undefined options
    convertOptions = pick(convertOptions, (val) => {
      return val !== undefined;
    });

    this.reporter = reporter;

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
      reporter.documentStore.model.entityTypes.TemplateType.electron = {
        type: 'jsreport.ElectronType'
      };
    }

    if (!reporter.__electron_html_to__) {
      reporter.__electron_html_to__ = Promises.promisify(electronConvert({
        ...convertOptions,
        allowLocalFilesAccess: definition.options.hasOwnProperty('allowLocalFilesAccess') ? definition.options.allowLocalFilesAccess : false
      }));
    }
  }

  execute(request, response) {
    request.template.electron = request.template.electron || {};

    this.reporter.logger.debug('Electron Pdf recipe start.');

    request.template.recipe = 'html';

    return recipe(this.reporter.__electron_html_to__, request, response);
  }
}

export default function(reporter, definition) {
  if (!Object.keys(definition.options).length) {
    definition.options = reporter.options.electron || {};
  }

  definition.options.strategy = definition.options.strategy || 'dedicated-process';
  definition.options.tmpDir = reporter.options.tempDirectory;

  reporter[definition.name] = new Electron(reporter, definition);
}
