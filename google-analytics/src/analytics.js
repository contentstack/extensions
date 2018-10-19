let extensionField;
let analytics;
let pagePath;

class Analytics {
  constructor({ url, view_id: viewId, 'x-api-key': xApiKey }) {
    this.baseUrl = url;
    this.viewId = viewId;
    this.xApiKey = xApiKey;
  }

  getData(path, days = 30) {
    let request = this;
    let headers = {};
    if (request.xApiKey) {
      headers['x-api-key'] = request.xApiKey;
    }
    return fetch(`${request.baseUrl}?view_id=${request.viewId}&start_date=${days}daysAgo&end_date=today&metrics=ga:pageviews,ga:uniquePageviews,ga:users,ga:newUsers,ga:avgTimeOnPage,ga:pageLoadTime,ga:bounceRate&dimensions=ga:date&filters=ga:pagePath==${path}`, {
      method: 'GET',
      headers
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error('Error in fetching data.</br>Please check extension configuration.');
      }).catch((e) => {
        return Promise.reject(e);
      });
  }
}

function toggleLoader(state) {
  document.getElementById('loader').style.display = state ? 'block' : 'none';
}

function toggleButtons(state) {
  let buttons = document.getElementsByClassName('btn cs-btn-primary');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].disabled = state;
  }
  toggleLoader(state);
}

function formatDate(date) {
  let year = date[0] + date[1] + date[2] + date[3];
  let month = date[4] + date[5];
  let day = date[6] + date[7];
  return `${year}-${month}-${day}`;
}

function addPadding(time) {
  return time.length === 1 ? `0${time}` : `${time}`;
}

function formatTime(timeInSeconds) {
  let hour;
  let minutes;
  let seconds;
  let remainder = timeInSeconds;
  remainder %= (24 * 3600);
  hour = (remainder / 3600).toFixed();
  remainder %= 3600;
  minutes = (remainder / 60).toFixed();
  remainder %= 60;
  seconds = remainder.toFixed();
  return `${addPadding(hour)}:${addPadding(minutes)}:${addPadding(seconds)}`;
}

function drawChart(analyticsData, chartIndex) {
  let dataTable = google.visualization.arrayToDataTable(analyticsData);
  let chart = new google.visualization.AreaChart(document.getElementById('chart_container_' + chartIndex));
  let options = {
    hAxis: { textPosition: 'none' },
    vAxis: { minValue: 0 },
    legend: 'none',
    colors: ['#098ec8']
  };
  chart.draw(dataTable, options);
}


function renderMetric(analyticsData, sum, chartIndex, name) {
  let mainBody = document.getElementById('canvasbody');
  mainBody.innerHTML += `<div class="metric-details"><p>${name}</p><h1>${sum}</h1></div><div id="chart_container_${chartIndex}"></div><hr class="line">`;
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(drawChart.bind(null, analyticsData, chartIndex));
}

function displayError(message) {
  let errorbody = document.getElementById('error');
  errorbody.innerHTML = `<p>${message}</p>`;
}


function renderData(response) {
  let pageViews;
  let uniquePageViews;
  let user;
  let newUser;
  let averageTimeOnPage;
  let pageLoadTime;
  let bounceRate;
  let totalPageViews = response.totalsForAllResults['ga:pageviews'];
  let totalUniquePageViews = response.totalsForAllResults['ga:uniquePageviews'];
  let totalUser = response.totalsForAllResults['ga:users'];
  let totalNewUser = response.totalsForAllResults['ga:newUsers'];
  let totalAverageTimeOnPage = response.totalsForAllResults['ga:avgTimeOnPage'];
  let totalPageLoadTime = response.totalsForAllResults['ga:pageLoadTime'];
  let totalBounceRate = response.totalsForAllResults['ga:bounceRate'];
  let responseLength;
  pageViews = [
    ['year', 'count']
  ];
  uniquePageViews = [
    ['year', 'count']
  ];
  user = [
    ['year', 'count']
  ];
  newUser = [
    ['year', 'count']
  ];
  averageTimeOnPage = [
    ['year', 'count']
  ];
  pageLoadTime = [
    ['year', 'count']
  ];
  bounceRate = [
    ['year', 'count']
  ];
  responseLength = response.rows.length;
  for (let i = 0; i < responseLength; i += 1) {
    pageViews.push([formatDate((response.rows[i][0])), Number(response.rows[i][1])]);
    uniquePageViews.push([formatDate((response.rows[i][0])), Number(response.rows[i][2])]);
    user.push([formatDate((response.rows[i][0])), Number(response.rows[i][3])]);
    newUser.push([formatDate((response.rows[i][0])), Number(response.rows[i][4])]);
    averageTimeOnPage.push([formatDate((response.rows[i][0])), Number(response.rows[i][5])]);
    pageLoadTime.push([formatDate((response.rows[i][0])), Number(response.rows[i][6])]);
    bounceRate.push([formatDate((response.rows[i][0])), Number(response.rows[i][7])]);
  }

  if (Number(totalPageViews) || Number(totalUniquePageViews) || Number(totalUser)
    || Number(totalNewUser) || Number(totalAverageTimeOnPage) || Number(totalPageLoadTime)
     || Number(totalBounceRate)) {
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

function loadIntervalData(days, button) { // eslint-disable-line no-unused-lets
  document.getElementById('error').innerHTML = ' ';
  document.getElementById('link').style.display = 'none';
  document.getElementById('canvasbody').innerHTML = '';
  let buttons = document.getElementsByClassName('btn cs-btn-primary');
  let that = button;
  for (let j = 0; j < buttons.length; j += 1) buttons[j].style.backgroundColor = 'white';
  that.style.backgroundColor = '#e6eaf2';
  toggleButtons(true);
  analytics.getData(pagePath, days).then((response) => {
    renderData(response);
    toggleButtons(false);
  }).catch((err)=>{
    displayError(err.message);
    toggleButtons(false);
  });
}

ContentstackUIExtension.init().then((extension) => {
  let buttons = document.getElementsByClassName('btn cs-btn-primary');
  extensionField = extension;
  pagePath = extensionField.entry.getField('url').getData();
  analytics = new Analytics(extensionField.config);
  loadIntervalData(30, buttons[3]);
});
