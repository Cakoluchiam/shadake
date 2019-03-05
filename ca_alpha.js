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
  appendPre('Started successfully! Stand by…');
  
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
