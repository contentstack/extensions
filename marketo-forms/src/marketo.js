/* eslint-disable no-undef */
let extensionField;
let selectField;
let formList;
let marketo = {};

function domChangeListner(forms) {
  selectField.on("change", () => {
    $("#clear-form").css({ display: "block" });
    let id = $("#form-select-field").val();
    let FormData = forms.find((form) => form.id.toString() === id);
    FormData = FormData || {};
    extensionField.field.setData(FormData);
  });
}

$(".form-clear-icon").on("click", function () {
  $("#clear-form").css({ display: "none" });
  $("#form-select-field").empty();
  $("#form-select-field").append(
    $("<option value>-- Select a form --</option>")
  );
  render(formList, true);
});

// render function for creating DOM structure
function render(forms, clearField) {
  formList = forms;
  const initialValue =
    extensionField && extensionField.field && extensionField.field.getData()
      ? extensionField.field.getData()
      : {};
  const formID = initialValue.id;
  let defaultOption = $('select option:contains("-- Select a form --")');
  forms.forEach((form) => {
    let option = $(`<option></option>`).attr("value", form.id).text(form.name);
    if (form.id === formID) {
      option.attr("selected", "selected");
      $("#clear-form").css({ display: "block" });
    }
    selectField.append(option);
  });
  defaultOption.attr("disabled", "disabled");
  if (!formID || clearField) {
    defaultOption.attr("selected", "selected");
    $("#clear-form").css({ display: "none" });
    extensionField.field.setData({});
  }
  selectField.show();
  domChangeListner(forms);
}

class Marketo {
  constructor({ url, folder }) {
    this.url = url;
    this.folder = folder;
  }

  getForms() {
    let setting = this;
    return new Promise((resolve, reject) => {
      let getUrl = `${setting.url}`;
      if (setting.folder) getUrl = `${getUrl}?folder=${setting.folder}`;
      return fetch(getUrl, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

$(document).ready(() => {
  selectField = $("#form-select-field");
  // Step:1 Intializing extension - In this step we try to connect
  // to host window using postMessage API and get intial data.
  ContentstackUIExtension.init().then((extension) => {
    extensionField = extension;
    marketo = new Marketo(extension.config);
    marketo.getForms().then((response) => {
      render(response, false);
    });
    extensionField.window.enableAutoResizing();
  });
});
