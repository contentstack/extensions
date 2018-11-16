'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * JavaScript format string function
 * 
 */
String.prototype.format = function () {
  var args = arguments;

  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : '{' + number + '}';
  });
};

/**
 * Convert a Javascript Oject array or String array to an HTML table
 * JSON parsing has to be made before function call
 * It allows use of other JSON parsing methods like jQuery.parseJSON
 * http(s)://, ftp://, file:// and javascript:; links are automatically computed
 *
 * JSON data samples that should be parsed and then can be converted to an HTML table
 *     var objectArray = '[{"Total":"34","Version":"1.0.4","Office":"New York"},{"Total":"67","Version":"1.1.0","Office":"Paris"}]';
 *     var stringArray = '["New York","Berlin","Paris","Marrakech","Moscow"]';
 *     var nestedTable = '[{ key1: "val1", key2: "val2", key3: { tableId: "tblIdNested1", tableClassName: "clsNested", linkText: "Download", data: [{ subkey1: "subval1", subkey2: "subval2", subkey3: "subval3" }] } }]'; 
 *
 * Code sample to create a HTML table Javascript String
 *     var jsonHtmlTable = ConvertJsonToTable(eval(dataString), 'jsonTable', null, 'Download');
 *
 * Code sample explaned
 *  - eval is used to parse a JSON dataString
 *  - table HTML id attribute will be 'jsonTable'
 *  - table HTML class attribute will not be added
 *  - 'Download' text will be displayed instead of the link itself
 *
 * @author Afshin Mehrabani <afshin dot meh at gmail dot com>
 * 
 * @class ConvertJsonToTable
 * 
 * @method ConvertJsonToTable
 * 
 * @param parsedJson object Parsed JSON data
 * @param tableId string Optional table id 
 * @param tableClassName string Optional table css class name
 * @param linkText string Optional text replacement for link pattern
 *  
 * @return string Converted JSON to HTML table
 */
function ConvertJsonToTable(parsedJson, tableId, tableClassName, linkText) {
  //Patterns for links and NULL value
  var italic = '<i>{0}</i>';
  var link = linkText ? '<a href="{0}">' + linkText + '</a>' : '<a href="{0}">{0}</a>';

  //Pattern for table                          
  var idMarkup = tableId ? ' id="' + tableId + '"' : '';

  var classMarkup = tableClassName ? ' class="' + tableClassName + '"' : '';

  var tbl = '<table border="1" cellpadding="1" cellspacing="1"' + idMarkup + classMarkup + '>{0}{1}</table>';

  //Patterns for table content
  var th = '<thead>{0}</thead>';
  var tb = '<tbody>{0}</tbody>';
  var tr = '<tr>{0}</tr>';
  var thRow = '<th>{0}</th>';
  var tdRow = '<td>{0}</td>';
  var thCon = '';
  var tbCon = '';
  var trCon = '';

  if (parsedJson) {
    var isStringArray = typeof parsedJson[0] == 'string';
    var headers;

    // Create table headers from JSON data
    // If JSON data is a simple string array we create a single table header
    if (isStringArray) thCon += thRow.format('value');else {
      // If JSON data is an object array, headers are automatically computed
      if (_typeof(parsedJson[0]) == 'object') {
        headers = array_keys(parsedJson[0]);

        for (var i = 0; i < headers.length; i++) {
          thCon += thRow.format(headers[i]);
        }
      }
    }
    th = th.format(tr.format(thCon));

    // Create table rows from Json data
    if (isStringArray) {
      for (var i = 0; i < parsedJson.length; i++) {
        tbCon += tdRow.format(parsedJson[i]);
        trCon += tr.format(tbCon);
        tbCon = '';
      }
    } else {
      if (headers) {
        var urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
        var javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/ig);

        for (var i = 0; i < parsedJson.length; i++) {
          for (var j = 0; j < headers.length; j++) {
            var value = parsedJson[i][headers[j]];
            var isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);

            if (isUrl) // If value is URL we auto-create a link
              tbCon += tdRow.format(link.format(value));else {
              if (value) {
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
                  //for supporting nested tables
                  tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                } else {
                  tbCon += tdRow.format(value);
                }
              } else {
                // If value == null we format it like PhpMyAdmin NULL values
                tbCon += tdRow.format(italic.format(value).toUpperCase());
              }
            }
          }
          trCon += tr.format(tbCon);
          tbCon = '';
        }
      }
    }
    tb = tb.format(trCon);
    tbl = tbl.format(th, tb);

    return tbl;
  }
  return null;
}

