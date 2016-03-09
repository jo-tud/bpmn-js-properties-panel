# bpmn-js-properties-panel fork for usage with bpmn-js-aof modul

Original [bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel)

## Features

The properties panel is customized to the AOF usage.

Some of the features are:

* Show Assigned App and corresponding information


## Usage

use this with the [bpmn-js-aof](https://github.com/korbinianHoerfurter/bpmn-js-aof) module
Provide two HTML elements, one for the properties panel and one for the BPMN diagram:

```html
<div class="modeler">
  <div id="canvas"></div>
  <div id="properties"></div>
</div>
```

Bootstrap [bpmn-js](https://github.com/bpmn-io/bpmn-js) with the properties panel and a [properties provider](https://github.com/korbinianHoerfurter/bpmn-js-properties-panel):

```javascript
var BpmnJS = require('bpmn-js/lib/Modeler'),
    propertiesPanelModule = require('bpmn-js-properties-panel'),
    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/aof');

var bpmnJS = new BpmnJS({
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  }
});
```

## License

MIT