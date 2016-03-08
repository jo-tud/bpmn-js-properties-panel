'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

var documentationProps = require('./parts/DocumentationProps'),
    realizedByProps = require('./parts/RealizedByProps'),
    nameProps = require('./parts/NameProps'),
    typeProps= require('./parts/TypeProps'),
    jquery = require('jquery');


function createGeneralTabGroups(element, bpmnFactory, elementRegistry, eventBus) {

  var nameGroup={
    id: 'general',
    label: 'General',
    entries: []
  };
  nameProps(nameGroup, element);
/*
    var typeGroup ={
        id:'type',
        label:'Type',
        entries:[]
    }
    typeProps(typeGroup, element); */

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory);

  return[
    nameGroup,
      //typeGroup,
    documentationGroup
  ];

}

function createAOFTabGroups(element, bpmnFactory, elementRegistry, eventBus) {

  var aofGroup={
    id: 'aof',
    label: 'AOF - Settings',
    entries: []
  };
  realizedByProps(aofGroup, element, eventBus);

  return[
    aofGroup
  ];

}

function Provider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry,eventBus)
    };

    var aofTab = {
      id: 'aof',
      label: 'Orchestration',
      groups: createAOFTabGroups(element, bpmnFactory, elementRegistry,eventBus)
    };

    return [
      generalTab,aofTab
    ];
  };
}



inherits(Provider, PropertiesActivator);

module.exports = Provider;