/**
 * Return just the keys from the input array, optionally only for the specified search_value
 * version: 1109.2015
 *  discuss at: http://phpjs.org/functions/array_keys
 *  +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +      input by: Brett Zamir (http://brett-zamir.me)
 *  +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *  +   improved by: jd
 *  +   improved by: Brett Zamir (http://brett-zamir.me)
 *  +   input by: P
 *  +   bugfixed by: Brett Zamir (http://brett-zamir.me)
 *  *     example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
 *  *     returns 1: {0: 'firstname', 1: 'surname'}
 */
function array_keys(input, search_value, argStrict) {
  var search = typeof search_value !== 'undefined',
      tmp_arr = [],
      strict = !!argStrict,
      include = true,
      key = '';

  if (input && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.change_key_case) {
    // Duck-type check for our own array()-created PHPJS_Array
    return input.keys(search_value, argStrict);
  }

  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true;
      if (search) {
        if (strict && input[key] !== search_value) include = false;else if (input[key] != search_value) include = false;
      }
      if (include) tmp_arr[tmp_arr.length] = key;
    }
  }
  return tmp_arr;
}
var toPercentage = function toPercentage(entity) {
  return (entity * 100).toFixed(1) + '%';
};

var combine = function combine(data) {
  var arglist = data;
  var string = '';
  for (var i = 0; i < arglist.length - 1; i += 1) {
    string = string + arglist[i].text + ', ';
  }
  return string + arglist[arglist.length - 1].text;
};

var features = {
  categories: {
    name: 'Categories',
    description: 'Categorize your content into a 5-level taxonomy. The top three categories will be returned.',
    options: {},
    responseKeys: ['score', 'label'],
    transform: function transform(data) {
      return data.map(function (_ref) {
        var score = _ref.score,
            label = _ref.label;
        return { score: toPercentage(score), label: label };
      });
    }
  },
  concepts: {
    name: 'Concepts',
    description: 'Recognize high-level concepts that are related to your text. For example, analysis of a research paper about deep learning would likely return the concept "Artificial Intelligence", even if that term is not explicitly mentioned in the paper.',
    options: {},
    responseKeys: ['text', 'relevance', 'dbpedia_resource'],
    transform: function transform(data) {
      return data.map(function (_ref2) {
        var text = _ref2.text,
            relevance = _ref2.relevance,
            dbpediaResource = _ref2.dbpediaResource;
        return { text: text, relevance: toPercentage(relevance), dbpedia: dbpediaResource };
      });
    }
  },
  emotion: {
    name: 'Emotion',
    description: 'Detect emotion conveyed by the entire body of text.',
    options: {},
    responseKeys: ['sadness', 'joy', 'fear', 'disgust', 'anger'],
    transform: function transform(_ref3) {
      var document = _ref3.document;
      return Object.keys(document.emotion).map(function (emotion) {
        return { emotion: emotion, score: toPercentage(document.emotion[emotion]) };
      });
    }
  },
  entities: {
    name: 'Entities',
    description: 'Identify people, cities, organizations, and many other types of entities in your text.',
    options: {},
    responseKeys: ['type', 'text', 'relevance', 'count'],
    transform: function transform(data) {
      return data.map(function (_ref4) {
        var type = _ref4.type,
            text = _ref4.text,
            relevance = _ref4.relevance,
            count = _ref4.count;
        return {
          type: type, text: text, relevance: toPercentage(relevance), count: count
        };
      });
    }
  },
  keywords: {
    name: 'Keywords',
    description: 'Identify the important keywords in your content.',
    options: {},
    responseKeys: ['text', 'relevance'],
    transform: function transform(data) {
      return data.map(function (_ref5) {
        var text = _ref5.text,
            relevance = _ref5.relevance;
        return { text: text, relevance: toPercentage(relevance) };
      });
    }
  },
  relations: {
    name: 'Relations',
    description: 'Recognize when two entities are related, and identify the type of relation. For example, an "awardedTo" relation might connect the entities "Nobel Prize" and "Albert Einstein".',
    options: {},
    responseKeys: ['type', 'sentence', 'score'],
    transform: function transform(data) {
      return data.map(function (_ref6) {
        var args = _ref6.arguments,
            score = _ref6.score,
            type = _ref6.type;
        return { type: type, args: combine(args), score: toPercentage(score) };
      });
    }
  },
  semantic_roles: {
    name: 'Semantic Roles',
    description: 'Parse sentences into subject, action, and object form.',
    options: {},
    responseKeys: ['subject', 'object', 'action'],
    transform: function transform(data) {
      return data.map(function (_ref7) {
        var action = _ref7.action,
            object = _ref7.object,
            subject = _ref7.subject;
        return { action: action.text, object: object.text, subject: subject.text };
      });
    }
  },
  sentiment: {
    name: 'Sentiment',
    description: 'Analyze the general sentiment of your content or analyze the sentiment toward specific target phrases found in the text.',
    options: {},
    responseKeys: ['text', 'score', 'label'],
    transform: function transform(_ref8) {
      var document = _ref8.document;
      return [{ score: toPercentage(document.score), label: document.label }];
    }
  }
};

