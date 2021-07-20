"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionField;
var auidences = [];

function calculateHeight() {
  var body = document.body;
  var html = document.documentElement;
  var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  extensionField.window.updateHeight(height);
}

var Optimizely = /*#__PURE__*/function () {
  function Optimizely(_ref) {
    var AccessToken = _ref.access_token,
        ProjectId = _ref.project_id;

    _classCallCheck(this, Optimizely);

    this.AccessToken = AccessToken;
    this.ProjectId = ProjectId;
  }

  _createClass(Optimizely, [{
    key: "getAudience",
    value: function getAudience() {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        fetch("https://api.optimizely.com/v2/audiences?project_id=".concat(request.ProjectId), {
          method: 'GET',
          headers: {
            Authorization: "Bearer ".concat(request.AccessToken)
          }
        }).then(function (response) {
          statusCode = response.status;
          return response.json();
        }).then(function (response) {
          if (statusCode === 200) resolve(response);
          throw Error('Failed to fetch resource');
        })["catch"](function (err) {
          reject(err);
        });
      });
    }
  }]);

  return Optimizely;
}();

function domChangeListner(data) {
  var fieldValue;
  $('#select-tools').on('change', function () {
    fieldValue = $('#select-tools').val();
    var fieldValues = [];

    if (fieldValue !== null) {
      fieldValue.forEach(function (value) {
        data.forEach(function (element) {
          if (value === element.name) {
            fieldValues.push(element);
          }
        });
      });
    }

    return extensionField.field.setData(fieldValues);
  });
  $('.selectize-control').on('click', function () {
    calculateHeight();
  });
}

function calculateDomHeight() {
  var elHeight = $('.selectize-control').outerHeight() + $('.selectize-dropdown ').height();
  extensionField.window.updateHeight(elHeight);
}

function render(data) {
  //  to get previously selected
  var fieldData = extensionField.field.getData();
  var selectedValues = [];

  if (Object.keys(fieldData).length !== 0) {
    fieldData.forEach(function (element) {
      selectedValues.push(element.name);
    });
  }

  $('#select-tools').selectize({
    plugins: ['remove_button'],
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    options: data,
    create: false,
    items: selectedValues,
    hideSelected: true,
    onFocus: function onFocus() {
      calculateHeight();
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
    },
    onBlur: function onBlur() {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }

      var elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onInitialize: function onInitialize() {
      if (selectedValues.length === 0) {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      } else if (selectedValues.length === auidences.length) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }

      var elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onDropdownOpen: function onDropdownOpen() {
      calculateDomHeight();
    },
    onItemAdd: function onItemAdd() {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      }
    },
    onItemRemove: function onItemRemove() {
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      calculateDomHeight();
    }
  }); // Step 3:  domChangeListner - Start listner on select field to set data for field
  // on selection change

  domChangeListner(data);
}

$(document).ready(function () {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.
  ContentstackUIExtension.init().then(function (extension) {
    // current extension object
    extensionField = extension;
    var optimizely = new Optimizely(extension.config); // initialize request object using config

    optimizely.getAudience().then(function (response) {
      // Step 2:  Render - Render the data fetched from external service
      render(response);
    });
  });
});