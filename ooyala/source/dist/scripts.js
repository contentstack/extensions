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
$(document).ready(function () {
  msg = $('.msg');
  loader = $('.reference-loading');
  unorderedList = $('.list_section ul'); // Step:1 Intializing extension - In this step we try to connect to host window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(function (extension) {
    extensionField = extension;
    console.log(extensionField.config);
    request = new Request(extension.config); // let initialList; // store initial data to save extra rest call when search field is empty

    request.ooyalaVideos().then(function (response) {
      console.log(response, "res-------");
      initialList = response; // Step 2:  Render - Render the data fetched from external service

      render(response);
    });
    extensionField.window.enableAutoResizing();
  });
}); // render function for creating DOM structure

function render(videos) {
  unorderedList.empty();
  msg.hide();
  console.log(videos, "-----------------------------");
  videos.forEach(function (video, index) {
    $('.list_section ul').append('<li id="blt' + video.embed_code + '">' + '<a><img src="' + video.preview_image_url + '" alt="image-6"></a>' + ' <span class="title">' + video.name + '</span>' + '<p>' + video.description + '</p></li>');
  });
  var initialValue = extensionField && extensionField.field && extensionField.field.getData() ? extensionField.field.getData() : null;

  if (initialValue) {
    var currentElement = document.getElementById(initialValue);
    var box = $(currentElement)[0].outerHTML;
    $('.discription_box ul').html(box);
    $('.discription_box ul li a').click(function (e) {
      e.preventDefault();
    });
  }

  extensionField.window.enableAutoResizing();
  $('.choose_video').click(function (e) {
    $('.list_section').show();
  });
  extensionField.setReady();
  domEvents();
} //eventlistner function


function domEvents() {
  extensionField.window.enableAutoResizing();
  $(".searchInpput").on("keypress", function (event) {
    // prevent form submit
    var value = $(this).val().toLowerCase();

    if (event.keyCode == 13) {
      console.log("enter");
      event.preventDefault();

      if (!value) {
        return render(initialList);
      }

      request.search(value).then(function (response) {
        if (response.length === 0) {
          loader.hide();
          unorderedList.empty();
          msg.show();
          return;
        }

        render(response);
      });
    }
  });
  $(".searchInpput").on("keyup", function (event) {
    // reset if search input is empty
    var value = $(this).val().toLowerCase();

    if (!value) {
      msg.hide();
      return render(initialList);
    }

    $(".list_section ul li").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  $('.list_section ul li a').click(function (e) {
    e.preventDefault();
    $('.list_section ul li').removeClass('selected');
    $(this).parent().addClass('selected');
  });
  $('.list_section ul li').click(function () {
    var box = $(this)[0].outerHTML;
    extensionField.field.setData($(this).attr('id')).then(function () {
      $('.discription_box ul').html(box);
      $('.list_section').hide();
    })["catch"](function (error) {
      console.log('error in setting data', error);
    });
  });
} // function for sending XHR request and getting data


function getData(data) {
  console.log(data, "data parameter");
  return new Promise(function (resolve, reject) {
    extensionField.window.enableAutoResizing();
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
    key: "search",
    value: //function for searching videos 
    function search(keyword) {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "api_key": extensionField.config.api_key,
        "secret": extensionField.config.secret
      };
      var data = "client_id=" + extensionField.config.api_key + "&secret=" + extensionField.config.secret + "&grant_type=client_credentials";
      var url = extensionField.config.searchUrl + keyword;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'GET'
        }).then(function (data) {
          resolve(data);
        })["catch"](function (err) {
          reject(err);
        });
      });
    } //function for retrieving videos from ooyala

  }, {
    key: "ooyalaVideos",
    value: function ooyalaVideos() {
      var headers = {
        "Content-Type": "application/json",
        "api_key": extensionField.config.api_key,
        "secret": extensionField.config.secret
      };
      var url = extensionField.config.url;
      return new Promise(function (resolve, reject) {
        getData({
          url: url,
          headers: headers,
          method: 'GET'
        }).then(function (data) {
          console.log("data ooyala", data.items);
          resolve(data.items);
        }, function (error) {
          console.error("Failed!", error);
        });
      });
    }
  }]);

  return Request;
}();