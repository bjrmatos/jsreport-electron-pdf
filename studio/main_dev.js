
import Properties from './Properties.js';
import Studio from 'jsreport-studio';

Studio.addPropertiesComponent(
  'electron-pdf',
  Properties,
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
