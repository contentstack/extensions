let extensionField;
let loader;
let unorderedList;
let msg
let request = {};
let initialList;
let totalVideos;
let loadMoreBtn;
let offset = 0;
const limit = 20;

$(document).ready(function () {
    msg = $('.msg')
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
                render(response)
            });
        })

        $(".searchInpput").on("keypress", function (event) { // prevent form submit
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
                        return
                    }
                    unorderedList.empty();
                    render(response, true);
                });
            }
        });

        $(".searchInpput").on("keyup", function (event) { // reset if search input is empty
            let value = $(this).val().toLowerCase();
            offset = 0;

            if (!value) {
                unorderedList.empty();
                msg.hide()
                return render(initialList, true);
            }
        });
        extensionField.window.enableAutoResizing();
    })
});

// render function for creating DOM structure
function render(videos, initialRender) {
    msg.hide();
    videos.forEach(function (video, index) {
        if (video.state === 'ACTIVE') {
            unorderedList.append(`<li id='${video.id}'>
                <section class="img-wrapper"><img src='${video.images.thumbnail.src}' alt="image-6"></section>
                 <span class="title"> ${video.name}</span> 
                <p>${video.description}</p></li>`);
        }
    });

    var initialValue = (extensionField && extensionField.field && extensionField.field.getData()) ? extensionField.field.getData() : null;

    if (initialValue) {
        if (initialValue.includes('blt'))
            initialValue = initialValue.replace('blt', '');

        $('.discription_box ul').empty();
        request.getInitialVideo(initialValue).then((video) => {
            $('.discription_box ul').append(`<li id='${video.id}'>
                <section class="img-wrapper"><img src='${video.images.thumbnail.src}' alt="image-6"></section>
                <span class="title">${video.name}</span>
                <p>${video.description}</p></li>`);
        });

        $('.discription_box ul li a').click(function (e) {
            e.preventDefault();
        });
        setTimeout(function () {
            if (!initialRender) {
                extensionField.window.enableAutoResizing();
            }
        }, 1000);
    }

    if ($(".list_section ul li").length === parseInt(totalVideos.text()) || $(".list_section ul li").length >= parseInt(totalVideos.text())) {
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
        extensionField.field.setData($(this).attr('id')).then(function () {
            $('.discription_box ul').html(box);
            $('.list_section').hide();
        }).catch(function (error) {
            console.log('error in setting data', error)
        })
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

// function for sending XHR request and getting data
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
            }
            else {
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
}

// class request 
class Request {

    //function for retrieving videos from brightcoove
    getVideoCount() {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        var data = `client_id=${extensionField.config.client_id}&client_secret=${extensionField.config.client_secret}&grant_type=client_credentials`;
        var url = extensionField.config.oauthUrl

        return new Promise((resolve, reject) => {
            getData({ url: url, headers: headers, method: 'POST', data: data })
                .then(function (data) {
                    return data;
                })
                .then(function (data) {
                    var headers = {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                    var url = extensionField.config.videocountUrl;
                    getData({ url: url, headers: headers, method: 'GET' }).then(function (data) {
                        resolve(data);
                    })
                        .catch(function (err) {
                            throw err
                        })
                })
        })
    }

    //function for retieving saved videos from ID
    getInitialVideo(id) {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        var data = `client_id=${extensionField.config.client_id}&client_secret=${extensionField.config.client_secret}&grant_type=client_credentials`;
        var url = extensionField.config.oauthUrl
        return new Promise((resolve, reject) => {
            getData({ url: url, headers: headers, method: 'POST', data: data })
                .then(function (data) {
                    return data;
                })
                .then(function (data) {
                    var headers = {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                    var url = `${extensionField.config.brightcoveUrl}/${id}`;
                    getData({ url: url, headers: headers, method: 'GET' })
                        .then(function (data) {
                            resolve(data);

                        }).catch(function (error) {
                            loader.hide();
                            msg.show();
                        })
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    //function for searching videos
    search(keyword) {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        var data = `client_id=${extensionField.config.client_id}&client_secret=${extensionField.config.client_secret}&grant_type=client_credentials`;
        var url = extensionField.config.oauthUrl
        return new Promise((resolve, reject) => {
            getData({ url: url, headers: headers, method: 'POST', data: data })
                .then(function (data) {
                    return data;
                })
                .then(function (data) {
                    var headers = {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                    var url = `${extensionField.config.searchUrl}${keyword}`
                    getData({ url: url, headers: headers, method: 'GET' })
                        .then(function (data) {
                            resolve(data);
                        }).catch(function (error) {
                            console.log(error);
                            loader.hide();
                            msg.show();
                        })
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    //function for retrieving videos from brightcoove
    getBrightcoveVideos() {
        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        var data = `client_id=${extensionField.config.client_id}&client_secret=${extensionField.config.client_secret}&grant_type=client_credentials`;
        var url = extensionField.config.oauthUrl
        return new Promise((resolve, reject) => {
            getData({ url: url, headers: headers, method: 'POST', data: data })
                .then(function (data) {
                    return data;
                })
                .then(function (data) {
                    var headers = {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                    var url = `${extensionField.config.brightcoveUrl}?limit=${limit}&offset=${offset}`;
                    getData({ url: url, headers: headers, method: 'GET' }).then(function (data) {
                        resolve(data);
                    })
                        .catch(function (err) {
                            throw err
                        })
                })
        })
    }
}