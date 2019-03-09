/**
 *  Here's where we do stuff. Well, first some housekeeping to make sure we're signed in and can manipulate the sheets.
 */

// Anything special when the user signs in. For now let's just initialize everything by default.
// Called by sheets_auth.js once the user is signed in, and each time the user authorizes thereafter
function sign_in() {
  start();
}

// Anything special when the user signs out. Clean-up for reinitialization etc.
// Called by sheets_auth.js whenever the user signs out
function sign_out() {}

/**
 *  Here's where we ACTUALLY do stuff.
 */
function start() {
  console.log('Starting!');
  appendPre('Started successfully! Stand by…\n');
  var params, request, valueRangeBody;
  
  // TEST Cell Data GET
  // See https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
  params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '1k1mtGDWUmDmOh8qCV8CK5gcY6cIoKmG7KmS6hS-b49k',

    // The A1 notation of the values to get.
    range: 'API Test!B2:D',
    
    // Whether to get as ROWS or COLUMNS
    majorDimension: 'COLUMNS',
    
    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: 'FORMATTED_VALUE',

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      appendPre('GET TEST\nCol.B2+, Col.D2+:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns B and D, which correspond to indices 0 and 2.
        appendPre(row[0] + ', ' + row[2]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
  
  // Test Cell Data UPDATE
  // See https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update
  params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '1k1mtGDWUmDmOh8qCV8CK5gcY6cIoKmG7KmS6hS-b49k',

    // The A1 notation of the values to update.
    range: 'API Test!F1',
    
    // Whether to get as ROWS or COLUMNS
    majorDimension: 'COLUMNS',

    // How the input data should be interpreted.
    valueInputOption: 'USER_ENTERED',
    
    includeValuesInResponse: true,
    
    responseValueRenderOption: 'FORMATTED_VALUE',
    
    responseDateTimeRenderOption: 'FORMATTED_STRING',
  };

  var date = new Date();
  valueRangeBody = {
    "values": [[date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()]],
  };

  request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
  request.then(function(response) {
    appendPre('\nUPDATE TEST');
    appendPre('Last Accessed:');
    appendPre(response.result.updatedData.values);
  }, function(reason) {
    appendPre('Error: ' + reason.result.error.message);
  });
  
  /******** DOM INTERACTION STUFF ********/
  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
}
