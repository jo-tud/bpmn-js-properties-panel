'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    is = require('bpmn-js/lib/util/ModelUtil').is;


module.exports = function(group, element) {
  if (is(element, 'bpmn:Task') || is(element, 'bpmn:Participant')){
    // Id
    group.entries.push(entryFactory.textField({
      id: 'name',
      description: 'Name of this UserTask',
      label: 'Name',
      modelProperty: 'name'
    }));
  }
};