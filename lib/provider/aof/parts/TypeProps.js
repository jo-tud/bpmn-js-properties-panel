'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    is = require('bpmn-js/lib/util/ModelUtil').is;


module.exports = function(group, element) {
  if (is(element, 'bpmn:Task')){
    // Id
    var executableEntry=entryFactory.checkbox({
      id: 'isAppEnsembleApp',
      description: 'Defines if Task is a App-Ensemble app.',
      label: 'Is App-Ensemble app?',
      modelProperty: 'aof:isAppEnsembleApp'
    });

    executableEntry.set = function (element, values) {
      var businessObject = getBusinessObject(element);

      businessObject.set(property, values[property]);
      businessObject.set('bpmn:UserTask', 'bpmn:UserTask');
      return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', values);
    };

    group.entries.push(executableEntry);
  }
};