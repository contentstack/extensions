"use strict";

var JSONEditor = require('jsoneditor'); // initialise Field Extension


window.extensionField = {}; // find jsoneditor element

var jsoneditorElement = document.getElementById('jsoneditor'); // initialise variable for json editor plugin

var jsonEditor = {};
ContentstackUIExtension.init().then(function (extension) {
  // make extension object globally available
  extensionField = extension; // update the field height

  extensionField.window.updateHeight(220); // Get current Json editor field value from Contentstack and update the element

  var value = extensionField.field.getData() || {}; // Configure Json editor

  var options = {
    modes: ['text', 'code', 'tree', 'form', 'view'],
    mode: 'code',
    ace: ace,
    onChange: function onChange() {
      updateFieldValue();
    }
  };
  jsonEditor = new JSONEditor(jsoneditorElement, options);
  jsonEditor.set(value); //TODO: set focus on field to show active users or highlight the field
});

function updateFieldValue() {
  var value = jsonEditor.get();
  extensionField.field.setData(value).then(function () {
    console.log('data set on child');
  })["catch"](function (error) {
    console.log('error in setting data', error);
  });
}