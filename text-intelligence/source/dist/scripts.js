"use strict";

var _models;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// list of text intelligence model for   
var models = (_models = {
  "retail_classifer": {
    "name": "Retail Classifier",
    "path": "/v3/classifiers/cl_mmYLCZUN/classify/",
    "type": "classifications"
  },
  "business_classifier": {
    "name": "Business Classifier",
    "path": "/v3/classifiers/cl_5vWJMjGc/classify/",
    "type": "classifications"
  },
  "profanity_and_abuse_detection": {
    "name": "Profanity & Abuse Detection",
    "path": "/v3/classifiers/cl_KFXhoTdt/classify/",
    "type": "classifications"
  },
  // "language_detection": {
  //   "name": "Language Detection",
  //   "path": "/v3/classifiers/cl_hDDngsX8/classify/"
  //   "type": "classifications"
  // },
  "language_classifier": {
    "name": "Language Classifier",
    "path": "/v3/classifiers/cl_v2GCwYhf/classify/",
    "type": "classifications"
  },
  "news_classifier": {
    "name": "News Classifier",
    "path": "/v3/classifiers/cl_WDyr2Q4F/classify/",
    "type": "classifications"
  },
  "sentiment_analysis": {
    "name": "Sentiment Analysis",
    "path": "/v3/classifiers/cl_Jx8qzYJh/classify/",
    "type": "classifications"
  }
}, _defineProperty(_models, "sentiment_analysis", {
  "name": "Sentiment Analysis",
  "path": "/v3/classifiers/cl_Jx8qzYJh/classify/",
  "type": "classifications"
}), _defineProperty(_models, "product_sentiment", {
  "name": "Product Sentiment",
  "path": "/v3/classifiers/cl_TWmMTdgQ/classify/",
  "type": "classifications"
}), _defineProperty(_models, "nps_saas_topic", {
  "name": "NPS SaaS Feedback Classifier",
  "path": "/v3/classifiers/cl_gYDZjEnS/classify/",
  "type": "classifications"
}), _defineProperty(_models, "outbound_sales_classifier", {
  "name": "Outbound Sales Classifier",
  "path": "/v3/classifiers/cl_zSDSt8QP/classify/",
  "type": "classifications"
}), _defineProperty(_models, "commerce_cs_classifier", {
  "name": "E-Commerce Customer Support Classifier",
  "path": "/v3/classifiers/cl_GhPhiVYE/classify/",
  "type": "classifications"
}), _defineProperty(_models, "keyword_extraction", {
  "name": "Keyword Extraction",
  "path": "/v3/extractors/ex_y7BPYzNG/extract/",
  "type": "extractions"
}), _defineProperty(_models, "summarizer", {
  "name": "Summarizer",
  "path": "/v3/extractors/ex_94WD2XxD/extract/",
  "type": "extractions"
}), _defineProperty(_models, "insight_extraction", {
  //500 error
  "name": "Insight Extraction",
  "path": "/v3/extractors/ex_EjosnyKK/extract/",
  "type": "extractions"
}), _defineProperty(_models, "person_extraction", {
  "name": "Person Extraction",
  "path": "/v3/extractors/ex_SmwSdZ3C/extract/",
  "type": "extractions"
}), _defineProperty(_models, "location_extraction", {
  "name": "Location Extraction",
  "path": "/v3/extractors/ex_vqBQ7V9B/extract/",
  "type": "extractions"
}), _defineProperty(_models, "company_extraction", {
  "name": "Company Extraction",
  "path": "/v3/extractors/ex_A9nCcXfn/extract/",
  "type": "extractions"
}), _defineProperty(_models, "date_time_extraction", {
  "name": "Date Time Extraction",
  "path": "/v3/extractors/ex_LPxHGwJT/extract/",
  "type": "extractions"
}), _defineProperty(_models, "price_extraction", {
  "name": "Price Extraction",
  "path": "/v3/extractors/ex_wNDME4vE/extract/",
  "type": "extractions"
}), _defineProperty(_models, "url_extraction", {
  "name": "URL Extraction",
  "path": "/v3/extractors/ex_owGiMc4z/extract/",
  "type": "extractions"
}), _defineProperty(_models, "email_extraction", {
  "name": "Email Address Extraction",
  "path": "/v3/extractors/ex_YWBmKCP9/extract/",
  "type": "extractions"
}), _defineProperty(_models, "email_cleaner", {
  "name": "Email Cleaner",
  "path": "/v3/extractors/ex_BXqiifAi/extract/",
  "type": "extractions"
}), _defineProperty(_models, "phone_number_extraction", {
  "name": "Phone Number Extraction",
  "path": "/v3/extractors/ex_ktEPNd9V/extract/",
  "type": "extractions"
}), _models);
var fieldPaths = [];
$(document).ready(function () {
  ContentstackUIExtension.init().then(function (extendedField) {
    extendedField.window.enableAutoResizing();
    renderModelSelectField();
    renderFieldSelectField(extendedField);
    domChangeListner(extendedField);
  });
});

function renderModelSelectField() {
  $.each(models, function (key, value) {
    $('#models').append($("<option></option>").attr("value", key).text(value.name));
  });
}

function renderFieldSelectField(extendedField) {
  var previouslySelected = $('#field').val();
  $('#field').empty();
  fieldPaths = getPaths(extendedField.entry.content_type, extendedField.entry.getData());
  fieldPaths.forEach(function (field) {
    var option = $("<option></option>").attr("value", field.uid).text(field.titlePaths.join(' > '));
    if (previouslySelected === field.uid) option.attr("selected", "selected");
    $('#field').append(option);
  });
}

