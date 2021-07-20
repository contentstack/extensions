"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionField;
var loader;
var unorderedList;
var msg;
var request = {};
var initialList;
var totalVideos;
var loadMoreBtn;
var offset = 0;
var limit = 20;
$(document).ready(function () {
  msg = $('.msg');
  loader = $('.reference-loading');
  unorderedList = $('.list_section ul');
  loadMoreBtn = $('#load-more-button');
  totalVideos = $('.total-count');
  $('.discription_box').hide(); // Step:1 Intializing extension - In this step we try to connect to host window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(function (extension) {
    extensionField = extension;
    request = new Request(extension.config); // store initial data to save extra rest call when search field is empty

    request.getVideoCount().then(function (response) {
      totalVideos.text(response.count);
      request.getBrightcoveVideos().then(function (response) {
        initialList = response; // Step 2:  Render - Render the data fetched from external service

        render(response);
      });
    });
    $(".searchInpput").on("keypress", function (event) {
      // prevent form submit
      var value = $(this).val().toLowerCase();
      offset = 0;

      if (event.keyCode == 13) {
        event.preventDefault();

        if (!value) {
          unorderedList.empty();
          return render(initialList, true);
        }

        request.search(value).then(function (response) {
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
    $(".searchInpput").on("keyup", function (event) {
      // reset if search input is empty
      var value = $(this).val().toLowerCase();
      offset = 0;

      if (!value) {
        unorderedList.empty();
        msg.hide();
        return render(initialList, true);
      }
    });
    extensionField.window.enableAutoResizing();
  });
}); // render function for creating DOM structure

function render(videos, initialRender) {
  var thumbnail;
  var description;
  msg.hide();
  videos.forEach(function (video, index) {
    if (video.state === 'ACTIVE') {
      thumbnail = video.images.thumbnail ? video.images.thumbnail.src : video.images.poster.src;
      description = video.description ? video.description : '';
      unorderedList.append("<li id='".concat(video.id, "'>\n                <section class=\"img-wrapper\"><img src='").concat(thumbnail, "' alt=\"image-6\"></section>\n                 <span class=\"title\"> ").concat(video.name, "</span> \n                <p>").concat(description, "</p></li>"));
    }
  });
  var initialValue = extensionField && extensionField.field && extensionField.field.getData() ? extensionField.field.getData() : null;

  if (initialValue) {
    if (initialValue.includes('blt')) initialValue = initialValue.replace('blt', '');
    $('.discription_box ul').empty();
    request.getInitialVideo(initialValue).then(function (video) {
      thumbnail = video.images.thumbnail ? video.images.thumbnail.src : video.images.poster.src;
      description = video.description ? video.description : '';
      $('.discription_box ul').append("<li id='".concat(video.id, "'>\n                <section class=\"img-wrapper\"><img src='").concat(thumbnail, "' alt=\"image-6\"></section>\n                <span class=\"title\">").concat(video.name, "</span>\n                <p>").concat(description, "</p></li>"));
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

  if ($(".list_section ul li").length === parseInt(totalVideos.text()) || $(".list_section ul li").length >= parseInt(totalVideos.text())) {
    loadMoreBtn.hide();
  } else {
    loadMoreBtn.show();
  }

  $('.load-more').removeClass('load-spinner');
  $('.discription_box').show(); // on click function choose video button

  $('.choose_video').click(function (e) {
    $('.list_section').show();
  });
  domChangeListner();
} //eventlistner function


function domChangeListner() {
  var anchor = $('.list_section ul li');
  $('.list_section ul li section').click(function (e) {
    e.preventDefault();
    $('.list_section ul li').removeClass('selected');
    $(this).parent().addClass('selected');
  });
  anchor.click(function () {
    var box = $(this)[0].outerHTML;
    extensionField.field.setData($(this).attr('id')).then(function () {
      $('.discription_box ul').html(box);
      $('.list_section').hide();
    })["catch"](function (error) {
      console.log('error in setting data', error);
    });
  });
}

function loadMore() {
  loadMoreBtn.addClass('load-spinner');
  offset += limit;
  request.getBrightcoveVideos().then(function (response) {
    loadMoreBtn.removeClass('loadspin');
    render(response);
  });
} // function for sending XHR request and getting data


function getData(data) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(data.method, data.url);
    loader.show();

    for (var key in data.headers) {
      if (data.headers.hasOwnProperty(key)) {
        req.setRequestHeader(key, data.headers[key]);
      }
    }

    req.onload = function (e) {
      if (req.status == 200) {
        loader.hide();
        var data = JSON.parse(req.response);
        resolve(data);
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function () {
      reject(Error("Network Error"));
    };

    if (data.data) {
      req.send(data.data);
    } else {
      req.send();
    }
  });
} // class request 


var Request = /*#__PURE__*/function () {
  function Request() {
    _classCallCheck(this, Request);
  }

  _createClass(Request, [{
    key: "getVideoCount",
    value: //function for retrieving videos from brightcoove
    function getVideoCount() {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      var data = "client_id=".concat(extensionField.config.client_id, "&client_secret=").concat(extensionField.config.client_secret, "&grant_type=client_credentials");
      var url = extensionField.config.oauthUrl;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'POST',
          data: data
        }).then(function (data) {
          return data;
        }).then(function (data) {
          var headers = {
            "Authorization": "Bearer ".concat(data.access_token)
          };
          var url = extensionField.config.videocountUrl;
          getData({
            url: url,
            headers: headers,
            method: 'GET'
          }).then(function (data) {
            resolve(data);
          })["catch"](function (err) {
            throw err;
          });
        });
      });
    } //function for retieving saved videos from ID

  }, {
    key: "getInitialVideo",
    value: function getInitialVideo(id) {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      var data = "client_id=".concat(extensionField.config.client_id, "&client_secret=").concat(extensionField.config.client_secret, "&grant_type=client_credentials");
      var url = extensionField.config.oauthUrl;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'POST',
          data: data
        }).then(function (data) {
          return data;
        }).then(function (data) {
          var headers = {
            "Authorization": "Bearer ".concat(data.access_token)
          };
          var url = "".concat(extensionField.config.brightcoveUrl, "/").concat(id);
          getData({
            url: url,
            headers: headers,
            method: 'GET'
          }).then(function (data) {
            resolve(data);
          })["catch"](function (error) {
            loader.hide();
            msg.show();
          });
        })["catch"](function (err) {
          reject(err);
        });
      });
    } //function for searching videos

  }, {
    key: "search",
    value: function search(keyword) {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      var data = "client_id=".concat(extensionField.config.client_id, "&client_secret=").concat(extensionField.config.client_secret, "&grant_type=client_credentials");
      var url = extensionField.config.oauthUrl;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'POST',
          data: data
        }).then(function (data) {
          return data;
        }).then(function (data) {
          var headers = {
            "Authorization": "Bearer ".concat(data.access_token)
          };
          var url = "".concat(extensionField.config.searchUrl).concat(keyword);
          getData({
            url: url,
            headers: headers,
            method: 'GET'
          }).then(function (data) {
            resolve(data);
          })["catch"](function (error) {
            console.log(error);
            loader.hide();
            msg.show();
          });
        })["catch"](function (err) {
          reject(err);
        });
      });
    } //function for retrieving videos from brightcoove

  }, {
    key: "getBrightcoveVideos",
    value: function getBrightcoveVideos() {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      var data = "client_id=".concat(extensionField.config.client_id, "&client_secret=").concat(extensionField.config.client_secret, "&grant_type=client_credentials");
      var url = extensionField.config.oauthUrl;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'POST',
          data: data
        }).then(function (data) {
          return data;
        }).then(function (data) {
          var headers = {
            "Authorization": "Bearer ".concat(data.access_token)
          };
          var url = "".concat(extensionField.config.brightcoveUrl, "?limit=").concat(limit, "&offset=").concat(offset);
          getData({
            url: url,
            headers: headers,
            method: 'GET'
          }).then(function (data) {
            resolve(data);
          })["catch"](function (err) {
            throw err;
          });
        });
      });
    }
  }]);

  return Request;
}();