(function() {
  if (! window.Zeevex) {
    window.Zeevex = {};
  }
  var Zeevex = window.Zeevex;

  Zeevex.zesa = {
      internal: {}
  };

  Zeevex.init = function(options) {
    if (typeof options == "string") {
      Zeevex.config.baseurl = options;
    } else if (typeof options == "object") {
      Zeevex.config = options;
    }
    
    if (! Zeevex.config.baseurl) {
      Zeevex.config.baseurl = Zeevex.config.sandbox ? "http://sandbox.zeevex.com" : "http://www.zeevex.com";
    }
    
    Zeevex.config.initialized = true;
  };

  Zeevex.internal.checkInit = function() {
    if (! Zeevex.config.initialized) {
      err = new Error();
      err.name = "ZeevexUninitialized";
      err.message = "You must initialize the Zeevex library before using it.";
      throw err;
    }
  };

  Zeevex.zesa.internal.webscr = function() {
    return Zeevex.config.baseurl.replace(/\/+$/, "/cgi-bin/webscr");
  };

  Zeevex.zesa.submitPurchaseRequest = function(data, success, failure) {
      Zeevex.internal.checkInit();
      if (typeof data == 'string' && jQuery(data).size() == 1) {
        data = jQuery(data).formSerialize();
      } else if (typeof data == 'object' && data.appendChild) {
        data = jQuery(data).formSerialize();
      } else if (typeof data == 'object' && data.jquery) {
        data = data.formSerialize();
      }
    
      jQuery.ajax({url: Zeevex.zesa.internal.webscr(),
                 data: data,
                 dataType: 'jsonp',
                 success: success,
                 failure: failure
                });
  };
})();
