"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var extensionField;
var shopifyClient;
var unorderedList;
$(document).ready(function () {
  unorderedList = $('.list_section ul'); // Step:1 Intializing extension - In this step we try to connect to host window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(function (extension) {
    // current extension object
    extensionField = extension;
    var request = new Request(extension.config);
    var initialList; // store initial data to save extra rest call when search field is empty

    request.get().then(function (response) {
      initialList = response; // Step 2:  Render - Render the data fetched from external service

      render(response);
    });
    $(".searchInpput").on("keypress", function (event) {
      // prevent form submit
      var value = $(this).val().toLowerCase();

      if (event.keyCode === 13) {
        event.preventDefault();
        if (!value) return render(initialList);
        request.search(value).then(function (response) {
          if (response.length === 0) {
            unorderedList.empty();
            return unorderedList.append('<li><span class="title">No Products Found</span></li>');
          }

          render(response);
        });
      }
    });
    $(".searchInpput").on("keyup", function (event) {
      // reset if search input is empty
      var value = $(this).val().toLowerCase();
      if (!value) return render(initialList);
    });
    extensionField.window.enableAutoResizing();
  });
});

var Request = /*#__PURE__*/function () {
  function Request(_ref) {
    var domain = _ref.domain,
        storefrontAccessToken = _ref.storefrontAccessToken;

    _classCallCheck(this, Request);

    this.shopifyClient = ShopifyBuy.buildClient({
      domain: domain,
      storefrontAccessToken: storefrontAccessToken
    });
  }

  _createClass(Request, [{
    key: "get",
    value: function get() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

      var _request = this;

      return new Promise(function (resolve, reject) {
        _request.shopifyClient.product.fetchAll(limit).then(function (response) {
          resolve(response);
        })["catch"](function (e) {
          reject(err);
        });
      });
    }
  }, {
    key: "search",
    value: function search(keyword) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

      var _request = this;

      return new Promise(function (resolve, reject) {
        _request.shopifyClient.product.fetchQuery({
          first: limit,
          query: "".concat(keyword)
        }).then(function (response) {
          resolve(response);
        })["catch"](function (e) {
          reject(err);
        });
      });
    }
  }]);

  return Request;
}();

function render(response) {
  // empty unorder list and add render new list items
  unorderedList.empty();
  response.forEach(function (product, index) {
    product.images[0] = product.images[0] ? product.images[0] : {};
    product.variants[0] = product.variants[0] ? product.variants[0] : {
      price: "not entered"
    };
    unorderedList.append('<li style="height:330px;" id="blt' + product.id + '">' + '<a><img src="' + product.images[0].src + '" alt="image-6"></a>' + ' <span class="title">' + product.title + '</span>' + ' <span class="title">Price: ' + product.variants[0].price + ' $</span>' + '<p>' + product.description + '</p></li>');
  });
  var initialValue = extensionField && extensionField.field && extensionField.field.getData() ? extensionField.field.getData() : null;

  if (initialValue) {
    var currentElement = document.getElementById(initialValue);

    if (currentElement && $(currentElement)[0]) {
      var box = $(currentElement)[0].outerHTML;
      $('.discription_box ul').html(box);
    }
  }

  $('.choose_video').click(function (e) {
    $('.list_section').show();
  }); // Step 3:  Dom Change Listener - Start dom change listener to set data for the field on user input

  domChangeListner();
}

function domChangeListner() {
  var anchor = $('.list_section ul li');
  $('.list_section ul li a').click(function (e) {
    anchor.removeClass('selected');
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