// For stuff that does stuff with things.

/**
 * Chooses an item from a list, with weighted randomness.
 * Weights do not need to sum to 1.
 *
 * Accepts one of:
 *  Array of items and an Array of weights.
 *  Object of the form {item1: weight1, item2: weight2, ...}
 *  Two-column array of the form [[item1, item2, ...], [weight1, weight2, ...]]
**/
function weightedChoice(stuff, weights) {
  let items;
  if(weights === undefined) {
    if(Array.isArray(stuff)) {
      items = stuff[0];
      weights = stuff[1];
    } else {
      items = Object.keys(stuff);
      weights = Object.values(stuff);
    }
  } else {
    items = stuff;
  }
  
  let roll = Math.random() * weights.reduce((sum, value) => {return sum+value;}, 0);
  let choice;
  
  weights.reduce((mass, weight, index) => {
    if(choice !== undefined) return 0;
    if(mass <= weight) {
      choice = items[index];
      return 0;
    } else return (mass - weight);
  }, roll);
  
  return choice;
}

/**
 * Google Sheets modification
**/
let DEFAULT_SHEET = '1k1mtGDWUmDmOh8qCV8CK5gcY6cIoKmG7KmS6hS-b49k';

/**
 * Simple get, returns range from default sheet as columns
 *
 * @param {string} A1 notation of range to get
 * @param {function} callback function (optional; defaults to console.log)
 * @param {function} error callback (optional; defaults to console.error)
 * @param {params} any special parameters, using GSheets API (optional)
 * @param {boolean} set TRUE if you want the CB called on the full response;
 * .                defaults to CB called only with the value array (optional)
 * .                (error is always called with full response)
 */
function get(range, callback=console.log, error=console.error, params={}, cb_full=false) {
  var request;
  params = Object.assign({
    spreadsheetId: DEFAULT_SHEET,
    range: range,
    majorDimension: 'COLUMNS'
  },params);
  
  request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response){
    if(cb_full) callback(response);
    else callback(response.result.values);
  }, error);
}


/**
 * Simple set, sets range to match an array of columns or a value
 *
 * @param {string} A1 notation of range to set
 * @param {Array or value} Array of column data, e.g. [['A1','A2',...],['B1','B2',...],...]
 * .                       if not passed an Array, will send value as [[value]]
 * @param {function} callback function (optional; defaults to none)
 * @param {function} error callback (optional; defaults to console.error)
 * @param {Object} any special parameters, using GSheets API
 * @param {Object} any special parameters to put into the values
 * @param {boolean} set TRUE if you want the CB called on the full response;
 * .                defaults to CB called only with the value array
 * .                (error is always called with full response)
 */
function set(range, values, callback=function(){}, error=console.error, params={}, valueParams={}, cb_full=false) {
  var request;
  params = Object.assign({
    spreadsheetId: DEFAULT_SHEET,
    range: range,
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse: true
  },params);
  if(!Array.isArray(values)) values = [[values]];
  valueParams = Object.assign({
    values: values,
    majorDimension: 'COLUMNS'
  },valueParams);
  
  request = gapi.client.sheets.spreadsheets.values.update(params,valueParams);
  request.then(function(response){
    if(cb_full) callback(response);
    else callback(response.result.updatedData.values);
  }, error);
}
