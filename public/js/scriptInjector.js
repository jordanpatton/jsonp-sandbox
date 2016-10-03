/**
 * Script Injector
 * NOTE: Singleton; there should be exactly one ingest.
 */
window.scriptInjector = (function (window, document) {

  /* ========== */
  /* Properties */
  /* ========== */

  /**
   * Stores all of the inbound data from the server.
   */
  var ingest = {};


  /* =================== */
  /* Convenience Methods */
  /* =================== */

  /**
   * Randomly generates a GUID v4.
   * @returns {string} Randomly-generated GUID v4.
   */
  function guidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r=Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
      return v.toString(16);
    });
  }

  /**
   * Injects a script into the DOM with given options.
   * @param {Object} options Required.
   * @param {string} options.src Required.
   * @param {boolean} options.async Optional.
   * @param {function} options.callback Optional.
   * @param {boolean} options.defer Optional.
   * @param {string} options.id DOM selector for easy removal (optional).
   */
  function injectScript(options) {
    if (typeof options === 'undefined' || typeof options.src === 'undefined') {
      throw new TypeError('injectScript missing one of: options, options.src');
    }

    var headElement = document.getElementsByTagName('head')[0] || document.documentElement;
    var scriptElement = document.createElement('script');
    scriptElement.src = options.src;
    scriptElement.async = options.async || false;
    scriptElement.defer = options.defer || false;
    scriptElement.id = options.id || undefined;

    /* polyfill `onload` event for some older browsers */
    var isDone = false;
    scriptElement.onload = scriptElement.onreadystatechange = function(event) {
      /* if script is loaded... */
      if (!isDone && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
        isDone = true;
        /* invoke user callback */
        var callbackResult =
          (Object.prototype.toString.call(options.callback) === '[object Function]') ?
          options.callback(event) :
          undefined;
        /* unset event handler (avoid memory leak) */
        scriptElement.onload = scriptElement.onreadystatechange = null;
        /* remove DOM element */
        if (headElement && scriptElement.parentNode) {
          headElement.removeChild(scriptElement);
        }
        /* return user callback result */
        return callbackResult;
      }
    };
    /* insertBefore instead of appendChild for browser compatibility */
    headElement.insertBefore(scriptElement, headElement.firstChild);
  }

  /**
   * Recursively serializes data as a query-parameter string.
   * @param {Object} obj Data to serialize (required).
   * @param {string} pfx Key prefix for data chunk (optional).
   * @returns {string} Query-parameter string.
   */
  function serialize(obj, pfx) {
    var results = [];
    for(var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var key = pfx ? (pfx + '[' + prop + ']') : prop;
        var val = obj[prop]
        results.push(
          (typeof val === 'object') ?
          serialize(val, key) :
          (encodeURIComponent(key) + '=' + encodeURIComponent(val))
        );
      }
    }
    return results.join('&');
  }


  /* ================ */
  /* Workflow Methods */
  /* ================ */

  /**
   * Performs a script-injection request.
   * @param {Object} data JSON-compatible data payload (optional).
   * @param {function} successCallback Required.
   * @param {function} failureCallback Required.
   */
  function request(data, successCallback, failureCallback) {
    if (typeof successCallback === 'undefined' || typeof failureCallback === 'undefined') {
      throw new TypeError('request missing one of: successCallback, failureCallback');
    }

    var requestId = guidv4();
    var callback = function() {
      if (ingest && ingest[requestId]) {
        return successCallback(ingest[requestId], requestId);
      } else {
        return failureCallback(requestId);
      }
    };

    return injectScript({
      src: 'http://localhost:3000/dynamic.js?requestId='+requestId+'&'+serialize(data),
      callback: callback,
      id: requestId
    });
  }


  /* ===================================== */
  /* Publicly-Exposed Properties & Methods */
  /* ===================================== */

  return {
    'ingest': ingest,
    'request': request
  };

})(window, window.document);
