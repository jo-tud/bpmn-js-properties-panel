'use strict';

var domQuery = require('min-dom/lib/query'),
    entryFactory = require('../../../../factory/EntryFactory'),
    forEach = require('lodash/collection/forEach'),
    domAttr = require('min-dom/lib/attr'),
    domClasses = require('min-dom/lib/classes'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    cmdHelper = require('../../../../helper/CmdHelper'),
    domify = require('min-dom/lib/domify'),
    indexBy = require('lodash/collection/indexBy'),

    utils = require('../../../../Utils');


function refreshOptionsModel(businessObject, referencedType) {
  var model = [];
  var referableObjects = utils.findRootElementsByType(businessObject, referencedType);
  forEach(referableObjects, function(obj) {
    model.push({
      value: obj.id,
      name: obj.name
    });
  });
  return model;
};

function updateOptionsDropDown(businessObject, referencedType, entryNode) {
  var options = refreshOptionsModel(businessObject, referencedType)
  var selectBox = domQuery('select[name=messages]', entryNode);
  utils.removeAllChildren(selectBox);
  forEach(options, function(option){
    var optionEnttry = domify('<option value="' + option.value + '">' + option.name + '</option>');
    selectBox.appendChild(optionEnttry);
  });
  addEmptyParameter(selectBox);
  return options;
};

function addEmptyParameter(selectBox) {
  return selectBox.appendChild(domify('<option value=""></option>'));
};

function selectOptionById(options, id) {
  var selectedOption = indexBy(options, 'value')[id];
  return selectedOption ? selectedOption.label : '';
};

function createMessageNameTemplate(entryNode, dataShow) {
  var messageNameTemplate = domify('<div class="pp-row" data-show="' + dataShow + '">' +
          '<label for="camunda-message-name">Message Name</label>' +
          '<div class="field-wrapper">' +
            '<input id="camunda-message-name" type="text" name="messageName" />' +
            '<button data-action="clear" data-show="canClear">' +
              '<span>X</span>' +
            '</button>' +
          '</div>' +
        '</div>');

  var messageEntry = domQuery('[data-entry=messages]', entryNode.parentElement);
  var messageNameInput = domQuery('label[for=camunda-message-name]', messageEntry);
  if (messageNameInput) {
    messageEntry.removeChild(messageNameInput.parentElement);
  }
  messageEntry.appendChild(messageNameTemplate);
}


function MessageEventDefinition(group, element, bpmnFactory, messageEventDefinition) {
  group.entries.push({
    'id': 'messages',
    'description': 'Show, create and configure messages',
    label: 'Messages',
    'html': '<label for="camunda-messages">Messages</label>' +
            '<div class="field-wrapper">' +
              '<select id="camunda-messages" name="messages" data-value>' +
              '</select>' +
            '</div>' +

            '<div class="cam-add-message">' +
              '<label for="addMessage">Add Message </label>' +
              '<button id="addMessage" data-action="addMessage"><span>+</span></button>' +
            '</div>',

    addMessage: function(element, values, inputNode) {
      createMessageNameTemplate(inputNode, true);

      // select empty value in message select box
      var existingMessages = domQuery.all('select[name=messages] > option', inputNode.parentElement);
      forEach(existingMessages, function(message) {
        if (message.value === '') {
          domAttr(message, 'selected', 'selected');
        } else {
          domAttr(message, 'selected', null);
        }
      });
      return true;
    },

    get: function(element, entryNode) {
      var values = {};

      createMessageNameTemplate(entryNode, 'isMessageSelected');

      var boMessage = messageEventDefinition.get('messageRef');
      if (boMessage) {
        values.messages = boMessage.id;
        values.messageName = boMessage.get('name');
      } else {
        values.messages = '';
        values.messageName = '';
      }

      // fill message select box with options
      var options = updateOptionsDropDown(messageEventDefinition, 'bpmn:Message', entryNode);
      selectOptionById(options, values.messages);

      return values;
    },
    set: function(element, values) {
      var selectedMessage = values.messages;
      var messageExist = false;

      var messages = utils.findRootElementsByType(messageEventDefinition, 'bpmn:Message');
      forEach(messages, function(message) {
        if (message.id === values.messages) {
          messageExist = true;
        }
      });

      if ( (selectedMessage && !messageExist) || (!selectedMessage && !messageExist && values.messageName) ) {
        // create and reference new element
        return {
          cmd: 'properties-panel.create-and-reference',
          context: {
            element: element,
            referencingObject: messageEventDefinition,
            referenceProperty: 'messageRef',
            newObject: { type: 'bpmn:Message', properties: { name: values.messageName } },
            newObjectContainer: utils.getRoot(messageEventDefinition).rootElements,
            newObjectParent: utils.getRoot(messageEventDefinition)
          }
        };
      }

      else {
        // update or clear reference on business object
        var update = {};
        update.messageRef = selectedMessage;

        return {
          cmd:'properties-panel.update-businessobject',
          context: {
            element: element,
            businessObject: messageEventDefinition,
            referenceType: 'bpmn:Message',
            referenceProperty: 'messageRef',
            properties: update
          }
        };
      }

    },
    validate: function(element, values, event) {
      var validationResult = {};
      if ( window.event && (window.event.delegateTarget.id === 'addMessage') ) {
        var messageName = values.messageName;

        if(!messageName) {
          validationResult.messageName = 'Must provide a value.';
        }
      }
      return validationResult;
    },
    clear:  function(element, inputNode) {
      var input = domQuery('input[name=messageName]', inputNode);
      input.value = '';
      return true;
    },
    canClear: function(element, inputNode) {
      var input = domQuery('input[name=messageName]', inputNode);
      return input.value !== '';
    },
    isMessageSelected: function(element, node) {
      var messageComboBox = domQuery('select[name=messages]', node.parentElement);
      var messageNameInput = domQuery('input[name=messageName]', node);
      if (messageComboBox.value && messageComboBox.value.length > 0)  {
        return true;
      } else {
        messageNameInput.value = '';
        return false;
      }
    },

    cssClasses: ['textfield']
  });

}

module.exports = MessageEventDefinition;
