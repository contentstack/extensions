"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionDashboardField;
var analytics;
var currentData;

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

  _createClass(Analytics, [{
    key: "getData",
    value: function getData() {
      var days = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
      var request = this;
      var headers = {};

      if (request.xApiKey) {
        headers['x-api-key'] = request.xApiKey;
      }

      return fetch("".concat(request.baseUrl, "?view_id=").concat(request.viewId, "&start_date=").concat(days, "daysAgo&end_date=today&metrics=ga:pageviews,ga:uniquePageviews,ga:users,ga:newUsers,ga:avgTimeOnPage,ga:pageLoadTime,ga:bounceRate&dimensions=ga:date"), {
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

  return Analytics;
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
    colors: ['#098ec8'],
    backgroundColor: '#F8F8F8'
  };
  chart.draw(dataTable, options);
}

function renderMetric(analyticsData, sum, chartIndex, name) {
  var mainBody = document.getElementById('canvasbody');
  mainBody.innerHTML += "<div class=\"graph-wrap\"><div class=\"metric-details\"><p>".concat(name, "</p><h1>").concat(sum, "</h1></div><div id=\"chart_container_").concat(chartIndex, "\"></div></div>");
  drawChart(analyticsData, chartIndex);
}

function displayError(message) {
  var errorbody = document.getElementById('error');
  errorbody.innerHTML = "<p>".concat(message, "</p>");
}

function renderData(response) {
  document.getElementById('canvasbody').innerHTML = ' ';
  currentData = response || currentData;
  var pageViews;
  var uniquePageViews;
  var user;
  var newUser;
  var averageTimeOnPage;
  var pageLoadTime;
  var bounceRate;
  var totalPageViews = currentData.totalsForAllResults['ga:pageviews'];
  var totalUniquePageViews = currentData.totalsForAllResults['ga:uniquePageviews'];
  var totalUser = currentData.totalsForAllResults['ga:users'];
  var totalNewUser = currentData.totalsForAllResults['ga:newUsers'];
  var totalAverageTimeOnPage = currentData.totalsForAllResults['ga:avgTimeOnPage'];
  var totalPageLoadTime = currentData.totalsForAllResults['ga:pageLoadTime'];
  var totalBounceRate = currentData.totalsForAllResults['ga:bounceRate'];
  var responseLength;
  pageViews = [['year', 'count']];
  uniquePageViews = [['year', 'count']];
  user = [['year', 'count']];
  newUser = [['year', 'count']];
  averageTimeOnPage = [['year', 'count']];
  pageLoadTime = [['year', 'count']];
  bounceRate = [['year', 'count']];
  responseLength = currentData.rows.length;

  for (var i = 0; i < responseLength; i += 1) {
    pageViews.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][1])]);
    uniquePageViews.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][2])]);
    user.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][3])]);
    newUser.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][4])]);
    averageTimeOnPage.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][5])]);
    pageLoadTime.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][6])]);
    bounceRate.push([formatDate(currentData.rows[i][0]), Number(currentData.rows[i][7])]);
  }

  if (Number(totalPageViews) || Number(totalUniquePageViews) || Number(totalUser) || Number(totalNewUser) || Number(totalAverageTimeOnPage) || Number(totalPageLoadTime) || Number(totalBounceRate)) {
    document.getElementById('error').innerHTML = '';
    renderMetric(pageViews, totalPageViews, 1, 'Pageviews');
    renderMetric(uniquePageViews, totalUniquePageViews, 2, 'Unique Pageviews');
    renderMetric(user, totalUser, 3, 'Users');
    renderMetric(newUser, totalNewUser, 4, 'New Users');
    renderMetric(averageTimeOnPage, formatTime(totalAverageTimeOnPage), 5, 'Avg. Time on Page');
    renderMetric(pageLoadTime, formatTime(totalPageLoadTime), 6, 'Page Load Time');
    renderMetric(bounceRate, totalBounceRate + '%', 7, 'Bounce Rate');
  } else {
    document.getElementById('canvasbody').innerHTML = ' ';
    displayError('No data available');
  }

  if (extensionDashboardField.window.state === 'full_width') {
    extensionDashboardField.window.enableAutoResizing();
  }
}

function loadIntervalData(days, button) {
  document.getElementById('error').innerHTML = ' ';
  document.getElementById('canvasbody').innerHTML = '';
  var buttons = document.getElementsByClassName('btn cs-btn-primary');
  var that = button;

  for (var j = 0; j < buttons.length; j += 1) {
    buttons[j].style.backgroundColor = 'white';
  }

  that.style.backgroundColor = '#e6eaf2';
  toggleButtons(true);
  analytics.getData(days).then(function (response) {
    currentData = response;
    renderData(response);
    toggleButtons(false);
  })["catch"](function (err) {
    displayError(err.message);
    toggleButtons(false);
  });
}

ContentstackUIExtension.init().then(function (extension) {
  var buttons = document.getElementsByClassName('btn cs-btn-primary');
  extensionDashboardField = extension;
  google.charts.load('current', {
    packages: ['corechart']
  });
  google.charts.setOnLoadCallback(loadIntervalData.bind(null, 30, buttons[3]));
  extension.window.onDashboardResize(function () {
    setTimeout(function () {
      renderData();
    }, 500);
  });
  analytics = new Analytics(extensionDashboardField.config);
  extensionDashboardField.window.enableResizing();
});