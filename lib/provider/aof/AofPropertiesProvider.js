'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var     documentationProps = require('./parts/DocumentationProps'),
    aofProps = require('./parts/AofProps');

function Provider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getGroups = function(element) {

    var aofGroup={
      id: 'aof',
      label: 'AOF - Settings',
      entries: []
    };
    aofProps(aofGroup, element, bpmnFactory);

    var documentationGroup = {
      id: 'documentation',
      label: 'Documentation',
      entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return[
      aofGroup,
      documentationGroup
    ];
  };
}

inherits(Provider, PropertiesActivator);

module.exports = Provider;
