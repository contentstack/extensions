let extensionField;
let auidences = [];

function calculateHeight() {
  let body = document.body;
  let html = document.documentElement;

  let height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
  extensionField.window.updateHeight(height);
}

class Optimizely {
  constructor({ access_token: AccessToken, project_id: ProjectId }) {
    this.AccessToken = AccessToken;
    this.ProjectId = ProjectId;
  }

  getAudience() {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`https://api.optimizely.com/v2/audiences?project_id=${request.ProjectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${request.AccessToken}`
        }
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

function domChangeListner(data) {
  let fieldValue;

  $('#select-tools').on('change', () => {
    fieldValue = $('#select-tools').val();
    let fieldValues = [];
    if (fieldValue !== null) {
      fieldValue.forEach((value) => {
        data.forEach((element) =>{
          if (value === element.name) {
            fieldValues.push(element);
          }
        });
      });
    }

    return extensionField.field.setData(fieldValues);
  });

  $('.selectize-control').on('click', () => {
    calculateHeight();
  });
}

function calculateDomHeight() {
  let elHeight = $('.selectize-control').outerHeight() + $('.selectize-dropdown ').height();
  extensionField.window.updateHeight(elHeight);
}

function render(data) {
  //  to get previously selected
  let fieldData = extensionField.field.getData();
  let selectedValues = [];

  if (Object.keys(fieldData).length !== 0) {
    fieldData.forEach((element) => {
      selectedValues.push(element.name);
    });
  }

  $('#select-tools').selectize({
    plugins: ['remove_button'],
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    options: data,
    create: false,
    items: selectedValues,
    hideSelected: true,
    onFocus: () => {
      calculateHeight();
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
    },
    onBlur: () => {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }
      let elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onInitialize: () => {
      if (selectedValues.length === 0) {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      } else if (selectedValues.length === auidences.length) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Click to select options');
      }
      let elHeight = $('.selectize-control').outerHeight();
      extensionField.window.updateHeight(elHeight);
    },
    onDropdownOpen: () => {
      calculateDomHeight();
    },
    onItemAdd: () => {
      if ($('.option').length === 0) {
        $('#select-tools-selectized').attr('placeholder', ' ');
      } else {
        $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      }
    },
    onItemRemove: () => {
      $('#select-tools-selectized').attr('placeholder', 'Start typing to search');
      calculateDomHeight();
    }

  });

  // Step 3:  domChangeListner - Start listner on select field to set data for field
  // on selection change
  domChangeListner(data);
}


$(document).ready(() => {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(extension => { // current extension object
    extensionField = extension;

    let optimizely = new Optimizely(extension.config); // initialize request object using config
    optimizely.getAudience().then((response) => {
      
      // Step 2:  Render - Render the data fetched from external service
      render(response);
    });
  });
});
