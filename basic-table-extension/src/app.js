$(document).ready(function () {
  let extensionField;
  let isAutoResizeEnabled = true;
  let columnsLimit = 10;
  let rowsLimit = 50;

  $('#dynamicTable').keyup(() => {
    saveTableData();
  });

  $('body').on('click', '.addRowButton', function (event) {
    event.preventDefault();
    addRow(this);
    let tdElement = $(this).closest('tr').next('tr').find('td:first-child');

    if (tdElement) setFocus(tdElement);

    domListener();
    hideShowDeleteButton();
  });

  $('body').on('click', '.deleteRowButton', function (event) {
    event.preventDefault();
    removeRows(this);
    saveTableData();
    domListener();
    hideShowDeleteButton();
  });

  ContentstackUIExtension
    .init()
    .then(function (extension) {
    // Make extension object globally available
      extensionField = extension;

      // Enable auto resizing of field height
      extensionField.window.enableAutoResizing();
      const data = {};
      let config = extensionField.config;
      if (Object.keys(extensionField.field.schema.config).length) {
        config = extensionField.field.schema.config;
      }
      data.rows = extensionField.field.getData().rows || [];
      data.columns = config.columns;

      if (config.rowsLimit) rowsLimit = config.rowsLimit;

      if (config.columnsLimit) columnsLimit = config.columnsLimit;

      if (!data.columns) return $('#dynamicTable').html("Please define your columns in extension's config");

      initializeTable(data);
    });

  function initializeTable(data) {
    if (data === undefined) return;

    if (!data.columns || !data.columns.length) return;

    const columns = data.columns;
    let rows = data.rows;

    // Clear table data if any
    $('#dynamicTable').html('');

    let tableContent = '<tr>';

    // Create column fields
    for (let i = 0; i < columns.length && i < columnsLimit; i++) tableContent += "<td class='td_id_" + (i + 1) + "'><strong>" + columns[i] + '</strong></td>';

    // End of column fields
    tableContent += '<td></td></tr>';

    // To hide delete button
    let hideClass = '';

    if (!rows || !rows.length) {
      hideClass = 'hide';
      rows = [columns.map(column => '')];
    }

    for (let i = 0; i < rows.length && i < rowsLimit; i++) {
      // Start row
      tableContent += "<tr class='dataRow'>";

      // Create row fields
      for (let j = 0; j < columns.length && j < columnsLimit; j++) tableContent += "<td class='td_id_" + (j + 1) + "' contenteditable='true'>" + (rows[i][j] || '') + '</td>';

      // End of row
      tableContent += "<td><i id=row_delete_id_'" + (i + 1) + "' class='icon-trash deleteRowButton " + hideClass + "'></i>&nbsp;&nbsp;&nbsp;&nbsp;<i id=row_add_id_'" + (i + 1) + "' class='icon-plus addRowButton'></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-move'></i></td></tr>";
    }

    $('#dynamicTable').html(tableContent);

    if (hideClass === 'hide') setFocus($('tr:nth-child(2) td:first-child'));
  }

  function saveTableData() {
    const tableData = {};
    const rowsData = [];
    const columnData = [];
    const columns = $('#dynamicTable tr:nth-child(1) td');

    if (columns.length === 0) return;

    columns.each(function (index) {
      if (index !== columns.length - 1) columnData.push($(this).text());
    });

    const rows = $('#dynamicTable tr');
    let tdElements;
    let trRecords = [];

    rows.each(function (index) {
      if (index > 0) {
        trRecords = [];
        tdElements = $(this).children('td');

        tdElements.each(function (index) {
          if (index !== tdElements.length - 1) trRecords.push($(this).text());
        });

        if (trRecords.length) rowsData.push(trRecords);
      }
    });

    tableData.columns = columnData;
    tableData.rows = rowsData;

    extensionField.field.setData(tableData);
  }

  function addRow(domElement) {
    const trElement = $(domElement).closest('tr');
    const totalColumns = $('#dynamicTable tr:first td').length;
    let tds = "<td class='td_id_1' contenteditable='true'></td>";
    const totalRows = $('#dynamicTable tr').length - 1;

    if (totalRows >= rowsLimit) return;

    if (totalColumns === 0) return;

    if (totalColumns > 2) {
      for (let i = 2; i < totalColumns; i++) tds += "<td class='td_id_" + i + "' contenteditable='true'></td>";
    }

    let tr = "<tr class='dataRow'><i class='icon-move'></i>" + tds + "<td ><i id=row_delete_id_'" + (totalColumns + 1) + "' class='icon-trash deleteRowButton'></i>&nbsp;&nbsp;&nbsp;&nbsp;<i id=row_add_id_'" + (totalColumns + 1) + "' class='icon-plus addRowButton'></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-move'></i></td></tr>";

    if (trElement) return $(tr).insertAfter(trElement);

    $('#dynamicTable:last-child').append(tr);
  }

  function removeRows(domElement) {
    const totalRows = $('#dynamicTable tr').length;

    $(domElement).closest('tr').remove();

    // Don't let delete all rows
    if (totalRows === 2) {
      return initializeTable({
        columns: extensionField.config.columns,
        rows: []
      });
    }
  }

  function hideShowDeleteButton() {
    const rowTdElement = $('#dynamicTable tr:nth-child(2) td:last-child .deleteRowButton');
    const rowsCount = $('#dynamicTable tr').length;

    if (rowsCount > 2 && rowTdElement.hasClass('hide')) return rowTdElement.removeClass('hide');

    if (rowsCount <= 2 && !rowTdElement.hasClass('hide')) rowTdElement.addClass('hide');
  }

  function domListener() {
    const iFrameHeight = $('body').height();

    if (iFrameHeight > 400 && isAutoResizeEnabled) {
      isAutoResizeEnabled = 0;
      return extensionField.window.disableAutoResizing();
    }

    if (!isAutoResizeEnabled) {
      extensionField.window.enableAutoResizing();
      isAutoResizeEnabled = 1;
    }
  }

  function setFocus(domElement) {
    domElement.attr('tabindex', 0);
    domElement.focus();
  }

  $('table tbody').sortable({
    items: '> tr:not(:first)',
    helper: fixWidthHelper,
    cancel: '[contenteditable]',
    containment: 'document',
    axis: 'y',
    stop: function (event, ui) {
      saveTableData();
    }
  });

  function fixWidthHelper(e, ui) {
    ui.children().each(function () {
      $(this).width($(this).width());
    });
    return ui;
  }
});
