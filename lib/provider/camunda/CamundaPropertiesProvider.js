'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('../../PropertiesActivator');

// bpmn properties
var processProps = require('../bpmn/parts/ProcessProps'),
    eventProps = require('../bpmn/parts/EventProps'),
    linkProps = require('../bpmn/parts/LinkProps'),
    documentationProps = require('../bpmn/parts/DocumentationProps'),
    idProps = require('../bpmn/parts/IdProps');

// camunda properties
var serviceTaskDelegateProps = require('./parts/ServiceTaskDelegateProps'),
    userTaskProps = require('./parts/UserTaskProps'),
    asynchronousContinuationProps = require('./parts/AsynchronousContinuationProps'),
    callActivityProps = require('./parts/CallActivityProps'),
    multiInstanceProps = require('./parts/MultiInstanceLoopProps'),
    jobRetryTimeCycle = require('./parts/JobRetryTimeCycle'),
    sequenceFlowProps = require('./parts/SequenceFlowProps'),
    executionListenerProps = require('./parts/ExecutionListenerProps'),
    scriptProps = require('./parts/ScriptTaskProps'),
    taskListenerProps = require('./parts/TaskListenerProps'),
    startEventFormKey = require('./parts/StartEventFormKey');

function createGeneralTabGroups(element, bpmnFactory, elementRegistry) {

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
  serviceTaskDelegateProps(detailsGroup, element);
  userTaskProps(detailsGroup, element);
  scriptProps(detailsGroup, element, bpmnFactory);
  linkProps(detailsGroup, element);
  callActivityProps(detailsGroup, element);
  eventProps(detailsGroup, element, bpmnFactory);
  sequenceFlowProps(detailsGroup, element, bpmnFactory);
  startEventFormKey(detailsGroup, element);

  var multiInstanceGroup = {
    id: 'multiInstance',
    label: 'Multi Instance',
    entries: []
  };
  multiInstanceProps(multiInstanceGroup, element, bpmnFactory);

  var asyncGroup = {
    id : 'asyncGroup',
    label: 'Asynchronous Continuations',
    entries : []
  };
  asynchronousContinuationProps(asyncGroup, element, bpmnFactory);
  jobRetryTimeCycle(asyncGroup, element, bpmnFactory);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };
  documentationProps(documentationGroup, element, bpmnFactory);

  return [
    generalGroup,
    detailsGroup,
    multiInstanceGroup,
    asyncGroup,
    documentationGroup
  ];

}

function createFormsTabGroups(element, bpmnFactory, elementRegistry) {
  return [
  ];
}

function createListenersTabGroups(element, bpmnFactory, elementRegistry) {

  var executionListenersGroup = {
    id : 'executionListeners',
    label: 'Execution Listeners',
    entries: []
  };
  executionListenerProps(executionListenersGroup, element, bpmnFactory);

  var taskListenersGroup = {
    id : 'taskListeners',
    label: 'Task Listeners',
    entries: []
  };
  taskListenerProps(taskListenersGroup, element, bpmnFactory);

  return [
    executionListenersGroup,
    taskListenersGroup
  ];
}


function DefaultPropertiesProvider(eventBus, bpmnFactory, elementRegistry) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry)
    };

    var formsTab = {
      id: 'forms',
      label: 'Forms',
      groups: createFormsTabGroups(element, bpmnFactory, elementRegistry)
    };


    var listenersTab = {
      id: 'listeners',
      label: 'Listeners',
      groups: createListenersTabGroups(element, bpmnFactory, elementRegistry)
    };

    return [
      generalTab,
      formsTab,
      listenersTab
    ];
  };

}

inherits(DefaultPropertiesProvider, PropertiesActivator);

module.exports = DefaultPropertiesProvider;
