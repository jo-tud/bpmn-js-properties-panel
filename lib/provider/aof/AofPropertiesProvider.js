'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var documentationProps = require('./parts/DocumentationProps'),
    realizedByProps = require('./parts/RealizedByProps'),
    nameProps = require('./parts/NameProps');

function Provider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getGroups = function(element) {

    var nameGroup={
      id: 'general',
      label: 'General',
      entries: []
    };
    nameProps(nameGroup, element);

    var aofGroup={
      id: 'aof',
      label: 'AOF - Settings',
      entries: []
    };
    realizedByProps(aofGroup, element, bpmnFactory, eventBus);

    var documentationGroup = {
      id: 'documentation',
      label: 'Documentation',
      entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return[
      nameGroup,
      aofGroup,
      documentationGroup
    ];
  };
}

inherits(Provider, PropertiesActivator);

module.exports = Provider;
