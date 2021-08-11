let extensionField;
let loader;
let unorderedList;
let msg;
let request = {};
let initialList;
let totalVideos;
let loadMoreBtn;
let offset = 0;
const limit = 20;

const headers = {
  'Content-Type': 'application/json',
};

$(document).ready(function () {
  msg = $('.msg');
  loader = $('.reference-loading');
  unorderedList = $('.list_section ul');
  loadMoreBtn = $('#load-more-button');
  totalVideos = $('.total-count');
  $('.discription_box').hide();
  // Step:1 Intializing extension - In this step we try to connect to host window using postMessage API and get intial data.
  ContentstackUIExtension.init().then(function (extension) {
    extensionField = extension;
    request = new Request(extension.config);
    // store initial data to save extra rest call when search field is empty
    request.getVideoCount().then((response) => {
      totalVideos.text(response.count);
      request.getBrightcoveVideos().then((response) => {
        initialList = response;
        // Step 2:  Render - Render the data fetched from external service
        render(response);
      });
    });

    $('.searchInpput').on('keypress', function (event) {
      // prevent form submit
      let value = $(this).val().toLowerCase();
      offset = 0;
      if (event.keyCode == 13) {
        event.preventDefault();
        if (!value) {
          unorderedList.empty();
          return render(initialList, true);
        }
        request.search(value).then((response) => {
          if (response.length === 0) {
            unorderedList.empty();
            loadMoreBtn.hide();
            loader.hide();
            msg.show();
            return;
          }
          unorderedList.empty();
          render(response, true);
        });
      }
    });

    $('.searchInpput').on('keyup', function (event) {
      // reset if search input is empty
      let value = $(this).val().toLowerCase();
      offset = 0;

      if (!value) {
        unorderedList.empty();
        msg.hide();
        return render(initialList, true);
      }
    });
    extensionField.window.enableAutoResizing();
  });
});

// render function for creating DOM structure
function render(videos, initialRender) {
  let thumbnail;
  let description;
  msg.hide();
  videos.forEach(function (video, index) {
    if (video.state === 'ACTIVE') {
      thumbnail = video.images.thumbnail
        ? video.images.thumbnail.src
        : video.images.poster.src;
      description = video.description ? video.description : '';
      unorderedList.append(`<li id='${video.id}'>
                <section class="img-wrapper"><img src='${thumbnail}' alt="image-6"></section>
                 <span class="title"> ${video.name}</span> 
                <p>${description}</p></li>`);
    }
  });

  var initialValue =
    extensionField && extensionField.field && extensionField.field.getData()
      ? extensionField.field.getData()
      : null;

  if (initialValue) {
    if (initialValue.includes('blt'))
      initialValue = initialValue.replace('blt', '');

    $('.discription_box ul').empty();
    request.getInitialVideo(initialValue).then((video) => {
      thumbnail = video.images.thumbnail
        ? video.images.thumbnail.src
        : video.images.poster.src;
      description = video.description ? video.description : '';
      $('.discription_box ul').append(`<li id='${video.id}'>
                <section class="img-wrapper"><img src='${thumbnail}' alt="image-6"></section>
                <span class="title">${video.name}</span>
                <p>${description}</p></li>`);
    });

    $('.discription_box ul li a').click(function (e) {
      e.preventDefault();
    });
    setTimeout(function () {
      if (!initialRender) {
        extensionField.window.updateHeight();
      }
    }, 1000);
  }

  if (
    $('.list_section ul li').length === parseInt(totalVideos.text()) ||
    $('.list_section ul li').length >= parseInt(totalVideos.text())
  ) {
    loadMoreBtn.hide();
  } else {
    loadMoreBtn.show();
  }

  $('.load-more').removeClass('load-spinner');
  $('.discription_box').show();
  // on click function choose video button
  $('.choose_video').click(function (e) {
    $('.list_section').show();
  });
  domChangeListner();
}

//eventlistner function
function domChangeListner() {
  let anchor = $('.list_section ul li');
  $('.list_section ul li section').click(function (e) {
    e.preventDefault();
    $('.list_section ul li').removeClass('selected');
    $(this).parent().addClass('selected');
  });

  anchor.click(function () {
    var box = $(this)[0].outerHTML;
    extensionField.field
      .setData($(this).attr('id'))
      .then(function () {
        $('.discription_box ul').html(box);
        $('.list_section').hide();
      })
      .catch(function (error) {
        console.log('error in setting data', error);
      });
  });
}

function loadMore() {
  loadMoreBtn.addClass('load-spinner');
  offset += limit;
  request.getBrightcoveVideos().then((response) => {
    loadMoreBtn.removeClass('loadspin');
    render(response);
  });
}

// function for sending request and getting data
function getData(data) {
  return new Promise(function (resolve, reject) {
    const axisObj = {
      method: data.method,
      url: data.url,
      headers: data.headers,
      data: data.data,
    };
    loader.show();
    axios(axisObj)
      .then((response) => {
        loader.hide();
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// class request
class Request {
  //function for retrieving videos from brightcoove
  getVideoCount() {
    return new Promise((resolve, reject) => {

      const { proxyUrl, videocountUrl } = extensionField.config;
      const data = JSON.stringify({
        "authUrl": `/v4/access_token`,
        "videoUrl": `${videocountUrl}`,
      });
      getData({ url: proxyUrl, headers, method: 'POST', data })
        .then(function (data) {
          resolve(data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  //function for retieving saved videos from ID
  getInitialVideo(id) {
    return new Promise((resolve, reject) => {
      const { proxyUrl, brightcoveUrl } = extensionField.config;
      const data = JSON.stringify({
        authUrl: `/v4/access_token`,
        videoUrl: `${brightcoveUrl}/${id}`,
      });
      getData({ url: proxyUrl, method: 'POST', headers, data })
        .then(function (data) {
          resolve(data);
        })
        .catch(function (error) {
          loader.hide();
          msg.show();
          reject(error);
        });
    });
  }

  //function for searching videos
  search(keyword) {
    return new Promise((resolve, reject) => {
      const { proxyUrl, searchUrl } = extensionField.config;
      const data = JSON.stringify({
        authUrl: `/v4/access_token`,
        videoUrl: `${searchUrl + keyword}`,
      });
      getData({ url: proxyUrl, method: 'POST', headers, data })
        .then(function (data) {
          resolve(data);
        })
        .catch(function (error) {
          loader.hide();
          msg.show();
          reject(error);
        });
    });
  }

  //function for retrieving videos from brightcoove
  getBrightcoveVideos() {
    return new Promise((resolve, reject) => {
      const { proxyUrl, brightcoveUrl } = extensionField.config;
      const data = JSON.stringify({
        authUrl: `/v4/access_token`,
        videoUrl: `${brightcoveUrl}?limit=${limit}&offset=${offset}`,
      });

      getData({ url: proxyUrl, method: 'POST', headers, data })
        .then(function (data) {
          resolve(data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
