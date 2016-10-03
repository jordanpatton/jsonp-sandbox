/**
 * App
 */
window.App = (function (window, document, ScriptInjector) {

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
      scriptInjectorSandboxForm.responseTarget.value = JSON.stringify(response);
      /* delete ingested data */
      delete ScriptInjector.ingest[requestId];
      /* delete injected script element */
      var element = document.getElementById(requestId);
      var parent = element.parentElement;
      parent.removeChild(element);
    };
    var failureCallback = function(requestId) {
      scriptInjectorSandboxForm.responseTarget.value = 'Inject failed!';
    };

    var payload;
    try {
      payload = JSON.parse(scriptInjectorSandboxForm.requestTarget.value);
    } catch(e) {
      scriptInjectorSandboxForm.responseTarget.value = 'Failed to parse request JSON.';
      return false;
    }

    ScriptInjector.request(payload, successCallback, failureCallback);

    return false;
  }


  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    'onSubmit': onSubmit
  };

})(window, window.document, window.ScriptInjector);
