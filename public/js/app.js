/**
 * app
 */
window.app = (function (window, document, scriptInjector) {

  /* ================ */
  /* Workflow Methods */
  /* ================ */

  /**
   * Redirects to the server's session management route.
   * @returns {boolean} False to prevent event propagation.
   */
  function onClickBeginSession(event) {
    window.location = 'http://localhost:3000/session?redirectUri=' + window.location.href;
    return false;
  }

  /**
   * Handles the `onsubmit` event for a form.
   * @param {Object} event The original onsubmit event.
   * @returns {boolean} False to prevent event propagation.
   */
  function onSubmitAppForm(event) {
    var successCallback = function(response, requestId) {
      appForm.responseTarget.value = JSON.stringify(response);
      /* delete ingested data */
      delete scriptInjector.ingest[requestId];
      /* delete injected script element */
      var element = document.getElementById(requestId);
      var parent = element.parentElement;
      parent.removeChild(element);
    };
    var failureCallback = function(requestId) {
      appForm.responseTarget.value = 'Inject failed!';
    };

    var payload;
    try {
      payload = JSON.parse(appForm.requestTarget.value);
    } catch(e) {
      appForm.responseTarget.value = 'Failed to parse request JSON.';
      return false;
    }

    scriptInjector.request(payload, successCallback, failureCallback);

    return false;
  }


  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    'onClickBeginSession': onClickBeginSession,
    'onSubmitAppForm': onSubmitAppForm
  };

})(window, window.document, window.scriptInjector);