function getPaths(content_type, entry) {
  var paths = [];

  function iterrate(schema, currentEntry, uid, setuid) {
    var titlePaths = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var uidsPaths = uid ? uid.split('.') : [];
    var value;
    schema.forEach(function (field, index) {
      var newUidPaths = [].concat(_toConsumableArray(uidsPaths), [field.uid]);
      var newUid = newUidPaths.join('.');
      if (!currentEntry || currentEntry[field.uid] === undefined) return;

      if (field.data_type === 'text') {
        if (field.multiple === false) {
          var newSetuid = setuid ? setuid : newUid;
          paths.push({
            uid: newUid,
            path: newUidPaths,
            value: currentEntry[field.uid],
            setuid: newSetuid,
            titlePaths: [].concat(_toConsumableArray(titlePaths), [field.display_name])
          });
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach(function (value, index) {
            var numericalPath = [].concat(_toConsumableArray(newUidPaths), [index]);
            var numericalUid = numericalPath.join('.');
            var newSetuid = setuid ? setuid : newUid;
            paths.push({
              uid: numericalPath.join('.'),
              path: numericalPath,
              value: value,
              setuid: newSetuid,
              titlePaths: [].concat(_toConsumableArray(titlePaths), [field.display_name, index])
            });
          });
        }
      }

      if (field.data_type === 'group') {
        if (field.multiple === false) {
          iterrate(field.schema, currentEntry[field.uid], newUid, setuid, [].concat(_toConsumableArray(titlePaths), [field.display_name]));
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach(function (value, index) {
            var numericalPath = [].concat(_toConsumableArray(newUidPaths), [index]);
            iterrate(field.schema, value, numericalPath.join('.'), setuid, [].concat(_toConsumableArray(titlePaths), [field.display_name, index]));
          });
        }
      }

      if (field.data_type === 'blocks') {
        if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach(function (value, index) {
            var numericalPath = [].concat(_toConsumableArray(newUidPaths), [index]);
            var blockUid = Object.keys(value)[0];
            var newSchema = field.blocks.find(function (x) {
              return x.uid === blockUid;
            }).schema;
            var newValue = value[blockUid];
            setuid = newUid;
            iterrate(newSchema, newValue, numericalPath.join('.'), setuid, [].concat(_toConsumableArray(titlePaths), [field.display_name, index]));
          });
        }
      }
    });
  }

  iterrate(content_type.schema, entry);
  return paths;
}

function domChangeListner(extendedField) {
  var updateSelectField = function updateSelectField() {
    return renderFieldSelectField(extendedField);
  };

  extendedField.entry.onSave(updateSelectField);
  $('#run-btn').on('click', function () {
    var modelID = $("#models").val();
    $('#run-btn').prop('disabled', true);
    $('#run-btn').html('Working on it...');
    $('#result-container').html('');
    runAnalysis(modelID, fieldPaths.find(function (x) {
      return x.uid === $("#field").val();
    }).value, extendedField.config.token).then(function (data) {
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      renderResult(data, models[modelID]);
    })["catch"](function (error) {
      console.log(error);
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      $('#result-container').append('<div class="alert alert-danger" role="alert">' + error.message + '</div>');
    });
  });
}

function runAnalysis(model, text, token) {
  var statusCode;
  return new Promise(function (resolve, reject) {
    fetch("https://api.monkeylearn.com".concat(models[model]['path']), {
      method: 'POST',
      body: JSON.stringify({
        data: [text]
      }),
      headers: {
        "Authorization": "Token " + token,
        "Content-Type": "application/json"
      }
    }).then(function (response) {
      if (response.headers.get('X-Query-Limit-Remaining')) $('#result-container').append('<label>Result:</label>');
      statusCode = response.status;
      return response.json();
    }).then(function (response) {
      if (statusCode === 200) resolve(response[0]);
      throw Error("Failed to run " + models[model].name + ": " + response.detail);
    })["catch"](function (err) {
      reject(err);
    });
  });
}

function renderResult(result, model) {
  $('#result-container').append('<ul class="list-group" id="result-list"></ul>');
  if (!result || result[model.type].length === 0) $('#result-list').append('<li class="list-group-item result-li">No Results</li>');

  if (model.type === 'classifications') {
    return result[model.type].forEach(function (element, index) {
      var resultText = "<li class='list-group-item'><div><span class='keys'>Tag : </span><span class='badge badge-info'>" + element.tag_name + "</span> </br> <span class='keys'> Confidence:</span> <span class='count-value'>" + (element.confidence * 100).toFixed(2) + "% </span></div></li>";
      $('#result-list').append(resultText);
    });
  }

  if (model.type === 'extractions') {
    result[model.type].forEach(function (element, index) {
      var resultText = "<li class='list-group-item'><div class='result-wrapper'><span class='keys'>" + element.tag_name + " :</span> <span class='badge badge-info'>";
      resultText += element.parsed_value + "</span> ";
      if (element.relevance) resultText += "</br><span class='keys'> Relevance :</span>" + (element.relevance * 100).toFixed(2) + "%</span> ";
      if (element.count) resultText += "</br><span class='keys'> Count :</span>" + element.count + "</span> ";
      resultText += "</div></li>";
      $('#result-list').append(resultText);
    });
  }
}