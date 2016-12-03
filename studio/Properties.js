
import React, { Component } from 'react';
import Studio from 'jsreport-studio';

export default class Properties extends Component {
  render () {
    const { entity, onChange } = this.props;
    const electron = entity.electron || {};

    const change = (change) => onChange(Object.assign({}, entity, { electron: Object.assign({}, entity.electron, change) }));

    return (
      <div className="properties-section">
        <div className="form-group"><label>Margin type</label>
          <select value={electron.marginsType || 0} onChange={(v) => change({marginsType: parseInt(v.target.value)})}>
            <option key="0" value="0">Default</option>
            <option key="1" value="1">None</option>
            <option key="2" value="2">Minimum</option>
          </select>
        </div>
        <div className="form-group"><label>Paper format</label>
          <select value={electron.format || ''} onChange={(v) => change({format: v.target.value})}>
            <option key="A4" value="A4">A4</option>
            <option key="A3" value="A3">A3</option>
            <option key="Legal" value="Legal">Legal</option>
            <option key="Letter" value="Letter">Letter</option>
            <option key="Tabloid" value="Tabloid">Tabloid</option>
          </select>
        </div>
        <div className="form-group"><label>Web Page width</label>
          <input
            type="text" placeholder="600" value={electron.width || ''}
            onChange={(v) => change({width: v.target.value})} />
        </div>
        <div className="form-group"><label>Web Page height</label>
          <input
            type="text" placeholder="600" value={electron.height || ''}
            onChange={(v) => change({height: v.target.value})} />
        </div>
        <div className="form-group"><label>Orientation</label>
          <select value={electron.landscape + ""} onChange={(v) => change({landscape: v.target.value === 'true'})}>
            <option key="false" value="false">Portrait</option>
            <option key="true" value="true">Landscape</option>
          </select>
        </div>
        <div className="form-group"><label>Print background</label>
          <input
            type="checkbox" checked={electron.printBackground === true}
            onChange={(v) => change({printBackground: v.target.checked})} />
        </div>

        <div className="form-group"><label>Print delay</label>
          <input
            type="text" placeholder="800" value={electron.printDelay || ""}
            onChange={(v) => change({printDelay: v.target.value})} />
        </div>
        <div className="form-group">
          <label title="window.JSREPORT_READY_TO_START=true;">Wait for printing trigger</label>
          <input
            type="checkbox" title="window.JSREPORT_READY_TO_START=true;" checked={electron.waitForJS === true}
            onChange={(v) => change({waitForJS: v.target.checked})} />
        </div>
        <div className="form-group">
          <label>Block javascript</label>
          <input
            type="checkbox" checked={electron.blockJavaScript === true}
            onChange={(v) => change({blockJavaScript: v.target.checked})} />
        </div>
      </div>
    )
  }
}
