// initialise Field Extension
let extensionField = {};
// initial timer count
let typingTimer = 0;

// find jsoneditor element
var jsoneditorElement = document.getElementById('jsoneditor');

// initialise variable for json editor plugin
var jsonEditor = {};

ContentstackUIExtension.init().then(function (extension) {
  // make extension object globally available
  extensionField = extension;

  // update the field height
  extensionField.window.updateHeight(220);

  // Get current Json editor field value from Contentstack and update the element
  var value = extensionField.field.getData() || {};

  // Configure Json editor
  var options = {
    modes: ['text', 'code', 'tree', 'form', 'view'],
    mode: 'code',
    ace: ace,
    onChange: function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(updateFieldValue, 1000);
    },
  };

  jsonEditor = new JSONEditor(jsoneditorElement, options);
  jsonEditor.set(value);

  //TODO: set focus on field to show active users or highlight the field
});

async function updateFieldValue() {
  try {
    var value = await jsonEditor.get();
    await extensionField.field.setData(value);
    console.info('Successfully set the data');
  } catch (error) {
    throw error;
    // console.error('error in setting data', error);
  }
}
