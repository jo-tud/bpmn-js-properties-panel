'use strict';

var forEach = require('lodash/collection/forEach'),
    domQuery = require('min-dom/lib/query'),
    domAttr = require('min-dom/lib/attr'),
    businessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    domify = require('min-dom/lib/domify'),
    indexBy = require('lodash/collection/indexBy');

var selectOptions = function(businessObject, referencedType, referencedObjectToString, findRootElementsByType) {
  var model = [];
  var referableObjects = findRootElementsByType(businessObject, referencedType);
  forEach(referableObjects, function(obj) {
    model.push({
      label: referencedObjectToString(obj),
      value: obj.id,
      name: obj.name
    });
  });
  addEmptyParameter(model);
  return model;
}

var addEmptyParameter = function(list) {
  return list.push({ label: '', value: '', name: '' });
};

var selectbox = function(options, defaultParameters, getRoot, findRootElementsByType, removeAllChildren) {
  var resource = defaultParameters,
    label = options.label || resource.id,
    businessObject = options.businessObject,
    referencedType = options.referencedType,
    referenceTypeName = options.referencedType.substr(5),
    referenceProperty = options.referenceProperty,
    referencedObjectToString = options.referencedObjectToString || function(obj) {
        return obj.name + ' (id='+obj.id+')';
      };

  if(!businessObject) throw new Error('businessObject is required');
  if(!referencedType) throw new Error('referencedType is required');
  if(!referenceProperty) throw new Error('referenceProperty is required');    

  resource.html =
    '<label for="camunda-' + resource.id + '">' + label + '</label>' +
    '<div class="field-wrapper">' +
      '<select id="camunda-' + resource.id + '" name="' + referenceProperty + '">';

  resource.optionsModel = selectOptions(businessObject, referencedType, referencedObjectToString, findRootElementsByType);
  forEach(resource.optionsModel, function(option){
    resource.html += '<option value="' + option.value + '">' + option.name + '</option>';
  });

  resource.html += '</select></div>';

  resource.selectedOption = {};

  resource.get = function(element, propertyName) {
    var values = {},
        currentModel = businessObject[referenceProperty],
        currentModelValue = (currentModel) ? currentModel.id : undefined;

    resource.refreshOptionsModel();
    resource.updateOptionsDropDown(propertyName);
    values[referenceProperty] = resource.selectOptionById(currentModelValue);

    var elementFields = domQuery.all('select#camunda-' + resource.id + ' > option', propertyName);
    forEach(elementFields, function(field) {
      if(field.value === currentModelValue || (field.value === '' && !currentModelValue) ) {
        domAttr(field, 'selected', 'selected');
      } else {
        domAttr(field, 'selected', null);
      }
    });
  };

  resource.set = function(element, values) {
    var providedValue = values[referenceProperty];
    resource.selectedOption = resource.selectOptionById(providedValue);

    if(!resource.selectedOption && providedValue && providedValue.length > 0) {
      // create and reference new element
      return {
        cmd: 'properties-panel.create-and-reference',
        context: {
          element: element,
          referencingObject: businessObject,
          referenceProperty: referenceProperty,
          newObject: { type: referencedType, properties: { name: providedValue } },
          newObjectContainer: getRoot(businessObject).rootElements,
          newObjectParent: getRoot(businessObject)
        }
      };
    } else {
      // update or clear reference on business object
      var changes = {};
      changes[referenceProperty] = providedValue;

      return {
        cmd:'properties-panel.update-businessobject',
        context: {
          element: element,
          businessObject: businessObject,
          referenceType: referencedType,
          referenceProperty: referenceProperty,
          properties: changes
        }
      };
    }
  };  

  resource.selectOptionById = function(id) {
    var selectedOption = indexBy(resource.optionsModel, 'value')[id];
    resource.selectedOption = selectedOption;
    return selectedOption ? selectedOption.label : '';
  };

  resource.refreshOptionsModel = function() {
    resource.optionsModel = selectOptions(businessObject, referencedType, referencedObjectToString, findRootElementsByType);
  };

  resource.updateOptionsDropDown = function(entry) {
    var optionTemplate = '<option></option>';
    // update options
    var selectEl = domQuery('select#camunda-' + resource.id, entry);
    removeAllChildren(selectEl);

    if(resource.optionsModel.length > 0) {
      forEach(resource.optionsModel, function(option) {
        var optionDomElement = domify(optionTemplate);
        optionDomElement.value = option.value;
        optionDomElement.textContent = option.name;
        selectEl.appendChild(optionDomElement);
      });
    }
  };

  resource.cssClasses = ['dropdown'];

  return resource;
  
};


module.exports = selectbox;
