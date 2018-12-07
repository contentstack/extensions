let extensionField;
let audiences;
let clipboardJS = new ClipboardJS('.cpbtn');
let optimizely;
class Optimizely {
  constructor({ access_token, project_id }) {
    this.ProjectId = project_id;
    this.AccessToken = access_token;
  }

  getAllExperiments() {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: `Bearer ${request.AccessToken}`
      };
      let url = `https://api.optimizely.com/v2/experiments?project_id=${request.ProjectId}`;
      fetch(url, {
        method: 'GET',
        headers: headers
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if (statusCode === 200) resolve(response);
        throw Error('Failed to fetch resource');
      }).catch((err) => {
        reject(err);
      });
    });
  }


  getExperimentDetail(id) {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: `Bearer ${request.AccessToken}`
      };
      let url = `https://api.optimizely.com/v2/experiments/${id}`;
      fetch(url, {
        method: 'GET',
        headers: headers
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if (statusCode === 200) resolve(response);
        throw Error('Failed to fetch resource');
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getAudiences() {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: `Bearer ${request.AccessToken}`
      };
      let url = `https://api.optimizely.com/v2/audiences?project_id=${request.ProjectId}`;
      fetch(url, {
        method: 'GET',
        headers: headers
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if (statusCode === 200) resolve(response);
        throw Error('Failed to fetch resource');
      }).catch((err) => {
        reject(err);
      });
    });
  }

  experimentStartOrStop(ExperimentId, AccessType) {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      let headers = {
        Authorization: `Bearer ${request.AccessToken}`,
        'Content-Type': 'application/json'
      };
      let url = `https://api.optimizely.com/v2/experiments/${ExperimentId}?action=${AccessType}`;
      fetch(url, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({
          project_id: request.ProjectId
        })
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if (statusCode === 200) resolve(response);
        throw Error('Failed to fetch resource');
      }).catch((err) => {
        reject(err);
      });
    });
  }
}


