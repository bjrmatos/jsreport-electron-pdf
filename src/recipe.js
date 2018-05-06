
import Promises from 'bluebird';
import toArray from 'stream-to-array';
import electronConvert from 'electron-html-to';

function parseIfJSON(val) {
  if (typeof val === 'object') {
    return val;
  }

  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

export default function(reporter, conversion, request, response) {
  // TODO: add support for header and footer html when electron support printing header/footer
  return new Promises((resolve) => {
    let options = request.template.electron,
        numberOfPages;

    return resolve(conversion({
      html: response.content,
      delay: options.printDelay,
      waitForJS: options.waitForJS != null ? options.waitForJS : false,
      waitForJSVarName: 'JSREPORT_READY_TO_START',
      converterPath: electronConvert.converters.PDF,

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
    }).then((result) => {
      numberOfPages = result.numberOfPages;

      /* eslint-disable no-param-reassign */
      response.meta.contentType = 'application/pdf';
      response.meta.fileExtension = 'pdf';
      response.meta.numberOfPages = numberOfPages;
      /* eslint-enable no-param-reassign */

      if (Array.isArray(result.logs)) {
        result.logs.forEach((msg) => {
          reporter.logger[msg.level](msg.message, { timestamp: msg.timestamp.getTime(), ...request });
        });
      }

      return toArray(result.stream);
    }).then((arr) => {
      // eslint-disable-next-line no-param-reassign
      response.content = Buffer.concat(arr);

      reporter.logger.debug(`electron-pdf recipe finished with ${numberOfPages} pages generated`, request);
    }));
  });
}
