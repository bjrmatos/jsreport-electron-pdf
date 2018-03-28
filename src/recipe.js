
import Promises from 'bluebird';
import toArray from 'stream-to-array';
import electronConvert from 'electron-html-to';

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
      delay: numberOrUndefined(options.printDelay),
      waitForJS: parseBoolean(options.waitForJS, false),
      waitForJSVarName: 'JSREPORT_READY_TO_START',
      converterPath: electronConvert.converters.PDF,

      browserWindow: {
        width: numberOrUndefined(options.width),
        height: numberOrUndefined(options.height),
        webPreferences: {
          javascript: !parseBoolean(options.blockJavaScript, false)
        }
      },

      pdf: {
        marginsType: numberOrUndefined(options.marginsType),
        pageSize: parseIfJSON(options.format),
        printBackground: parseBoolean(options.printBackground, true),
        landscape: parseBoolean(options.landscape, false)
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
