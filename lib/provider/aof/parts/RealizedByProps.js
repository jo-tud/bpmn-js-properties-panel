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



function RealizedByProps(group, element, eventBus,appManager) {

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

            var request_data = appManager.list()

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

                var link = domQuery('a[id="realizedByLink"');
                link.href=appManager.getInfoUri(res[comboEntry.modelProperty]);

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
            hideLink: function(element, node) {
                var link = domQuery('a', node);
                link.textContent = 'App-Info';
                link.id="realizedByLink";
                link.target="_blank";
                domClasses(link).remove('pp-error-message');
                if(link.href=="custom" || link.href=="" || link.href==link.baseURI) return true;
                else return false;
            }
        });

        group.entries.push(entry);


// TODO: Make custom element possible
    }
};

module.exports = RealizedByProps;