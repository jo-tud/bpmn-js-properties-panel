'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('../../../helper/CmdHelper');


module.exports = function(group, element, bpmnFactory) {

    // Documentation
    var entry = entryFactory.selectBoxField({
        id: 'realizedBy',
        description: '',
        label: 'Realized By',
        modelProperty: 'realizedBy',
        selectOptions:[ { name: '1', value: '1' },{ name: '2', value: '2' }]
    });

    entry.set = function(element, values) {
        var businessObject = getBusinessObject(element),
            newObjectList = [];

        if (typeof values.realizedBy !== 'undefined' && values.realizedBy !== '') {
            newObjectList.push(bpmnFactory.create('aof:realizedBy', {
                text: values.realizedBy
            }));
        }

        return cmdHelper.setList(element, businessObject, 'realizedBy', newObjectList);
    };

    entry.get = function(element) {
        var businessObject = getBusinessObject(element),
            documentations = businessObject.get('aof:realizedBy'),
            text = (documentations.length > 0) ? documentations[0].text : '';

        return { realizedBy: text };
    };

    group.entries.push(entry);
};