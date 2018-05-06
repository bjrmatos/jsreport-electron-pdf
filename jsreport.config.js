
const electronSchema = {
  type: 'object',
  properties: {
    strategy: {
      type: 'string',
      enum: ['dedicated-process', 'electron-ipc', 'electron-server'],
      default: 'dedicated-process'
    },
    numberOfWorkers: { type: 'number' },
    pingTimeout: { type: 'number' },
    timeout: { type: 'number' },
    portLeftBoundary: { type: 'number' },
    portRightBoundary: { type: 'number' },
    host: { type: 'string' },
    chromeComandLineSwitches: { type: 'object' },
    allowLocalFilesAccess: { type: 'boolean' },
    maxLogEntrySize: { type: 'number' }
  }
};

module.exports = {
  name: 'electron-pdf',
  main: 'lib/electron.js',
  dependencies: ['templates'],
  optionsSchema: {
    electron: { ...electronSchema },
    extensions: {
      'electron-pdf': { ...electronSchema }
    }
  },
  embeddedSupport: true
};
