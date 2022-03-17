"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-undef */
var extensionField;
var selectField;
var formList;
var marketo = {};
$(document).ready(function () {
  selectField = $('#form-select-field'); // Step:1 Intializing extension - In this step we try to connect
  // to host window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(function (extension) {
    extensionField = extension;
    marketo = new Marketo(extension.config);
    marketo.getForms().then(function (response) {
      render(response, false);
    });
    extensionField.window.enableAutoResizing();
  });
});

function domChangeListner(forms) {
  selectField.on('change', function () {
    $('#clear-form').css({
      display: 'block'
    });
    var id = $('#form-select-field').val();
    var FormData = forms.find(function (form) {
      return form.id.toString() === id;
    });
    console.log('formData...', FormData);
    extensionField.field.setData([_objectSpread({}, FormData)]);
  });
}

$('.form-clear-icon').on('click', function () {
  $('#clear-form').css({
    display: 'none'
  });
  $('#form-select-field').empty();
  $('#form-select-field').append($('<option value>-- Select a form --</option>'));
  render(formList, true);
  extensionField.field.setData([]);
}); // render function for creating DOM structure

function render(forms, clearField) {
  var _initialValue$;

  formList = forms;
  var initialValue = extensionField && extensionField.field && extensionField.field.getData() ? extensionField.field.getData() : [];
  var formID = (_initialValue$ = initialValue[0]) === null || _initialValue$ === void 0 ? void 0 : _initialValue$.id;
  var defaultOption = $('select option:contains("-- Select a form --")');
  forms.forEach(function (form) {
    var option = $("<option></option>").attr('value', form.id).text(form.name);

    if (form.id === formID) {
      option.attr('selected', 'selected');
      $('#clear-form').css({
        display: 'block'
      });
    }

    selectField.append(option);
  });
  defaultOption.attr('disabled', 'disabled');

  if (!formID || clearField) {
    defaultOption.attr('selected', 'selected');
    $('#clear-form').css({
      display: 'none'
    });
  }

  selectField.show();
  domChangeListner(forms);
}

var Marketo = /*#__PURE__*/function () {
  function Marketo(_ref) {
    var url = _ref.url,
        folder = _ref.folder;

    _classCallCheck(this, Marketo);

    this.url = url;
    this.folder = folder;
  }

  _createClass(Marketo, [{
    key: "getForms",
    value: function getForms() {
      var setting = this;
      return new Promise(function (resolve, reject) {
        var getUrl = "".concat(setting.url);
        if (setting.folder) getUrl = "".concat(getUrl, "?folder=").concat(setting.folder);
        return fetch(getUrl, {
          method: 'GET'
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          return resolve(response);
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }]);

  return Marketo;
}();