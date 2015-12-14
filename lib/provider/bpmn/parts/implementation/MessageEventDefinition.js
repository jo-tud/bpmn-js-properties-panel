'use strict';

var domQuery = require('min-dom/lib/query'),
    entryFactory = require('../../../../factory/EntryFactory'),
    forEach = require('lodash/collection/forEach'),
    cmdHelper = require('../../../../helper/CmdHelper');


function MessageEventDefinition(group, element, bpmnFactory, messageEventDefinition) {
  group.entries.push({
    'id': 'messages',
    'description': 'Add messages',
    label: 'Messages',
    'html': '<div class="cam-add-message">' +
              '<label for="addMessage">Add Message </label>' +
              '<button id="addMessage" data-action="addMessage"><span>+</span></button>' +
            '</div>',

    addMessage: function(element, inputNode) {
      // select empty value in message select box
      var existingMessages = domQuery.all('select[name=messageRef] > option', inputNode);
      forEach(existingMessages, function(message) {
        if (message.value === '') {
          domAttr(field, 'selected', 'selected');
        } else {
          domAttr(field, 'selected', null);
        }
      });
      // show empty message name input field to add name for the new message
      domQuery('input[name=messageName]', inputNode).value = '';
      return true;
    },
  });

  group.entries.push(entryFactory.referenceSelectBox({
    id: 'selectMessage',
    description: '',
    label: 'Message Definition',
    businessObject: messageEventDefinition,
    referencedType: 'bpmn:Message',
    referenceProperty: 'messageRef'
  }));

  group.entries.push(entryFactory.textField({
    id : 'messageName',
    description : 'Configure the name of a message event',
    label : 'Message Name',
    modelProperty : 'messageName',
    get: function(element) {
      var values = {};

      var boMessage = messageEventDefinition.get('messageRef');
      if (boMessage) {
        values.messageName = boMessage.get('name');
      }

      return values;
    },
    set: function(element, values) {
      var update = {};

      var boMessage = messageEventDefinition.get('messageRef');
      update.name = values.messageName;

      return cmdHelper.updateBusinessObject(element, boMessage, update);
    },
    validate: function(element, values) {
      var messageName = values.messageName;
      var validationResult = {};

      if(!messageName) {
        validationResult.messageName = 'Must provide a value.';
      }

      return validationResult;
    },
    disabled: function(element, node) {
      var messageComboBox = domQuery('select[name=messageRef]', node.parentElement);
      if (messageComboBox.value) {
        return false;
      } else {
        return true;
      }
    }
  }));

}

module.exports = MessageEventDefinition;
