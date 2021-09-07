"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionField;

var Request = /*#__PURE__*/function () {
  function Request(_ref) {
    var configArg1 = _ref.configArg1,
        configArg2 = _ref.configArg2;

    _classCallCheck(this, Request);

    this.configArg1 = configArg1;
    this.configArg2 = configArg2;
  }

  _createClass(Request, [{
    key: "get",
    value: function get() {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        fetch("https://reqres.in/api/users?$configArg1={request.configArg1}&configArg2=".concat(request.configArg2), {
          method: 'GET'
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
  }, {
    key: "search",
    value: function search(keyword) {
      // sample search function for advance implementation
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        fetch("https://reqres.in/api/users?$keyword=".concat(keyword, "&configArg2=").concat(request.configArg2), {
          method: 'GET'
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

  return Request;
}();

function domChangeListner() {
  $('#resource-select').on('change', function () {
    var fieldValue = $('#resource-select').val();
    return extensionField.field.setData(fieldValue);
  });
}

function render(response) {
  //  to get previously selected
  var fieldData = extensionField.field.getData();
  response.data.forEach(function (dataSet) {
    var option = $('<option></option>').attr('value', dataSet.id).text("".concat(dataSet.first_name, " ").concat(dataSet.last_name));

    if (fieldData === dataSet.id.toString()) {
      option.attr('selected', 'selected');
    }

    $('#resource-select').append(option);
  }); // Step 3:  domChangeListner - Start listner on select field to set data for field
  // on selection change

  domChangeListner();
}

$(document).ready(function () {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.
  ContentstackUIExtension.init().then(function (extension) {
    // current extension object
    extensionField = extension;
    var request = new Request(extension.config); // initialize request object using config

    request.get().then(function (response) {
      // Step 2:  Render - Render the data fetched from external service
      render(response);
    });
    extensionField.window.enableAutoResizing();
  });
});