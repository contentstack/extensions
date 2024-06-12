"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionField;
var audiences;
var clipboardJS = new ClipboardJS('.cpbtn');
var optimizely;

var Optimizely = /*#__PURE__*/function () {
  function Optimizely(_ref) {
    var access_token = _ref.access_token,
        project_id = _ref.project_id;

    _classCallCheck(this, Optimizely);

    this.ProjectId = project_id;
    this.AccessToken = access_token;
  }

  _createClass(Optimizely, [{
    key: "getAllExperiments",
    value: function getAllExperiments() {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        var headers = {
          Authorization: "Bearer ".concat(request.AccessToken)
        };
        var url = "https://api.optimizely.com/v2/experiments?project_id=".concat(request.ProjectId);
        fetch(url, {
          method: 'GET',
          headers: headers
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
    key: "getExperimentDetail",
    value: function getExperimentDetail(id) {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        var headers = {
          Authorization: "Bearer ".concat(request.AccessToken)
        };
        var url = "https://api.optimizely.com/v2/experiments/".concat(id);
        fetch(url, {
          method: 'GET',
          headers: headers
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
    key: "getAudiences",
    value: function getAudiences() {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        var headers = {
          Authorization: "Bearer ".concat(request.AccessToken)
        };
        var url = "https://api.optimizely.com/v2/audiences?project_id=".concat(request.ProjectId);
        fetch(url, {
          method: 'GET',
          headers: headers
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
    key: "experimentStartOrStop",
    value: function experimentStartOrStop(ExperimentId, AccessType) {
      var request = this;
      var statusCode;
      return new Promise(function (resolve, reject) {
        var headers = {
          Authorization: "Bearer ".concat(request.AccessToken),
          'Content-Type': 'application/json'
        };
        var url = "https://api.optimizely.com/v2/experiments/".concat(ExperimentId, "?action=").concat(AccessType);
        fetch(url, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify({
            project_id: request.ProjectId
          })
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

function renderToShowExperimentDetails(response) {
  $('.experiment-data, .experiment-key, .audiences').empty();
  $('.experiment-key').append("<div class=\"btn-container\"><button class=\"btn goBack\" data-toggle=\"tooltip\" title=\"Go Back\" type=\"button\"><i class=\"back fa fa-angle-left\"></i></button> <div class=\"keyLabel\">".concat(response.name, "</div> </div>"));
  response.variations.forEach(function (data) {
    if (data.name === undefined) {
      $('.experiment-data').append("<tr><td id=\"".concat(data.variation_id, "\" data-toggle=\"tooltip\" title=\"ID:  ").concat(data.variation_id, "\" class=\"key\">\n          ").concat(data.variation_id, "\n          </td>\n          <td data-toggle=\"tooltip\" title=\"Copy Variation ID\">\n            <button class=\"cpbtn\" data-clipboard-text=\"").concat(data.variation_id, "\"><i class=\"fa fa-copy\"></i></button>\n          </td>\n          <td class=\"weight\"> ").concat(data.weight / 100, "%</td>"));
    } else {
      $('.experiment-data').append("<tr><td id=\"".concat(data.variation_id, "\" data-toggle=\"tooltip\" title=\"ID:  ").concat(data.variation_id, "\nName :  ").concat(data.name, "\" class=\"key\">\n        ").concat(data.name, "\n          </td>\n          <td data-toggle=\"tooltip\" title=\"Copy Variation ID\">\n            <button class=\"cpbtn\" data-clipboard-text=\"").concat(data.variation_id, "\"><i class=\"fa fa-copy\"></i></button>\n          </td>\n          <td class=\"weight\"> ").concat(data.weight / 100, "%</td>"));
    }
  });
  $('.audiences').append('<div data-toggle="tooltip" title="Audiences" class="audienceLabel"><a class="audienceLink" href="" target="_blank"> <div class="audience-btn"></div>Audiences<i class="link fa fa-external-link"></i></a></div>');

  if (response.audience_conditions !== 'everyone') {
    var arrayOfAudiences = JSON.parse('[' + response.audience_conditions + ']');
    arrayOfAudiences.forEach(function (index) {
      index.forEach(function (key) {
        if (typeof key !== 'string') {
          audiences.forEach(function (audience) {
            if (audience.id === key.audience_id) {
              $('.audiences').append("<div class=\"keyName\" id=\"".concat(audience.id, "\">").concat(audience.name, "</div>"));
            }
          });
        }
      }); // $('.audiences').append('<div class="audience" id="'++'"></div>')
    });
  } else {
    $('.audiences').append('<div class="keyName">Everyone</div>');
  }

  $('#loader').hide();
  $('.experiment-container').show();
  domChangeListnerOfExperimentDetailPage();
}

function renderToListExperiments(response) {
  //  to get previously selected
  $('.experiment-list').empty();
  response.forEach(function (dataSet) {
    if (dataSet.status === 'not_started') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n    + <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Run\"><button id=\"start\" class=\"action\" data-title=\"Run\"><span><i class=\"fa fa-play\"></i></span></button></p></td>\n    + <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\" class=\"result-icon disabled\"><i class=\"fa fa-bar-chart\"></i></a></p></td>\n    + </tr>"));
      } else {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, " \n Description :  ").concat(dataSet.description, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n    <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Run\"><button id=\"start\" class=\"action\" data-title=\"Run\"><span><i class=\"fa fa-play\"></i></span></button></p></td>\n    <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\" class=\"result-icon disabled\"><i class=\"fa fa-bar-chart\"></i></a></p></td>\n    </tr>"));
      }
    }

    if (dataSet.status === 'paused') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n    <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Run\"><button id=\"start\" class=\"action\" data-title=\"Run\"><span><i class=\"fa fa-play\"></i></span></button></p></td>\n    <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\"><button class=\"result-icon\"><span><i class=\"fa fa-bar-chart\"></i></span></button></p></td>\n    </tr>"));
      } else {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, " \n Description :  ").concat(dataSet.description, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n    <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Run\"><button id=\"start\" class=\"action\" data-title=\"Run\"><span><i class=\"fa fa-play\"></i></span></button></p></td>\n    <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\"><button class=\"result-icon\"><span><i class=\"fa fa-bar-chart\"></i></span></button></p></td>\n    </tr>"));
      }
    }

    if (dataSet.status === 'running') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n   <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Pause\"><button id=\"pause\" class=\"action\" data-title=\"Pause\"><span><i class=\"fa fa-pause\"></i></span></button></p></td>\n    <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\"><button class=\"result-icon\"><span><i class=\"fa fa-bar-chart\"></i></span></button></p></td>\n   </tr>"));
      } else {
        $('.experiment-list').append("<tr><td data-toggle=\"tooltip\" title=\"Type :  ".concat(dataSet.type, " \n Description :  ").concat(dataSet.description, "\" class=\"details\" id=\"").concat(dataSet.id, "\">").concat(dataSet.name, "</td>\n    <td class=\"edit\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Pause\"><button id=\"pause\" class=\"action\" data-title=\"Pause\"><span><i class=\"fa fa-pause\"></i></span></button></p></td>\n   <td class=\"result\"><p data-placement=\"top\" data-toggle=\"tooltip\" title=\"Result\"><a target=\"_blank\" href=\"\" id=\"").concat(dataSet.campaign_id, "\"><button class=\"result-icon\"><span><i class=\"fa fa-bar-chart\"></i></span></button></a></p></td>\n    </tr>"));
      }
    } //  }

  });
  $('#loader').hide();
  $('.container').show();
  domChangeListnerOfExperimentsListPage();
}

function domChangeListnerOfExperimentDetailPage() {
  $('.goBack').click(function () {
    $('.experiment-data, .experiment-key, .audiences').empty();
    $('.labell').css({
      display: 'block'
    });
    $('.new-experiment').css({
      display: 'block'
    });
    $('.table-responsive, .refresh-btn').show();
    $('.experiment-container').hide();
    $('.new-experiment-container').hide();
  });
  $('.audienceLink').click(function (e) {
    var url = "https://app.optimizely.com/v2/projects/".concat(extensionField.config.project_id, "/audiences");
    $(e.currentTarget).attr('href', url);
  });
}

function domChangeListnerOfExperimentsListPage() {
  $('.details').click(function (e) {
    var id = e.currentTarget.id;
    optimizely.getExperimentDetail(id).then(function (response) {
      renderToShowExperimentDetails(response);
    });
    $('.delete-container, .list, .edit-container, .new-experiment-container, .refresh-btn').hide();
    $('.labell').css({
      display: 'none'
    });
    $('.new-experiment').css({
      display: 'none'
    });
    $('#loader').show();
  });
  $('.result-icon').click(function (e) {
    var CampaignId = $(e.currentTarget).parent('a').attr('id');
    var ExperimentId = $(e.currentTarget).parent().parent().parent().siblings('.details').attr('id');
    var url = "https://app.optimizely.com/v2/projects/".concat(extensionField.config.project_id, "/results/").concat(CampaignId, "/experiments/").concat(ExperimentId, "?previousView=EXPERIMENTS");
    $(e.currentTarget).parent('a').attr('href', url);
  });
  $('.add').click(function (e) {
    var url = "https://app.optimizely.com/v2/projects/".concat(extensionField.config.project_id, "/experiments");
    $(e.currentTarget).parent('a').attr('href', url);
  });
  $('.action').click(function (e) {
    var AccessType = e.currentTarget.id;
    $(e.currentTarget).find('span').html('<i class="fa fa-spinner fa-spin"></i>');
    $(e.currentTarget).attr('disabled', 'disabled');
    var ExperimentId = $(e.currentTarget).parent().parent().siblings('.details').attr('id');
    optimizely.experimentStartOrStop(ExperimentId, AccessType).then(function () {
      $(e.currentTarget).parent().parent().parent().find('.result').find('.result-icon').removeClass('disabled');

      if (AccessType === 'start') {
        $(e.currentTarget).attr('id', 'pause').attr('data-title', 'Pause');
        $(e.currentTarget).parent().attr('title', 'Pause');
        $(e.currentTarget).find('span').html('<i class="fa fa-pause"></i>');
      } else {
        $(e.currentTarget).attr('id', 'start').attr('data-title', 'Run');
        $(e.currentTarget).parent().attr('title', 'Run');
        $(e.currentTarget).find('span').html('<i class="fa fa-play">');
      }

      $(e.currentTarget).removeAttr('disabled');
    });
  });
  $('.refresh-btn').click(function () {
    $('.container').hide();
    $('#loader').show();
    optimizely.getAllExperiments().then(function (response) {
      renderToListExperiments(response);
    });
  });
}

$(document).ready(function () {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.
  ContentstackUIExtension.init().then(function (extension) {
    // current extension object
    extensionField = extension;
    $('#loader').show();
    optimizely = new Optimizely(extension.config); // initialize request object using config

    optimizely.getAllExperiments().then(function (response) {
      // Step 2:  Render - Render the data fetched from external service
      renderToListExperiments(response);
    });
    optimizely.getAudiences().then(function (response) {
      audiences = response;
    });
    extensionField.window.enableAutoResizing();
  });
});