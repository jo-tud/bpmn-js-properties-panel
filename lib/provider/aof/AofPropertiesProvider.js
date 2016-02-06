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

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };
    documentationProps(documentationGroup, element, bpmnFactory);

  return[
    aofGroup,documentationGroup
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

  this.appURLs="";

  this.getAppURLs=function() {
    /*
     var jquery = require('jquery');
     var request_data = [];

     var request = jquery.ajax("/api/appuris", {
     success: function (data, status, jqXHR) {
     data=JSON.parse(data);
     if (data.results) {
     for(var i=0;i<data.results.bindings.length;i++){
     request_data.push({name: data.results.bindings[i].label.value, value: data.results.bindings[i].uri.value})
     }
     }
     },
     method: "GET",
     async: false,
     dataType: 'json',
     timeout: 1000,
     data: '',
     error: function (jqXHR, status, error) {
     alert(status);
     }
     });
     request_data.push( {name: 'Custom URL', value: 'custom'});
     this.appURLs=request_data;
     */
  }

}



inherits(Provider, PropertiesActivator);

module.exports = Provider;
