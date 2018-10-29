let extensionField;
let loader;
let videoList;
let messageContainer;
let youtube;
let nextPageToken;
let previousQuery;
let loadMoreButton;
let searchInput;
let hideButton;
let chooseButton;
let videoListSection;
let initialResponse;
let currentVideoList = [];


class Youtube {
  constructor({ api_key: apiKey, channel_id: channelId }) {
    this.apiKey = apiKey;
    this.channelId = channelId;
  }

  getVideos(query = '', limit = 6) {
    let setting = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&key=${setting.apiKey}&channelId=${setting.channelId}&type=video${query ? `&q=${query}` : '&order=date'}&pageToken=${nextPageToken || ''}`, {
        method: 'GET'
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if (statusCode === 200) {
          return resolve(response);
        }
        throw Error('Failed to fetch videos from Youtube');
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

function displayMessage(message = 'No videos found') {
  messageContainer.text(message);
  videoListSection.show();
  messageContainer.show();
  loader.hide();
}


function close() {
  hideButton.hide();
  chooseButton.show();
  videoListSection.hide();
}

function deselectVideo() { // eslint-disable-line no-unused-vars
  $('#selected-video').html(' ');
  extensionField.field.setData(null);
}


function selectVideo(video) {
  let selectedContainer = `<div class="col-xs-6 col-sm-4 col-md-3" title="${video.title}"><li>
                              <div class="img-wrapper">
                                  <img class="thumbnail"  src="${video.thumbnails.medium.url}">
                              </div>
                              <span class="title truncate">${video.title}</span>
                              <span title="Remove video" onclick="deselectVideo()" id="close-button">×</span>
                          </li></div>`;
  $('#selected-video').html(selectedContainer);
}

// eventlistner function
function domChangeListner() {
  let listElement = $('#video-list li');
  listElement.click((e) => {
    let selectedVideo = currentVideoList.find(v => v.id.videoId === e.currentTarget.id);
    let selectedVideoData = selectedVideo.snippet;
    selectedVideoData.videoId = selectedVideo.id.videoId;
    extensionField.field.setData(selectedVideoData).then(() => {
      selectVideo(selectedVideoData);
      close();
    });
  });
}


function render({ items: videos = [], nextPageToken: token }) {
  if (videos.length === 0) {
    loader.hide();
    videoList.empty();
    displayMessage();
    return;
  }

  currentVideoList.push(...videos);
  nextPageToken = token;
  if (nextPageToken) {
    loadMoreButton.show();
  } else {
    loadMoreButton.hide();
  }
  loader.hide();
  messageContainer.hide();

  for (let index = 0; index < videos.length; index += 1) {
    videoList.append(`<li class="col-xs-6 col-sm-4 col-md-3" title="${videos[index].snippet.title }"  id="${videos[index].id.videoId}">
                              <div class="box">
                              <div class="img-wrapper">
                                <img class="thumbnail" src="${videos[index].snippet.thumbnails.medium.url}" alt="image-6">
                              </div>
                              <span class="title truncate">${videos[index].snippet.title }</span>
                              </div>
                          </li>`);
  }

  domChangeListner();
}

function loadMore() { // eslint-disable-line no-unused-vars
  loadMoreButton.addClass('loadspin');
  youtube.getVideos(previousQuery).then((response) => {
    loadMoreButton.removeClass('loadspin');
    render(response);
  });
}

function reset() {
  previousQuery = '';
  videoList.empty();
  currentVideoList = [];
  searchInput.val('');
  return render(initialResponse);
}

function intializeVideoList() {
  messageContainer = $('#message-container');
  loader = $('.reference-loading');
  videoList = $('#video-list');
  videoListSection = $('#choose-video-section');
  youtube = new Youtube(extensionField.config);

  youtube.getVideos().then((response) => { // get first six videos
    initialResponse = response;
    render(response);
    chooseButton.show();
  }).catch(displayMessage.bind(null, 'Error in fetching videos from Youtube'));
}

function initialzieSearchField() {
  searchInput.on('keypress', (event) => { // prevent form submit
    let value = searchInput.val().toLowerCase();
    if (event.keyCode === 13) {
      event.preventDefault();
      if (value === previousQuery) {
        return;
      }
      loader.show();
      loadMoreButton.hide();
      videoList.empty();
      nextPageToken = '';
      youtube.getVideos(value).then((response) => {
        previousQuery = value;
        render(response);
      });
    }
  });

  searchInput.blur(() => {
    if (searchInput.val().length === 0 && previousQuery) {
      reset();
    }
  });
}

function initalizeButtons() {
  loadMoreButton = $('#load-more-button');
  searchInput = $('#search-input');
  hideButton = $('#hide-button');
  chooseButton = $('#choose-button');

  chooseButton.click(() => {
    hideButton.show();
    chooseButton.hide();
    videoListSection.show();
    reset();
  });

  hideButton.click(close);
}


$(document).ready(() => {
  ContentstackUIExtension.init().then((extension) =>{
    extensionField = extension;
    extensionField.window.enableAutoResizing();
    let previouslySelectedVideo = extensionField.field.getData();

    if (previouslySelectedVideo && !$.isEmptyObject(previouslySelectedVideo)) {
      selectVideo(previouslySelectedVideo);
    }

    intializeVideoList();
    initalizeButtons();
    initialzieSearchField();
  });
});
