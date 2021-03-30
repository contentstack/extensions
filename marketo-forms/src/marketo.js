let extensionField;
let selectField;
let marketo = {};

function domChangeListner(forms) {
  selectField.on("change", () => {
    let id = $("#form-select-field").val();
    let FormData = forms.find((form) => form.id.toString() === id);
    extensionField.field.setData(FormData);
  });
}

// render function for creating DOM structure
function render(forms) {
  let initialValue =
    extensionField && extensionField.field && extensionField.field.getData()
      ? extensionField.field.getData()
      : {};
  let defaultOption = $("select option:contains('-- Select a form --')");
  let formId = initialValue.id;
  forms.forEach((form) => {
    let option = $("<option></option>").attr("value", form.id).text(form.name);
    if (form.id === formId) {
      option.attr("selected", "selected");
    }
    selectField.append(option);
  });
  defaultOption.attr("disabled", "disabled");
  if (!formId) defaultOption.attr("selected", "selected");
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
          let forms = [{ id: 400, name: "None" }];
          forms = forms.concat(response);
          return resolve(forms);
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
      render(response);
    });
    extensionField.window.enableAutoResizing();
  });
});
