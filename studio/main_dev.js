
import ElectronPdfProperties from './ElectronPdfProperties.js';
// eslint-disable-next-line import/no-unresolved
import Studio from 'jsreport-studio';

Studio.addPropertiesComponent(
  'electron-pdf',
  ElectronPdfProperties,
  (entity) => entity.__entitySet === 'templates' && entity.recipe === 'electron-pdf'
);

Studio.addApiSpec({
  template: {
    electron: {
      landscape: true,
      format: '...',
      printBackground: true,
      width: 100,
      height: 100,
      printDelay: 1000,
      blockJavaScript: false,
      waitForJS: true
    }
  }
});
