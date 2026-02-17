let extensionField;

class Request {
  constructor(config = {}) {
    this.url = config.url || 'https://reqres.in/api/users';
    this.configArg1 = config.configArg1 || '';
    this.configArg2 = config.configArg2 || '';
  }

  get() {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(request.url, {
        method: 'GET'
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

  search(keyword) { // sample search function for advance implementation
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`${request.url}?keyword=${keyword}`, {
        method: 'GET'
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

function domChangeListner() {
  $('#resource-select').on('change', () => {
    let fieldValue = $('#resource-select').val();
    return extensionField.field.setData(fieldValue);
  });
}

function render(response) {
  //  to get previously selected
  let fieldData = extensionField.field.getData();
  
  // Handle different response formats
  // reqres.in returns { data: [...] }, jsonplaceholder returns [...] directly
  let users = Array.isArray(response) ? response : (response.data || []);
  
  users.forEach((dataSet) =>{
    // Handle different field names: first_name/last_name (reqres) vs name (jsonplaceholder)
    let displayName = dataSet.name || `${dataSet.first_name || ''} ${dataSet.last_name || ''}`.trim();
    let option = $('<option></option>').attr('value', dataSet.id).text(displayName);
    if (fieldData === dataSet.id.toString()) {
      option.attr('selected', 'selected');
    }
    $('#resource-select').append(option);
  });
  // Step 3:  domChangeListner - Start listner on select field to set data for field
  // on selection change
  domChangeListner();
}


$(document).ready(() => {
  // Step:1 Intializing extension - In this step we try to connect to host
  //  window using postMessage API and get intial data.

  ContentstackUIExtension.init().then(extension => { // current extension object
    extensionField = extension;

    let request = new Request(extension.config); // initialize request object using config
    request.get().then((response) => {
      // Step 2:  Render - Render the data fetched from external service
      render(response);
    });

    extensionField.window.enableAutoResizing();
  });
});
