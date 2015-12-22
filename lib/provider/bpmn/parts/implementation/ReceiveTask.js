'use strict';

var domQuery = require('min-dom/lib/query'),
    entryFactory = require('../../../../factory/EntryFactory'),
    cmdHelper = require('../../../../helper/CmdHelper'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    forEach = require('lodash/collection/forEach'),
    domAttr = require('min-dom/lib/attr'),
    domClasses = require('min-dom/lib/classes'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    elementHelper = require('../../../../helper/ElementHelper'),
    domify = require('min-dom/lib/domify'),
    indexBy = require('lodash/collection/indexBy'),

    utils = require('../../../../Utils');


function refreshOptionsModel(businessObject, referencedType) {
  var model = [];
  var referableObjects = utils.findRootElementsByType(businessObject, referencedType);
  forEach(referableObjects, function(obj) {
    model.push({
      label: obj.name + ' (id='+obj.id+')',
      value: obj.id,
      name: obj.name
    });
  });
  return model;
};

function updateOptionsDropDown(businessObject, referencedType, entryNode) {
  var options = refreshOptionsModel(businessObject, referencedType)
  addEmptyParameter(options);
  var selectBox = domQuery('select[name=messages]', entryNode);
  utils.removeAllChildren(selectBox);
  forEach(options, function(option){
    var optionEntry = domify('<option value="' + option.value + '">' + option.label + '</option>');
    selectBox.appendChild(optionEntry);
  });
  return options;
};

function addEmptyParameter(list) {
  return list.push({'label': '', 'value': '', 'name': ''});
};


function ReceiveTask(group, element, bpmnFactory) {
  var bo = getBusinessObject(element);

  if (!bo) {
    return;
  }

  group.entries.push({
    'id': 'messages',
    'description': 'Show, create and configure messages',
    label: 'Messages',
    'html': '<div class="pp-row">' +
              '<label for="camunda-messages">Messages</label>' +
              '<div class="field-wrapper">' +
                '<select id="camunda-messages" name="messages" data-value>' +
                '</select>' +
                '<button id="addMessage" data-action="addMessage"><span>+</span></button>' +
              '</div>' +
            '</div>' +

            '<div class="pp-row" data-show="isMessageSelected">' +
              '<label for="camunda-message-name">Message Name</label>' +
              '<div class="field-wrapper">' +
                '<input id="camunda-message-name" type="text" name="messageName" />' +
                '<button data-action="clear" data-show="canClear">' +
                  '<span>X</span>' +
                '</button>' +
              '</div>' +
            '</div>',

    addMessage: function(element, inputNode) {
      var update = {};

      // create new empty message
      var newMessage = elementHelper.createElement('bpmn:Message', {}, utils.getRoot(bo), bpmnFactory);
      var optionTemplate = domify('<option value="' + newMessage.id + '"> (id='+newMessage.id+')' + '</option>');

      var existingMessages = domQuery('select[name=messages]', inputNode.parentElement);
      // add new option
      existingMessages.insertBefore(optionTemplate, existingMessages.firstChild);
      // select new message in the message select box
      forEach(existingMessages, function(message) {
        if (message.value === newMessage.id) {
          domAttr(message, 'selected', 'selected');
        } else {
          domAttr(message, 'selected', null);
        }
      });

      update.messages = newMessage.id;
      update.messageName = '';

      return update;
    },

    get: function(element, entryNode) {
      var values = {};

      // fill message select box with options
      var options = updateOptionsDropDown(bo, 'bpmn:Message', entryNode);

      var boMessage = bo.get('messageRef');
      if (boMessage) {
        values.messages = boMessage.id;
        values.messageName = boMessage.get('name');
      } else {
        values.messages = '';
      }

      return values;
    },
    set: function(element, values) {
      var selectedMessage = values.messages;
      var messageName = values.messageName;
      var messageExist = false;
      var update = {};

      var messages = utils.findRootElementsByType(bo, 'bpmn:Message');
      forEach(messages, function(message) {
        if (message.id === values.messages) {
          messageExist = true;
        }
      });

      if (selectedMessage && !messageExist) {
        // create and reference new element
        return {
          cmd: 'properties-panel.create-and-reference',
          context: {
            element: element,
            referencingObject: bo,
            referenceProperty: 'messageRef',
            newObject: { type: 'bpmn:Message', properties: { name: selectedMessage } },
            newObjectContainer: utils.getRoot(bo).rootElements,
            newObjectParent: utils.getRoot(bo)
          }
        };
      }

      else

      // update message business object
      var boMessage = bo.get('messageRef');
      if (boMessage && (boMessage.name != messageName)) {
          update.name = messageName;

         return cmdHelper.updateBusinessObject(element, boMessage, update);

      } else {

        // update or clear reference on business object
        update.messageRef = selectedMessage;

        return {
          cmd:'properties-panel.update-businessobject',
          context: {
            element: element,
            businessObject: bo,
            referenceType: 'bpmn:Message',
            referenceProperty: 'messageRef',
            properties: update
          }
        };
      }

    },
    validate: function(element, values) {
      var validationResult = {};
      var messageName = values.messageName;

      // can be undefined (which is fine)
      if (messageName === '') {
        validationResult.messageName = 'Must provide a value.';
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
      if (messageComboBox.value && messageComboBox.value.length > 0)  {
        return true;
      } else {
        return false;
      }
    },

    cssClasses: ['textfield']
  });

}

module.exports = ReceiveTask;