var fieldPaths = [];

function getPaths(contenttype, entry) {
  var paths = [];
  var setUid = void 0;
  function iterrate(schema, currentEntry, uid, setuid) {
    var titlePaths = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    setUid = setuid;
    var uidsPaths = uid ? uid.split('.') : [];
    schema.forEach(function (field) {
      var newUidPaths = [].concat(_toConsumableArray(uidsPaths), [field.uid]);
      var newUid = newUidPaths.join('.');
      if (!currentEntry || currentEntry[field.uid] === undefined) return;
      if (field.data_type === 'text') {
        if (field.multiple === false) {
          var newSetuid = setUid || newUid;
          paths.push({
            uid: newUid,
            path: newUidPaths,
            value: currentEntry[field.uid],
            setUid: newSetuid,
            titlePaths: [].concat(_toConsumableArray(titlePaths), [field.display_name])
          });
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach(function (value, contentIndex) {
            var numericalPath = [].concat(_toConsumableArray(newUidPaths), [contentIndex]);
            var newSetuid = setUid || newUid;
            paths.push({
              uid: numericalPath.join('.'), path: numericalPath, value: value, setUid: newSetuid, titlePaths: [].concat(_toConsumableArray(titlePaths), [field.display_name, contentIndex])
            });
          });
        }
      }
      if (field.data_type === 'group') {
        if (field.multiple === false) {
          iterrate(field.schema, currentEntry[field.uid], newUid, setUid, [].concat(_toConsumableArray(titlePaths), [field.display_name]));
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach(function (value, index) {
            var numericalPath = [].concat(_toConsumableArray(newUidPaths), [index]);
            iterrate(field.schema, value, numericalPath.join('.'), setUid, [].concat(_toConsumableArray(titlePaths), [field.display_name, index]));
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
            setUid = newUid;
            iterrate(newSchema, newValue, numericalPath.join('.'), setUid, [].concat(_toConsumableArray(titlePaths), [field.display_name, index]));
          });
        }
      }
    });
  }
  iterrate(contenttype.schema, entry);
  return paths;
}

