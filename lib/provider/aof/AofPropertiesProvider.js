'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var documentationProps = require('./parts/DocumentationProps'),
    realizedByProps = require('./parts/RealizedByProps'),
    nameProps = require('./parts/NameProps'),
    typeProps= require('./parts/TypeProps'),
    jquery = require('jquery');


function createGeneralTabGroups(element, bpmnFactory, elementRegistry, eventBus, appManager) {

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
  realizedByProps(aofGroup, element, eventBus, appManager);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, appManager);

  return[
    nameGroup,
    aofGroup,
    documentationGroup
  ];

}


function Provider(eventBus, bpmnFactory, elementRegistry, appManager) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry,eventBus, appManager)
    };

    return [
      generalTab
    ];
  };
}



inherits(Provider, PropertiesActivator);

Provider.$inject = ['eventBus','bpmnFactory','elementRegistry','appManager' ];

module.exports = Provider;
