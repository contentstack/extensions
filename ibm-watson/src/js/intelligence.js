const toPercentage = (entity) => `${(entity * 100).toFixed(1)}%`;

const combine = (data) => {
  let arglist = data;
  let string = '';
  for (let i = 0; i < arglist.length - 1; i += 1) {
    string = string + arglist[i].text + ', ';
  }
  return (string + arglist[arglist.length - 1].text);
};

let features = {
  categories: {
    name: 'Categories',
    description: 'Categorize your content into a 5-level taxonomy. The top three categories will be returned.',
    options: {},
    responseKeys: ['score', 'label'],
    transform: (data)=> data.map(({ score, label }) => (
      { score: toPercentage(score), label }))
  },
  concepts: {
    name: 'Concepts',
    description: 'Recognize high-level concepts that are related to your text. For example, analysis of a research paper about deep learning would likely return the concept "Artificial Intelligence", even if that term is not explicitly mentioned in the paper.',
    options: {},
    responseKeys: ['text', 'relevance', 'dbpedia_resource'],
    transform: (data)=> data.map(({ text, relevance, dbpediaResource })=> (
      { text: text, relevance: toPercentage(relevance), dbpedia: dbpediaResource }))
  },
  emotion: {
    name: 'Emotion',
    description: 'Detect emotion conveyed by the entire body of text.',
    options: {},
    responseKeys: ['sadness', 'joy', 'fear', 'disgust', 'anger'],
    transform: ({ document })=> Object.keys(document.emotion).map((emotion)=>(
      { emotion, score: toPercentage(document.emotion[emotion]) }))
  },
  entities: {
    name: 'Entities',
    description: 'Identify people, cities, organizations, and many other types of entities in your text.',
    options: {},
    responseKeys: ['type', 'text', 'relevance', 'count'],
    transform: (data)=> data.map(({
      type, text, relevance, count
    }) => ({
      type, text, relevance: toPercentage(relevance), count
    }))
  },
  keywords: {
    name: 'Keywords',
    description: 'Identify the important keywords in your content.',
    options: {},
    responseKeys: ['text', 'relevance'],
    transform: (data)=> data.map(({ text, relevance }) => (
      { text, relevance: toPercentage(relevance) }))
  },
  relations: {
    name: 'Relations',
    description: 'Recognize when two entities are related, and identify the type of relation. For example, an "awardedTo" relation might connect the entities "Nobel Prize" and "Albert Einstein".',
    options: {},
    responseKeys: ['type', 'sentence', 'score'],
    transform: (data) => data.map(({ arguments: args, score, type }) =>(
      { type, args: combine(args), score: toPercentage(score) }))
  },
  semantic_roles: {
    name: 'Semantic Roles',
    description: 'Parse sentences into subject, action, and object form.',
    options: {},
    responseKeys: ['subject', 'object', 'action'],
    transform: (data)=> data.map(({ action, object, subject }) =>(
      { action: action.text, object: object.text, subject: subject.text }))
  },
  sentiment: {
    name: 'Sentiment',
    description: 'Analyze the general sentiment of your content or analyze the sentiment toward specific target phrases found in the text.',
    options: {},
    responseKeys: ['text', 'score', 'label'],
    transform: ({ document })=> ([{ score: toPercentage(document.score), label: document.label }])
  }
};

let fieldPaths = [];

function getPaths(contenttype, entry) {
  let paths = [];
  let setUid;
  function iterrate(schema, currentEntry, uid, setuid, titlePaths = []) {
    setUid = setuid;
    let uidsPaths = uid ? uid.split('.') : [];
    schema.forEach((field) => {
      let newUidPaths = [...uidsPaths, field.uid];
      let newUid = newUidPaths.join('.');
      if (!currentEntry || currentEntry[field.uid] === undefined) return;
      if (field.data_type === 'text') {
        if (field.multiple === false) {
          let newSetuid = setUid || newUid;
          paths.push({
            uid: newUid,
            path: newUidPaths,
            value: currentEntry[field.uid],
            setUid: newSetuid,
            titlePaths: [...titlePaths, field.display_name]
          });
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach((value, contentIndex) => {
            let numericalPath = [...newUidPaths, contentIndex];
            let newSetuid = setUid || newUid;
            paths.push({
              uid: numericalPath.join('.'), path: numericalPath, value, setUid: newSetuid, titlePaths: [...titlePaths, field.display_name, contentIndex]
            });
          });
        }
      }
      if (field.data_type === 'group') {
        if (field.multiple === false) {
          iterrate(field.schema, currentEntry[field.uid], newUid, setUid,
            [...titlePaths, field.display_name]);
        } else if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach((value, index) => {
            let numericalPath = [...newUidPaths, index];
            iterrate(field.schema, value, numericalPath.join('.'), setUid, [...titlePaths, field.display_name, index]);
          });
        }
      }
      if (field.data_type === 'blocks') {
        if (currentEntry[field.uid].length > 0) {
          currentEntry[field.uid].forEach((value, index) => {
            let numericalPath = [...newUidPaths, index];
            let blockUid = Object.keys(value)[0];
            let newSchema = field.blocks.find(x => x.uid === blockUid).schema;
            let newValue = value[blockUid];
            setUid = newUid;
            iterrate(newSchema, newValue, numericalPath.join('.'), setUid, [...titlePaths, field.display_name, index]);
          });
        }
      }
    });
  }
  iterrate(contenttype.schema, entry);
  return paths;
}

