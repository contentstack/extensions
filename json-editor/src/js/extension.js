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
  extensionField.window.updateHeight(400);

  // Get current Json editor field value from Contentstack and update the element
  var value = extensionField.field.getData() || {};

  // Configure Json editor
  var options = {
    modes: ['text', 'code', 'tree', 'form', 'view'],
    mode: 'code',
    ace: ace,
    onChange: function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(updateFieldValue, 600);
    },
  };

  jsonEditor = new JSONEditor(jsoneditorElement, options);
  jsonEditor.set(value);

  //TODO: set focus on field to show active users or highlight the field
});

var element = document.getElementById("jsoneditor");

var NewTag = document.createElement("span");
NewTag.className = 'invalid';
var text = document.createTextNode("Invalid JSON format !!");
NewTag.appendChild(text);

async function updateFieldValue() {
  try {
    value = await jsonEditor.get();
    await extensionField.field.setData(value).then(function(){
      value = typeof value !== "string"
          ? JSON.stringify(value)
          : value;
      json = JSON.parse(value);
      element.removeChild(NewTag);
      return json;
  })} catch (error) {
      element.appendChild(NewTag);
      document.getElementsByClassName("save-btn").disabled = true;
  }
}
