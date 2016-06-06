
import path from 'path';
import jsreport from 'jsreport-core';

/* eslint-disable prefer-arrow-callback */
describe('electron pdf', function() {
  let reporter;

  beforeEach((done) => {
    reporter = new jsreport.Reporter({
      rootDirectory: path.join(__dirname, '../')
    });

    reporter.init().then(function() {
      done();
    }).catch(done);
  });

  it('should not fail when rendering', function(done) {
    const request = {
      template: { content: 'Heyx', recipe: 'electron-pdf', engine: 'none' }
    };

    reporter.render(request, {}).then(() => {
      done();
    }).catch(done);
  });
});
