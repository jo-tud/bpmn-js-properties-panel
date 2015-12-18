'use strict';

var domQuery = require('min-dom/lib/query'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    forEach = require('lodash/collection/forEach');

var Utils = {};
module.exports = Utils;

Utils.selectedOption = function(selectBox) {
  if(selectBox.selectedIndex >= 0) {
    return selectBox.options[selectBox.selectedIndex].value;
  }
};

Utils.selectedType = function(elementSyntax, inputNode) {
  var typeSelect = domQuery(elementSyntax, inputNode);
  return this.selectedOption(typeSelect);
};

/**
 * returns the root element
 */
Utils.getRoot = function(businessObject) {
  var parent = businessObject;
  while(parent.$parent) {
    parent = parent.$parent;
  }
  return parent;
}

/**
 * filters all elements in the list which have a given type.
 * removes a new list
 */
Utils.filterElementsByType = function(objectList, type) {
  var list = objectList || [];
  var result = [];
  forEach(list, function(obj) {
    if(is(obj, type)) {
      result.push(obj);
    }
  });
  return result;
}

Utils.findRootElementsByType = function(businessObject, referencedType) {
  var root = this.getRoot(businessObject);
  return this.filterElementsByType(root.rootElements, referencedType);
}

Utils.removeAllChildren = function(domElement) {
  while(!!domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }
}
