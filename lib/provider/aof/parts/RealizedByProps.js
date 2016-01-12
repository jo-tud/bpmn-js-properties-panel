'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('../../../helper/CmdHelper'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    jquery = require('jquery');

//var SPACE_REGEX = /\s/;

// for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
//var QNAME_REGEX = /^[a-z][\w0-9-]*(:[a-z][\w0-9-]*)?$/i;

module.exports = function(group, element, eventBus) {
    var businessObject = getBusinessObject(element)
    if (is(element, 'bpmn:UserTask') && businessObject.isAppEnsembleApp == true ) {

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
        //request_data.push( {name: 'Custom URL', value: 'custom'});




        var entry = entryFactory.selectBox({
            id: 'realizedBy',
            description: 'App which realized this UserTask',
            label: 'Realized by following App',
            modelProperty: 'aof:realizedBy',
            selectOptions: request_data
        });

        //entry.set = function(element, values) {
            //eventBus.fire('element.updateProperties'); TODO need commandstack for this
        //};

        group.entries.push(entry);

// TODO: Make custom element possible
    }
};