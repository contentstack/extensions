"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var extensionField;
var analytics;
var pagePath;
var Analytics = /*#__PURE__*/function () {
  function Analytics(_ref) {
    var url = _ref.url,
      viewId = _ref.view_id,
      xApiKey = _ref['x-api-key'];
    _classCallCheck(this, Analytics);
    this.baseUrl = url;
    this.viewId = viewId;
    this.xApiKey = xApiKey;
  }
  return _createClass(Analytics, [{
    key: "getData",
    value: function getData(path) {
      var days = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
      var request = this;
      var headers = {};
      if (request.xApiKey) {
        headers['x-api-key'] = request.xApiKey;
      }
      return fetch("".concat(request.baseUrl, "?view_id=").concat(request.viewId, "&start_date=").concat(days, "daysAgo&end_date=today&metrics=ga:pageviews,ga:uniquePageviews,ga:users,ga:newUsers,ga:avgTimeOnPage,ga:pageLoadTime,ga:bounceRate&dimensions=ga:date&filters=ga:pagePath==").concat(path), {
        method: 'GET',
        headers: headers
      }).then(function (res) {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error('Error in fetching data.</br>Please check extension configuration.');
      })["catch"](function (e) {
        return Promise.reject(e);
      });
    }
  }]);
}();
function toggleLoader(state) {
  document.getElementById('loader').style.display = state ? 'block' : 'none';
}
function toggleButtons(state) {
  var buttons = document.getElementsByClassName('btn cs-btn-primary');
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].disabled = state;
  }
  toggleLoader(state);
}
function formatDate(date) {
  var year = date[0] + date[1] + date[2] + date[3];
  var month = date[4] + date[5];
  var day = date[6] + date[7];
  return "".concat(year, "-").concat(month, "-").concat(day);
}
function addPadding(time) {
  return time.length === 1 ? "0".concat(time) : "".concat(time);
}
function formatTime(timeInSeconds) {
  var hour;
  var minutes;
  var seconds;
  var remainder = timeInSeconds;
  remainder %= 24 * 3600;
  hour = (remainder / 3600).toFixed();
  remainder %= 3600;
  minutes = (remainder / 60).toFixed();
  remainder %= 60;
  seconds = remainder.toFixed();
  return "".concat(addPadding(hour), ":").concat(addPadding(minutes), ":").concat(addPadding(seconds));
}
function drawChart(analyticsData, chartIndex) {
  var dataTable = google.visualization.arrayToDataTable(analyticsData);
  var chart = new google.visualization.AreaChart(document.getElementById('chart_container_' + chartIndex));
  var options = {
    hAxis: {
      textPosition: 'none'
    },
    vAxis: {
      minValue: 0
    },
    legend: 'none',
    colors: ['#098ec8']
  };
  chart.draw(dataTable, options);
}
function renderMetric(analyticsData, sum, chartIndex, name) {
  var mainBody = document.getElementById('canvasbody');
  mainBody.innerHTML += "<div class=\"metric-details\"><p>".concat(name, "</p><h1>").concat(sum, "</h1></div><div id=\"chart_container_").concat(chartIndex, "\"></div><hr class=\"line\">");
  google.charts.load('current', {
    packages: ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart.bind(null, analyticsData, chartIndex));
}
function displayError(message) {
  var errorbody = document.getElementById('error');
  errorbody.innerHTML = "<p>".concat(message, "</p>");
}
function renderData(response) {
  var pageViews;
  var uniquePageViews;
  var user;
  var newUser;
  var averageTimeOnPage;
  var pageLoadTime;
  var bounceRate;
  var totalPageViews = response.totalsForAllResults['ga:pageviews'];
  var totalUniquePageViews = response.totalsForAllResults['ga:uniquePageviews'];
  var totalUser = response.totalsForAllResults['ga:users'];
  var totalNewUser = response.totalsForAllResults['ga:newUsers'];
  var totalAverageTimeOnPage = response.totalsForAllResults['ga:avgTimeOnPage'];
  var totalPageLoadTime = response.totalsForAllResults['ga:pageLoadTime'];
  var totalBounceRate = response.totalsForAllResults['ga:bounceRate'];
  var responseLength;
  pageViews = [['year', 'count']];
  uniquePageViews = [['year', 'count']];
  user = [['year', 'count']];
  newUser = [['year', 'count']];
  averageTimeOnPage = [['year', 'count']];
  pageLoadTime = [['year', 'count']];
  bounceRate = [['year', 'count']];
  responseLength = response.rows.length;
  for (var i = 0; i < responseLength; i += 1) {
    pageViews.push([formatDate(response.rows[i][0]), Number(response.rows[i][1])]);
    uniquePageViews.push([formatDate(response.rows[i][0]), Number(response.rows[i][2])]);
    user.push([formatDate(response.rows[i][0]), Number(response.rows[i][3])]);
    newUser.push([formatDate(response.rows[i][0]), Number(response.rows[i][4])]);
    averageTimeOnPage.push([formatDate(response.rows[i][0]), Number(response.rows[i][5])]);
    pageLoadTime.push([formatDate(response.rows[i][0]), Number(response.rows[i][6])]);
    bounceRate.push([formatDate(response.rows[i][0]), Number(response.rows[i][7])]);
  }
  if (Number(totalPageViews) || Number(totalUniquePageViews) || Number(totalUser) || Number(totalNewUser) || Number(totalAverageTimeOnPage) || Number(totalPageLoadTime) || Number(totalBounceRate)) {
    document.getElementById('error').innerHTML = '';
    document.getElementById('link').style.display = 'block';
    renderMetric(pageViews, totalPageViews, 1, 'Pageviews');
    renderMetric(uniquePageViews, totalUniquePageViews, 2, 'Unique Pageviews');
    renderMetric(user, totalUser, 3, 'Users');
    renderMetric(newUser, totalNewUser, 4, 'New Users');
    renderMetric(averageTimeOnPage, formatTime(totalAverageTimeOnPage), 5, 'Avg. Time on Page');
    renderMetric(pageLoadTime, formatTime(totalPageLoadTime), 6, 'Page Load Time');
    renderMetric(bounceRate, totalBounceRate + '%', 7, 'Bounce Rate');
  } else {
    document.getElementById('canvasbody').innerHTML = ' ';
    document.getElementById('link').style.display = 'none';
    displayError('No data available');
  }
}
function loadIntervalData(days, button) {
  // eslint-disable-line no-unused-lets
  document.getElementById('error').innerHTML = ' ';
  document.getElementById('link').style.display = 'none';
  document.getElementById('canvasbody').innerHTML = '';
  var buttons = document.getElementsByClassName('btn cs-btn-primary');
  var that = button;
  for (var j = 0; j < buttons.length; j += 1) buttons[j].style.backgroundColor = 'white';
  that.style.backgroundColor = '#e6eaf2';
  toggleButtons(true);
  analytics.getData(pagePath, days).then(function (response) {
    renderData(response);
    toggleButtons(false);
  })["catch"](function (err) {
    displayError(err.message);
    toggleButtons(false);
  });
}
ContentstackUIExtension.init().then(function (extension) {
  var buttons = document.getElementsByClassName('btn cs-btn-primary');
  extensionField = extension;
  pagePath = extensionField.entry.getField('url').getData();
  analytics = new Analytics(extensionField.config);
  loadIntervalData(30, buttons[3]);
});