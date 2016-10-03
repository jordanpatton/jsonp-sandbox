/**
 * app
 */
window.app = (function (window, document, scriptInjector) {

  /* ================ */
  /* Workflow Methods */
  /* ================ */

  /**
   * Handles the `onsubmit` event for a form.
   * @param {Object} event The original onsubmit event.
   * @returns {boolean} False to prevent event propagation.
   */
  function onSubmit(event) {
    var successCallback = function(response, requestId) {
      sandboxForm.responseTarget.value = JSON.stringify(response);
      /* delete ingested data */
      delete scriptInjector.ingest[requestId];
      /* delete injected script element */
      var element = document.getElementById(requestId);
      var parent = element.parentElement;
      parent.removeChild(element);
    };
    var failureCallback = function(requestId) {
      sandboxForm.responseTarget.value = 'Inject failed!';
    };

    var payload;
    try {
      payload = JSON.parse(sandboxForm.requestTarget.value);
    } catch(e) {
      sandboxForm.responseTarget.value = 'Failed to parse request JSON.';
      return false;
    }

    scriptInjector.request(payload, successCallback, failureCallback);

    return false;
  }


  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    'onSubmit': onSubmit
  };

})(window, window.document, window.scriptInjector);
