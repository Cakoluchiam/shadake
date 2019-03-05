/**
 *  Here's where we do stuff. Well, first some housekeeping to make sure we're signed in and can manipulate the sheets.
 */

// First, wait to do stuff until the user is signed in.
gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

// Handle the initial sign-in state
updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    sign_in();
  } else {
    sign_out();
  }
}

// Anything special when the user signs in. For now let's just initialize everything by default.
function sign_in() {
  start();
}

// Anything special when the user signs out. Clean-up for reinitialization etc.
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
