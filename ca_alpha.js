/**
 * Generic item for content generation.
 * Has a name and a catalog of categories it belongs to or is excluded from.
 */
function ContentItem(__name){
  let __that = this;
  let __categories = {};
  
  Object.defineProperties(__that,{
    name: {value: __name},
    toString: {get: (()=>{return (()=>{return __name;})})},
    isA: {value: function(cat){return __categories[cat.toLowerCase()];}},
    categories: {
      /**
       * Get all information about this item's categories, in the form {category1:membership1, ...}
      **/
      get: function() {
        return Object.assign({},__categories);
      },
      /**
       * Add information about the item's categories.
       *
       * @param {Object} keys are category names and values are whether or not the item is a member
       *     OR {Array} of category names, all of whose memberships are set to true
      **/
      set: function(a) {
        console.log('Existing category info will not be deleted. Use clearCategories() to remove existing categories.');
        if(Array.isArray(a)) a.forEach(function(e) {__categories[String(e).toLowerCase()]=true;});
        else Object.keys(a).forEach(function(e){__categories[String(e).toLowerCase()]=a[e];});
        console.log(Object.assign({},__categories));
      }
    },
    /**
     * Delete all or some categories from the item
     * NOTE: This will also remove category:false, which might be used to assert an item does not belong to a category.
     *       Use `categories = {category:false}` to retain that information
     *
     * @param {array} (optional) list of categories whose information to discard; otherwise clears all
    **/
    clearCategories: {
      value: function(cats) {
        if(Array.isArray(cats))
          cats.forEach(function(e){delete __categories[String(e).toLowerCase()];});
        else __categories = {};
      }
    }
  });
}

function ReadObjectListFromFile(StructureName, Range)
{
  var params, request, valueRangeBody;
  var ObjectList = [];

  params = {
    spreadsheetId: '1k1mtGDWUmDmOh8qCV8CK5gcY6cIoKmG7KmS6hS-b49k',
    range: Range,
    majorDimension: 'COLUMNS',
    valueRenderOption: 'FORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  
  request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    var range = response.result;
    if (range.values.length > 1) {
      var header = range.values[0];
      for (i = 1; i < range.values.length; i++) {
        var row = range.values[i];
        var NewObject;
        for (j = 0; j < header.length; j++) {
          Object.defineProperty(NewObject,header[j],row[j]);
        }
        ObjectLisr.push(NewObject);
      }
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
    appendPre('Loaded' + ObjectList.length + ' ' + StructureName);
  
  return ObjectList;
}

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
  test1();
}

function test1() {
  appendPre('Test 1 started successfully! Stand by…\n');
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

    // How the input data should be interpreted.
    valueInputOption: 'USER_ENTERED',
    
    includeValuesInResponse: true,
    
    responseValueRenderOption: 'FORMATTED_VALUE',
    
    responseDateTimeRenderOption: 'FORMATTED_STRING',
  };

  var date = new Date();
  valueRangeBody = {
    "values": [[date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()]],
    
    // Whether to get as ROWS or COLUMNS
    majorDimension: 'COLUMNS'
  };

  request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
  request.then(function(response) {
    appendPre('\nUPDATE TEST');
    appendPre('Last Accessed:');
    appendPre(response.result.updatedData.values);
    test2();
  }, function(reason) {
    appendPre('Error: ' + reason.result.error.message);
    test2();
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

function test2() {
  appendPre('\nTest 2 started successfully! Stand by…\n');
  get('B2:D',function(values) {
    if (values.length > 0) {
      appendPre('GET TEST\nCol.B2+, Col.D2+:');
      for (i = 0; i < values.length; i++) {
        var row = values[i];
        // Print columns B and D, which correspond to indices 0 and 2.
        appendPre(row[0] + ', ' + row[2]);
      }
    } else {
      appendPre('No data found.');
    }
  });
  
  // Test Cell Data UPDATE
  var date = new Date();
  date = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  set('F2', date, function(values){
    appendPre('\nUPDATE TEST');
    appendPre('Last Accessed:');
    appendPre(values);
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
  
