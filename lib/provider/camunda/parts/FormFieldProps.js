'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    forEach = require('lodash/collection/forEach'),
    domQuery = require('min-dom/lib/query'),
    domify = require('min-dom/lib/domify'),
    elementHelper = require('../../../helper/ElementHelper'),
    cmdHelper = require('../../../helper/CmdHelper'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;


function createFormFieldTemplate(id) {
  return '<div class="djs-form-field-area" data-scope>' +
         '<button data-action="removeFormField"><span>X</span></button>' +
         '<button data-action="editFormField"><span>Edit</span></button>' +

         '<div class="pp-row">' +
            '<label for="cam-form-field-id-'+id+'">Id</label>' +
            '<div class="field-wrapper">' +
              '<input id="cam-form-field-id-'+id+'" type="text" name="formFieldId" />' +
              '<button data-action="clearFormFieldId" data-show="canClearFormFieldId">' +
                '<span>X</span>' +
              '</button>' +
            '</div>' +
         '</div>' +

         '<div class="pp-row">' +
            '<label for="cam-form-field-label-'+id+'">Label</label>' +
            '<div class="field-wrapper">' +
              '<input id="cam-form-field-label-'+id+'" type="text" name="formFieldLabel" />' +
              '<button data-action="clearFormFieldLabel" data-show="canClearFormFieldLabel">' +
                '<span>X</span>' +
              '</button>' +
            '</div>' +
         '</div>';
}

function getItem(element, bo) {
  var boId = bo.get('id'),
      boLabel = bo.get('label');

  var values = {};

    values.formFieldId = boId;
    values.formFieldLabel = boLabel;

  return values;
}

function setEmpty(update) {
  update.label = undefined;
}

function createFormField(element, values, formData, formFieldList, bpmnFactory) {
  // add form data with form field values to extension elements values
  forEach(values, function(value) {
    var update = {};
    setEmpty(update);

    var formField = elementHelper.createElement('camunda:FormField',
                                                     update, formData, bpmnFactory);

    formField.id = value.formFieldId;
    formField.label = value.formFieldLabel;

    formFieldList.push(formField);
  });

}


module.exports = function(group, element, bpmnFactory) {

  var bo;
  var lastIdx = 0;

  if(is(element, 'bpmn:StartEvent') || (is(element, 'bpmn:UserTask'))) {
    bo = getBusinessObject(element);
  }

  if (!bo) {
    return;
  }

  group.entries.push({
    'id': 'formFields',
    'description': 'Configure form field properties.',
    label: 'Form Fields',
    'html': '<div class="cam-add-form-field">' +
              '<label for="addFormField">Add Form Field </label>' +
              '<button id="addFormField" data-action="addFormField"><span>+</span></button>' +
            '</div>' +
            '<div data-list-entry-container></div>',

    createListEntryTemplate: function(value, idx) {
      lastIdx = idx;
      return createFormFieldTemplate(idx);
    },            

    get: function (element, propertyName) {
      var values = [];

      if (bo.extensionElements) {
        var extensionElementsValues = getBusinessObject(element).extensionElements.values;
        forEach(extensionElementsValues, function(extensionElement) {
          if (typeof extensionElement.$instanceOf === 'function' && is(extensionElement, 'camunda:FormData')) {
            if (extensionElement.fields) {
              forEach(extensionElement.fields, function(formField) {
                values.push(getItem(element, formField));
              });
            }
          }
        });
      }

      return values;
    },

    set: function (element, values, containerElement) {
      var cmd;

      var extensionElements = bo.extensionElements;
      var formData;
      var isExtensionElementsNew = false;

      if (!extensionElements) {
        isExtensionElementsNew = true;
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements',
                                                        { values: [] }, bo, bpmnFactory);

      }

      if (isExtensionElementsNew) {
        formData = elementHelper.createElement('camunda:FormData',
                                                        { fields: [] }, extensionElements, bpmnFactory);

        var formFields = formData.get('fields');
        createFormField(element, values, formData, formFields, bpmnFactory);

        cmd = {
          extensionElements: extensionElements
        };

      } else {
        var isFormDataNew = true;

        forEach(extensionElements.values, function(extensionValue) {
          if (is(extensionValue, 'camunda:FormData')) {
            isFormDataNew = false;
            formData = extensionValue;
          }
        });

        if (isFormDataNew) {
          formData = elementHelper.createElement('camunda:FormData',
                                                      { fields: [] }, extensionElements, bpmnFactory);
        }

        // remove all existing form fields
        var objectsToRemove = [];
        forEach(extensionElements.get('values'), function(extensionElement) {
          if (is(extensionElement, 'camunda:FormData')) {
            if (extensionElement.fields) {
              forEach(extensionElement.fields, function(formField) {
                objectsToRemove.push(formField);
              });
            }
          }
        });

        // add all the form fields
        var objectsToAdd = [];
        createFormField(element, values, formData, objectsToAdd, bpmnFactory);

        cmd = cmdHelper.addAndRemoveElementsFromList(element, formData, 'fields',
                                                      objectsToAdd, objectsToRemove);

      }

      return cmd;

    },

    addFormField: function(element, inputNode) {
      var listenerContainer = domQuery('[data-list-entry-container]', inputNode);
      lastIdx++;
      var template = domify(createFormFieldTemplate(lastIdx));
      listenerContainer.appendChild(template);
      return true;
    },

    removeFormField: function(element, entryNode, btnNode, scopeNode) {
      scopeNode.parentElement.removeChild(scopeNode);
      return true;
    },

    validateListItem: function(element, values) {
      var validationResult = {};

      if(!values.formFieldId) {
        validationResult.formFieldId = "Must provide a value";
      }

      return validationResult;
    },    

    clearFormFieldId:  function(element, entryNode, btnNode, scopeNode) {
      var input = domQuery('input[name=formFieldId]', scopeNode);
      input.value = '';
      return true;
    },

    canClearFormFieldId: function(element, entryNode, btnNode, scopeNode) {
      var input = domQuery('input[name=formFieldId]', scopeNode);
      return input.value !== '';
    },

    clearFormFieldLabel:  function(element, entryNode, btnNode, scopeNode) {
      var input = domQuery('input[name=formFieldLabel]', scopeNode);
      input.value = '';
      return true;
    },

    canClearFormFieldLabel: function(element, entryNode, btnNode, scopeNode) {
      var input = domQuery('input[name=formFieldLabel]', scopeNode);
      return input.value !== '';
    },

    cssClasses: ['textfield']

  });

};
