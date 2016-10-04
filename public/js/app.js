/**
 * app
 */
window.app = (function (window, document, jsonp) {

  /* ========== */
  /* Properties */
  /* ========== */

  var SERVER_URL = 'http://localhost:3000';


  /* ================ */
  /* Workflow Methods */
  /* ================ */

  /**
   * Redirects to the server's session management route.
   * @returns {boolean} False to prevent event propagation.
   */
  function onClickBeginSession(event) {
    window.location = SERVER_URL + '/session?redirectUri=' + window.location.href;
    return false;
  }

  function onReceiveData(data) {
    appForm.responseTarget.value = JSON.stringify(data);
  }

  /**
   * Handles the `onsubmit` event for a form.
   * @param {Object} event The original onsubmit event.
   * @returns {boolean} False to prevent event propagation.
   */
  function onSubmitAppForm(event) {
    /* build data payload */
    var data;
    try {
      data = JSON.parse(appForm.requestTarget.value);
    } catch(e) {
      appForm.responseTarget.value = 'Failed to parse request JSON.';
      return false;
    }
    /* perform request */
    jsonp.request({
      url: SERVER_URL + '/dynamic.js',
      callback: 'app.onReceiveData',
      data: data
    });
    /* prevent event propagation */
    return false;
  }


  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    'onClickBeginSession': onClickBeginSession,
    'onReceiveData': onReceiveData,
    'onSubmitAppForm': onSubmitAppForm
  };

})(window, window.document, window.jsonp);
