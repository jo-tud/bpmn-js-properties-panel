'use strict';

var entryFactory = require('../../../factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('../../../helper/CmdHelper'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    jquery = require('jquery'),
    formHelper = require('../../../helper/FormHelper');

var domQuery   = require('min-dom/lib/query'),
    domClosest = require('min-dom/lib/closest'),
    domClasses = require('min-dom/lib/classes'),
    URLHelper=require('../helper/URLHelper');

//var SPACE_REGEX = /\s/;

// for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
//var QNAME_REGEX = /^[a-z][\w0-9-]*(:[a-z][\w0-9-]*)?$/i;

/**
 * Return the currently selected form field querying the form field select box
 * from the DOM.
 *
 * @param  {djs.model.Base} element
 * @param  {DOMElement} node - DOM element of any form field text input
 *
 * @return {ModdleElement} the currently selected form field
 */



module.exports = function(group, element, eventBus) {

    function getSelectedFormField(element, node) {
        var selected = comboEntry.getSelected(element, node.parentNode);

        if (selected.idx === -1) {
            return;
        }

        return formHelper.getFormField(element, selected.idx);
    }

    function getSelected(node, id) {
        var selectBox = getSelectBox(node, id);
        return {
            value: (selectBox || {}).value,
            idx: (selectBox || {}).selectedIndex
        };
    }


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




        var comboEntry = entryFactory.comboBox({
            id: 'realizedBy',
            description: 'App which realized this UserTask',
            label: 'Realized by following App',
            modelProperty: 'aof:realizedBy',
            selectOptions: request_data,
            customName:'Custom URL',
            customValue:'',
            get: function(element, node) {
                var bo = getBusinessObject(element),
                res = {};

                res[comboEntry.modelProperty] = bo.get(comboEntry.modelProperty);

                return res;
            },
            set: function(element, values, node) {
                var res = {};

                res[comboEntry.modelProperty] = values[comboEntry.modelProperty];

                return cmdHelper.updateProperties(element, res);
            },
            validate: function(element, values) {
                var validationResult = {};

                if(!!values['custom-'+this.modelProperty] && !URLHelper.validate(values['custom-'+this.modelProperty])) {
                    validationResult[this.modelProperty] = "URL is not valid!";
                }
                return validationResult;
            }
        });


        group.entries.push(comboEntry);

        var entry = entryFactory.link({
            id: 'realizedByLink',
            label: 'URL',
            getClickableElement: function(element, node) {
                var panel = domClosest(node, 'div.djs-properties-panel');
                return domQuery('a[href="/app-ensembles.html"]', panel);
            },
            hideLink: function(element, node) {
                var link = domQuery('a', node);
                link.innerHTML = link.textContent = 'aaa';
                domClasses(link).remove('pp-error-message');
                return false;
                if (Math.random() < 0.5) {

                    return false;
                }
                return true;
            }
        });

        group.entries.push(entry);


// TODO: Make custom element possible
    }
};