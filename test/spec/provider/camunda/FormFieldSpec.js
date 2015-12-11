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
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  forEach = require('lodash/collection/forEach'),
  is = require('bpmn-js/lib/util/ModelUtil').is;

describe('form-fields', function() {

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


  beforeEach(inject(function(commandStack, propertiesPanel) {

    var undoButton = document.createElement('button');
    undoButton.textContent = 'UNDO';

    undoButton.addEventListener('click', function() {
      commandStack.undo();
    });

    container.appendChild(undoButton);

    propertiesPanel.attachTo(container);
  }));

  function getFormFields(extensionElements) {
    var formFields = [];
    if (extensionElements && extensionElements.values) {
      forEach(extensionElements.values, function(value) {
        if (is(value, 'camunda:FormData')) {
          if (value.fields) {
            forEach(value.fields, function(formField) {
              formFields.push(formField);
            });
          }
        }
      });
    }
    return formFields;
  }

  it('should fetch form field properties of an element',
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    var shape = elementRegistry.get('StartEvent_1');
    selection.select(shape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        bo = getBusinessObject(shape);

    var formFields = getFormFields(bo.extensionElements);

    // given
    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
    expect(formFields).to.have.length(3);

    expect(formFields[0].get('id')).to.equal(formFieldIds[0].value);
    expect(formFields[0].get('label')).to.equal(formFieldLabels[0].value);
    expect(formFields[1].get('id')).to.equal(formFieldIds[1].value);
    expect(formFields[1].get('label')).to.equal(formFieldLabels[1].value);
    expect(formFields[2].get('id')).to.equal(formFieldIds[2].value);
    expect(formFields[2].get('label')).to.equal(formFieldLabels[2].value);

  }));

  it('should change form field properties of an element',
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    var shape = elementRegistry.get('StartEvent_1');
    selection.select(shape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        bo = getBusinessObject(shape);

    var formFields = getFormFields(bo.extensionElements);

    // given
    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
    expect(formFields).to.have.length(3);

    expect(formFields[0].get('id')).to.equal(formFieldIds[0].value);
    expect(formFields[0].get('label')).to.equal(formFieldLabels[0].value);
    expect(formFields[1].get('id')).to.equal(formFieldIds[1].value);
    expect(formFields[1].get('label')).to.equal(formFieldLabels[1].value);
    expect(formFields[2].get('id')).to.equal(formFieldIds[2].value);
    expect(formFields[2].get('label')).to.equal(formFieldLabels[2].value);

    // when
    TestHelper.triggerValue(formFieldIds[0], 'changeMe', 'change');

    // then
    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
    expect(formFields).to.have.length(3);

    expect(formFieldIds[0].value).to.equal('changeMe');

    formFields = getFormFields(bo.extensionElements);
    expect(formFields[0].get('id')).to.equal(formFieldIds[0].value);
    expect(formFields[0].get('label')).to.equal(formFieldLabels[0].value);

  }));

  it('should add form field properties to existing extension elements',
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    var shape = elementRegistry.get('StartEvent_1');
    selection.select(shape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        addFormFieldButton = domQuery('[data-entry=formFields] > div > button[data-action=addFormField]', propertiesPanel._container),
        bo = getBusinessObject(shape);

    var formFields = getFormFields(bo.extensionElements);

    // given
    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
    expect(formFields).to.have.length(3);

    // when
    // add new form field
    TestHelper.triggerEvent(addFormFieldButton, 'click');

    formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container);
    formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container);

    // add value for form field id property
    TestHelper.triggerValue(formFieldIds[3], 'myFormFieldId', 'change');

    // then
    formFields = getFormFields(bo.extensionElements);

    expect(formFieldIds).to.have.length(4);
    expect(formFieldLabels).to.have.length(4);
    expect(formFields).to.have.length(4);

  }));

  it('should add form field properties for an element when existing no extension elements',
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    var shape = elementRegistry.get('UserTask_1');
    selection.select(shape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        addFormFieldButton = domQuery('[data-entry=formFields] > div > button[data-action=addFormField]', propertiesPanel._container),
        bo = getBusinessObject(shape);

    var formFields = getFormFields(bo.extensionElements);

    // given
    expect(formFieldIds).to.have.length(0);
    expect(formFieldLabels).to.have.length(0);
    expect(formFields).to.have.length(0);

    // when
    // add new form field
    TestHelper.triggerEvent(addFormFieldButton, 'click');

    formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container);
    formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container);

    // add value for form field id property
    TestHelper.triggerValue(formFieldIds[0], 'myFormFieldId', 'change');

    // then
    formFields = getFormFields(bo.extensionElements);

    expect(formFieldIds).to.have.length(1);
    expect(formFieldLabels).to.have.length(1);
    expect(formFields).to.have.length(1);

  }));

  it('should delete the first form field for an element',
      inject(function(propertiesPanel, selection, elementRegistry) {

    propertiesPanel.attachTo(container);

    var shape = elementRegistry.get('StartEvent_1');
    selection.select(shape);

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container),
        formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container),
        deleteFormFieldButtons = domQuery.all('[data-entry=formFields] button[data-action=removeFormField]', propertiesPanel._container),
        bo = getBusinessObject(shape);

    var formFields = getFormFields(bo.extensionElements);

    // given
    expect(formFieldIds).to.have.length(3);
    expect(formFieldLabels).to.have.length(3);
    expect(formFields).to.have.length(3);

    expect(formFields[0].get('id')).to.equal(formFieldIds[0].value);
    expect(formFields[0].get('label')).to.equal(formFieldLabels[0].value);
    expect(formFields[1].get('id')).to.equal(formFieldIds[1].value);
    expect(formFields[1].get('label')).to.equal(formFieldLabels[1].value);
    expect(formFields[2].get('id')).to.equal(formFieldIds[2].value);
    expect(formFields[2].get('label')).to.equal(formFieldLabels[2].value);

    // when
    // add new form field
    TestHelper.triggerEvent(deleteFormFieldButtons[0], 'click');

    // then
    formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container);
    formFieldLabels = domQuery.all('input[name=formFieldLabel]', propertiesPanel._container);
    formFields = getFormFields(bo.extensionElements);

    expect(formFieldIds).to.have.length(2);
    expect(formFieldLabels).to.have.length(2);
    expect(formFields).to.have.length(2);

    expect(formFieldIds[0].value).to.equal('lastname');
    expect(formFieldLabels[0].value).to.equal('Lastname');
    expect(formFieldIds[1].value).to.equal('dateOfBirth');
    expect(formFieldLabels[1].value).to.equal('Date of Birth');

    expect(formFields[0].get('id')).to.equal(formFieldIds[0].value);
    expect(formFields[0].get('label')).to.equal(formFieldLabels[0].value);
    expect(formFields[1].get('id')).to.equal(formFieldIds[1].value);
    expect(formFields[1].get('label')).to.equal(formFieldLabels[1].value);

  }));

  it('should undo adding two form field at once',
      inject(function(propertiesPanel, selection, elementRegistry, commandStack) {

    // given
    var taskShape = elementRegistry.get('UserTask_1'),
        bo = getBusinessObject(taskShape);

    selection.select(taskShape);

    var query = '[data-entry=formFields] > div > button[data-action=addFormField]',
        addFormFieldButton = domQuery(query, propertiesPanel._container);

    TestHelper.triggerEvent(addFormFieldButton, 'click');
    TestHelper.triggerEvent(addFormFieldButton, 'click');

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container);

    TestHelper.triggerValue(formFieldIds[0], 'formFieldIdOne');
    TestHelper.triggerValue(formFieldIds[1], 'formFieldIdTwo');

    // when
    commandStack.undo();

    // then
    var formFields = getFormFields(bo.extensionElements);

    expect(formFields).to.be.empty;

  }));

  it('should redo adding two form fields at once',
      inject(function(propertiesPanel, selection, elementRegistry, commandStack) {

    // given
    var taskShape = elementRegistry.get('UserTask_1'),
        bo = getBusinessObject(taskShape);

    selection.select(taskShape);

    var query = '[data-entry=formFields] > div > button[data-action=addFormField]',
        addFormFieldButton = domQuery(query, propertiesPanel._container);

    TestHelper.triggerEvent(addFormFieldButton, 'click');
    TestHelper.triggerEvent(addFormFieldButton, 'click');

    var formFieldIds = domQuery.all('input[name=formFieldId]', propertiesPanel._container);

    TestHelper.triggerValue(formFieldIds[0], 'formFieldIdOne');
    TestHelper.triggerValue(formFieldIds[1], 'formFieldIdTwo');

    // when
    commandStack.undo();
    commandStack.redo();

    // then
    var formFields = getFormFields(bo.extensionElements);

    expect(formFields).to.have.length.of(2);

  }));

});
