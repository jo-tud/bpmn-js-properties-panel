'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

/* global bootstrapModeler, inject */

var propertiesPanelModule = require('../../../../lib'),
  domQuery = require('min-dom/lib/query'),
  coreModule = require('bpmn-js/lib/core'),
  selectionModule = require('diagram-js/lib/features/selection'),
  modelingModule = require('bpmn-js/lib/features/modeling'),
  propertiesProviderModule = require('../../../../lib/provider/camunda'),
  camundaModdlePackage = require('camunda-bpmn-moddle/resources/camunda'),
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

describe('start-event-form-key', function() {

  var diagramXML = require('./FormFields.bpmn');

  var testModules = [
    coreModule, selectionModule, modelingModule,
    propertiesPanelModule,
    propertiesProviderModule
  ];

  var container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  beforeEach(bootstrapModeler(diagramXML, {
    modules: testModules,
    moddleExtensions: {camunda: camundaModdlePackage}
  }));


  beforeEach(inject(function(commandStack) {

    var undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(undoButton);
  }));

  it.only('should fetch form field properties of an element', 
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    // given
    var taskShape = elementRegistry.get('StartEvent_1');
    selection.select(taskShape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        bo = getBusinessObject(taskShape);

    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
  }));

});
