'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var processProps = require('./parts/ProcessProps'),
    eventProps = require('./parts/EventProps'),
    linkProps = require('./parts/LinkProps'),
    documentationProps = require('./parts/DocumentationProps'),
    idProps = require('./parts/IdProps');

function Provider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getGroups = function(element) {

    var generalGroup = {
      id: 'general',
      label: 'General',
      entries: []
    };
    idProps(generalGroup, element, elementRegistry);
    processProps(generalGroup, element);

    var detailsGroup = {
      id: 'details',
      label: 'Details',
      entries: []
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory);

    var aofGroup={
      id: 'aof',
      label: 'AOF - Settings',
      entries: []
    };
    documentationProps(aofGroup, element, bpmnFactory);

    var documentationGroup = {
      id: 'documentation',
      label: 'Documentation',
      entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return[
      generalGroup,
      detailsGroup,
      aofGroup,
      documentationGroup
    ];
  };
}

inherits(Provider, PropertiesActivator);

module.exports = Provider;
