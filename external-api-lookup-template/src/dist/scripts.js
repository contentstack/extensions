"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  });
  // Step 3:  domChangeListner - Start listner on select field to set data for field
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