function renderToShowExperimentDetails(response) {
  $('.experiment-data, .experiment-key, .audiences').empty();
  $('.experiment-key').append(`<div class="btn-container"><button class="btn goBack" data-toggle="tooltip" title="Go Back" type="button"><i class="back fa fa-angle-left"></i></button> <div class="keyLabel">${response.key}</div> </div>`);
  response.variations.forEach((data) =>{
    if (data.description === undefined) {
      $('.experiment-data').append(`<tr><td id="${data.key}" class="key">${data.key}</td><td data-toggle="tooltip" title="Copy Variation Key"><button class="cpbtn" data-clipboard-target="#${data.key}"><i class="fa fa-copy"></i></button></td><td class="weight"> ${data.weight / 100}%</td>`);
    } else {
      $('.experiment-data').append(`<tr><td data-toggle="tooltip" title="Description :  ${data.description}"  id="${data.key}" class="key">${data.key}</td><td data-toggle="tooltip" title="Copy Variation Key"><button class="cpbtn" data-clipboard-target="#${data.key}"><i class="fa fa-copy"></i></button></td><td class="weight"> ${data.weight / 100}%</td>`);
    }
  });

  $('.audiences').append('<div data-toggle="tooltip" title="Audiences" class="audienceLabel"><a class="audienceLink" href="" target="_blank"> <div class="audience-btn"></div>Audiences<i class="link fa fa-external-link"></i></a></div>');
  if (response.audience_conditions !== 'everyone') {
    let arrayOfAudiences = JSON.parse('[' + response.audience_conditions + ']');
    arrayOfAudiences.forEach((index) =>{
      index.forEach((key)=> {
        if (typeof key !== 'string') {
          audiences.forEach((audience)=>{
            if (audience.id === key.audience_id) {
              $('.audiences').append(`<div class="keyName" id="${audience.id}">${audience.name}</div>`);
            }
          });
        }
      });


    // $('.audiences').append('<div class="audience" id="'++'"></div>')
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
  response.forEach((dataSet) =>{
    if (dataSet.status === 'not_started') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {
        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type}" class="details" id="${dataSet.id}">${dataSet.key}</td>
    + <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Run"><button id="start" class="action" data-title="Run"><span><i class="fa fa-play"></i></span></button></p></td>
    + <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}" class="result-icon disabled"><i class="fa fa-bar-chart"></i></a></p></td>
    + </tr>`);
      } else {
        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type} \n Description :  ${dataSet.description}" class="details" id="${dataSet.id}">${dataSet.key}</td>
    <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Run"><button id="start" class="action" data-title="Run"><span><i class="fa fa-play"></i></span></button></p></td>
    <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}" class="result-icon disabled"><i class="fa fa-bar-chart"></i></a></p></td>
    </tr>`);
      }
    }
    if (dataSet.status === 'paused') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {
        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type}" class="details" id="${dataSet.id}">${dataSet.key}</td>
    <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Run"><button id="start" class="action" data-title="Run"><span><i class="fa fa-play"></i></span></button></p></td>
    <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}"><button class="result-icon"><span><i class="fa fa-bar-chart"></i></span></button></p></td>
    </tr>`);
      } else {
        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type} \n Description :  ${dataSet.description}" class="details" id="${dataSet.id}">${dataSet.key}</td>
    <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Run"><button id="start" class="action" data-title="Run"><span><i class="fa fa-play"></i></span></button></p></td>
    <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}"><button class="result-icon"><span><i class="fa fa-bar-chart"></i></span></button></p></td>
    </tr>`);
      }
    }
    if (dataSet.status === 'running') {
      if (dataSet.description === undefined || dataSet.description.length <= 0) {

        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type}" class="details" id="${dataSet.id}">${dataSet.key}</td>
   <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Pause"><button id="pause" class="action" data-title="Pause"><span><i class="fa fa-pause"></i></span></button></p></td>
    <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}"><button class="result-icon"><span><i class="fa fa-bar-chart"></i></span></button></p></td>
   </tr>`);
      } else {
        $('.experiment-list').append(`<tr><td data-toggle="tooltip" title="Type :  ${dataSet.type} \n Description :  ${dataSet.description}" class="details" id="${dataSet.id}">${dataSet.key}</td>
    <td class="edit"><p data-placement="top" data-toggle="tooltip" title="Pause"><button id="pause" class="action" data-title="Pause"><span><i class="fa fa-pause"></i></span></button></p></td>
   <td class="result"><p data-placement="top" data-toggle="tooltip" title="Result"><a target="_blank" href="" id="${dataSet.campaign_id}"><button class="result-icon"><span><i class="fa fa-bar-chart"></i></span></button></a></p></td>
    </tr>`);
      }
    }
  //  }
  });
  $('#loader').hide();
  $('.container').show();

  domChangeListnerOfExperimentsListPage();
}
function domChangeListnerOfExperimentDetailPage() {
  $('.goBack').click(()=> {
    $('.experiment-data, .experiment-key, .audiences').empty();
    $('.labell').css({ display: 'block' });
    $('.new-experiment').css({ display: 'block' });
    $('.table-responsive, .refresh-btn').show();
    $('.experiment-container').hide();
    $('.new-experiment-container').hide();
  });

  $('.audienceLink').click((e)=>{
    let url = `https://app.optimizely.com/v2/projects/${extensionField.config.project_id}/audiences`;
    $(e.currentTarget).attr('href', url);
  });
}
function domChangeListnerOfExperimentsListPage() {
  $('.details').click((e) =>{
    var id = e.currentTarget.id;
    optimizely.getExperimentDetail(id).then((response) => {
      renderToShowExperimentDetails(response);
    });

    $('.delete-container, .list, .edit-container, .new-experiment-container, .refresh-btn').hide();
    $('.labell').css({ display: 'none' });
    $('.new-experiment').css({ display: 'none' });
    $('#loader').show();
  });


  $('.result-icon').click((e)=> {
    console.log(e.currentTarget, e.current);
    var CampaignId = $(e.currentTarget).parent('a').attr('id');
    var ExperimentId = $(e.currentTarget).parent().parent().parent()
      .siblings('.details')
      .attr('id');

    let url = `https://app.optimizely.com/v2/projects/${extensionField.config.project_id}/results/${CampaignId}/experiments/${ExperimentId}?previousView=EXPERIMENTS`;

    $(e.currentTarget).parent('a').attr('href', url);
  });


  $('.add').click((e)=>{
    let url = `https://app.optimizely.com/v2/projects/${extensionField.config.project_id}/experiments`;
    $(e.currentTarget).parent('a').attr('href', url);
  });

  $('.action').click((e)=> {
    let AccessType = e.currentTarget.id;
    $(e.currentTarget).find('span').html('<i class="fa fa-spinner fa-spin"></i>');
    $(e.currentTarget).attr('disabled', 'disabled');
    let ExperimentId = $(e.currentTarget).parent().parent().siblings('.details')
      .attr('id');
    optimizely.experimentStartOrStop(ExperimentId, AccessType).then(() => {
      $(e.currentTarget).parent().parent().parent()
        .find('.result')
        .find('.result-icon')
        .removeClass('disabled');

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

  $('.refresh-btn').click(()=> {
    $('.container').hide();
    $('#loader').show();
    optimizely.getAllExperiments().then((response) => {
      renderToListExperiments(response);
    });
  });
}

$(document).ready(() => {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(extension => { // current extension object
    extensionField = extension;
    $('#loader').show();
    optimizely = new Optimizely(extension.config); // initialize request object using config
    optimizely.getAllExperiments().then((response) => {
      // Step 2:  Render - Render the data fetched from external service

      renderToListExperiments(response);
    });

    optimizely.getAudiences().then((response) => {
      audiences = response;
    });

    extensionField.window.enableAutoResizing();
  });
});