function runAnalysis(requestFeatures, text, {url, "x-api-key": xApiKey}) {
  let statusCode;
  return new Promise((resolve, reject) => {
    let headers = {
        'Content-Type': 'application/json'
    }
    if (xApiKey) {
      headers['x-api-key'] = xApiKey;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ text, features: requestFeatures }),
      headers
    }).then((response) => {
      statusCode = response.status;
      return response.json();
    }).then((json) => {
      if (statusCode === 200) {
        return resolve(json);
      }
      throw Error('Failed to run analysis:' + json.error);
    }).catch((err) => {
      reject(err);
    });
  });
}

function activaTab(tabId) {
  $('.tab-pane').hide();
  $(`#${tabId}`).show('');
}

function renderFieldSelectField(extendedField) {
  let previouslySelected = $('#field').val();
  $('#field').empty();
  fieldPaths = getPaths(extendedField.entry.content_type, extendedField.entry.getData());
  fieldPaths.forEach((field) => {
    let option = $('<option></option>').attr('value', field.uid).text(field.titlePaths.join(' > '));
    if (previouslySelected === field.uid) option.attr('selected', 'selected');
    $('#field').append(option);
  });
}

function renderResult(result, featureArray) {
  $('#result-container').append('<label class="control-label col-sm-offset-2 col-sm-2" for="results" style="margin-left:-14px !important;">Results :</label><select id="results" style="margin-bottom:14px" class="form-control"></select><div id="nav-tabContent"></div>');
  featureArray.forEach((fkey, i) => {
    $('#results').append($(`<option value="nav-${fkey}"></option>`).text(features[fkey].name));
    let resultSubset = features[fkey].transform(result[fkey]);
    if(resultSubset.length === 0)
      resultSubset = [{"Message" : `No results for ${fkey} model`}]
    $('#nav-tabContent').append($(` <div class="tab-pane" id="nav-${fkey}" style="display:${i === 0 ? 'block' : 'none'};" role="tabpanel" aria-labelledby="nav-${fkey}-tab">${ConvertJsonToTable(resultSubset, 'jsonTable', 'table table-bordered table-hover', 'dbpedialink')}</div>`)); // eslint-disable-line
  });
  $('#results').on('change', () => {
    activaTab($('#results').val());
  });
}

function domChangeListner(extendedField) {
  const updateSelectField = () => renderFieldSelectField(extendedField);
  extendedField.entry.onSave(updateSelectField);

  $('#run-btn').on('click', (e) => {
    e.preventDefault();
    $('#result-container').html('');
    let requestFeatures = {};
    $('#features input[type=checkbox]').each((index) => {
      let cb = $('#features input[type=checkbox]')[index];
      if (cb.checked) {
        requestFeatures[cb.name] = features[cb.name].options;
      }
    });
    let featureArray = Object.keys(requestFeatures);
    if (featureArray.length === 0) {
      return $('#result-container').append('<div class="alert alert-danger" role="alert">Please select at least one analysis model</div>');
    }


    $('#run-btn').prop('disabled', true);
    $('#run-btn').html('Working on it...');

    runAnalysis(requestFeatures, fieldPaths.find(x => x.uid === $('#field').val()).value, extendedField.config).then((data) => {
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      renderResult(data, featureArray);
    }).catch((error) => {
      $('#run-btn').prop('disabled', false);
      $('#run-btn').html('');
      $('#run-btn').append('<img src="https://images.contentstack.io/v3/assets/bltc249966903dc3407/blt40a60d26b3d8095f/5b7660b25b9f14da0eb07a34/operation.svg" alt="run-icon"/> Run');
      $('#result-container').append('<div class="alert alert-danger" role="alert">' + error.message + '</div>');
    });
    return true;
  });
}

function renderModelSelectField() {
  $.each(features, (key) => {
    $('#features').append($('<label></label>').attr('class', 'col-6').append($('<input></input>').attr('name', key).attr('type', 'checkbox').attr('class', 'cs')).append($('<span></span>').attr('class', 'lbl').text(features[key].name)));
  });
}

$(document).ready(() => {
  ContentstackUIExtension.init().then((extendedField) => {
    extendedField.window.enableAutoResizing();
    renderModelSelectField();
    renderFieldSelectField(extendedField);
    domChangeListner(extendedField);
  });
});
