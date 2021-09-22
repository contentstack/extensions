"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// initialise Field Extension
var extensionField = {}; // initial timer count

var typingTimer = 0; // find jsoneditor element

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
      clearTimeout(typingTimer);
      typingTimer = setTimeout(updateFieldValue, 1000);
    }
  };
  jsonEditor = new JSONEditor(jsoneditorElement, options);
  jsonEditor.set(value); //TODO: set focus on field to show active users or highlight the field
});

function updateFieldValue() {
  return _updateFieldValue.apply(this, arguments);
}

function _updateFieldValue() {
  _updateFieldValue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return jsonEditor.get();

          case 3:
            value = _context.sent;
            _context.next = 6;
            return extensionField.field.setData(value);

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.error('error in setting data', _context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
  return _updateFieldValue.apply(this, arguments);
}