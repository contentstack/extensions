let extensionField;

class Request {
  constructor({ configArg1, configArg2 }) {
    this.configArg1 = configArg1;
    this.configArg2 = configArg2;
  }

  get() {
    let request = this;
    let statusCode;
    return new Promise((resolve, reject) => {
      fetch(`https://reqres.in/api/users?$configArg1={request.configArg1}&configArg2=${request.configArg2}`, {
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
      fetch(`https://reqres.in/api/users?$keyword=${keyword}&configArg2=${request.configArg2}`, {
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
  response.data.forEach((dataSet) =>{
    let option = $('<option></option>').attr('value', dataSet.id).text(`${dataSet.first_name} ${dataSet.last_name}`);
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
