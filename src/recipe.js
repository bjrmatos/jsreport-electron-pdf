
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

export default function(conversion, request, response) {
  // TODO: add support for header and footer html when electron support printing header/footer
  return new Promises((resolve) => {
    let options = request.template.electron;

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
        pageSize: options.format,
        printBackground: parseBoolean(options.printBackground, true),
        landscape: parseBoolean(options.landscape, false)
      }
    }).then((result) => {
      /* eslint-disable no-param-reassign */
      response.headers['Content-Type'] = 'application/pdf';
      response.headers['Content-Disposition'] = 'inline; filename="report.pdf"';
      response.headers['File-Extension'] = 'pdf';
      response.headers['Number-Of-Pages'] = result.numberOfPages;
      /* eslint-enable no-param-reassign */

      if (Array.isArray(result.logs)) {
        result.logs.forEach((msg) => {
          request.logger[msg.level](msg.message, { timestamp: msg.timestamp });
        });
      }

      return toArray(result.stream);
    }).then((arr) => {
      // eslint-disable-next-line no-param-reassign
      response.content = Buffer.concat(arr);

      request.logger.debug(`electron-pdf recipe finished with ${response.numberOfPages} pages generated`);
    }));
  });
}
