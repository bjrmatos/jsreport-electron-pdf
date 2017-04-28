
import path from 'path';
import main from './electron';
import config from '../jsreport.config.js';

export default function(options) {
  const newConfig = { ...config };

  newConfig.options = options;
  newConfig.main = main;
  newConfig.directory = path.join(__dirname, '../');

  return newConfig;
}