function runAnalysis(requestFeatures, text, _ref9) {
  var url = _ref9.url,
      xApiKey = _ref9["x-api-key"];

  var statusCode = void 0;
  return new Promise(function (resolve, reject) {
    var headers = {
      'Content-Type': 'application/json'
    };
    if (xApiKey) {
      headers['x-api-key'] = xApiKey;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text: text, features: requestFeatures }),
      headers: headers
    }).then(function (response) {
      statusCode = response.status;
      return response.json();
    }).then(function (json) {
      if (statusCode === 200) {
        return resolve(json);
      }
      throw Error('Failed to run analysis:' + json.error);
    }).catch(function (err) {
      reject(err);
    });
  });
}

function activaTab(tabId) {
  $('.tab-pane').hide();
  $('#' + tabId).show('');
}

function renderFieldSelectField(extendedField) {
  var previouslySelected = $('#field').val();
  $('#field').empty();
  fieldPaths = getPaths(extendedField.entry.content_type, extendedField.entry.getData());
  fieldPaths.forEach(function (field) {
    var option = $('<option></option>').attr('value', field.uid).text(field.titlePaths.join(' > '));
    if (previouslySelected === field.uid) option.attr('selected', 'selected');
    $('#field').append(option);
  });
}

function renderResult(result, featureArray) {
  $('#result-container').append('<label class="control-label col-sm-offset-2 col-sm-2" for="results" style="margin-left:-14px !important;">Results :</label><select id="results" style="margin-bottom:14px" class="form-control"></select><div id="nav-tabContent"></div>');
  featureArray.forEach(function (fkey, i) {
    $('#results').append($('<option value="nav-' + fkey + '"></option>').text(features[fkey].name));
    var resultSubset = features[fkey].transform(result[fkey]);
    if (resultSubset.length === 0) resultSubset = [{ "Message": 'No results for ' + fkey + ' model' }];
    $('#nav-tabContent').append($(' <div class="tab-pane" id="nav-' + fkey + '" style="display:' + (i === 0 ? 'block' : 'none') + ';" role="tabpanel" aria-labelledby="nav-' + fkey + '-tab">' + ConvertJsonToTable(resultSubset, 'jsonTable', 'table table-bordered table-hover', 'dbpedialink') + '</div>')); // eslint-disable-line
  });
  $('#results').on('change', function () {
    activaTab($('#results').val());
  });
}

function domChangeListner(extendedField) {
  var updateSelectField = function updateSelectField() {
    return renderFieldSelectField(extendedField);
  };
  extendedField.entry.onSave(updateSelectField);

  $('#run-btn').on('click', function (e) {
    e.preventDefault();
    $('#result-container').html('');
    var requestFeatures = {};
    $('#features input[type=checkbox]').each(function (index) {
      var cb = $('#features input[type=checkbox]')[index];
      if (cb.checked) {
        requestFeatures[cb.name] = features[cb.name].options;
      }
    });
    var featureArray = Object.keys(requestFeatures);
    if (featureArray.length === 0) {
      return $('#result-container').append('<div class="alert alert-danger" role="alert">Please select at least one analysis model</div>');
    }

    $('#run-btn').prop('disabled', true);
    $('#run-btn').html('Working on it...');

    runAnalysis(requestFeatures, fieldPaths.find(function (x) {
      return x.uid === $('#field').val();
    }).value, extendedField.config).then(function (data) {
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      renderResult(data, featureArray);
    }).catch(function (error) {
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      $('#result-container').append('<div class="alert alert-danger" role="alert">' + error.message + '</div>');
    });
    return true;
  });
}

function renderModelSelectField() {
  $.each(features, function (key) {
    $('#features').append($('<label></label>').attr('class', 'col-6').append($('<input></input>').attr('name', key).attr('type', 'checkbox').attr('class', 'cs')).append($('<span></span>').attr('class', 'lbl').text(features[key].name)));
  });
}

$(document).ready(function () {
  ContentstackUIExtension.init().then(function (extendedField) {
    extendedField.window.enableAutoResizing();
    renderModelSelectField();
    renderFieldSelectField(extendedField);
    domChangeListner(extendedField);
  });
});