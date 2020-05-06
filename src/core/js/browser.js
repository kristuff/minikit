/*! kristuff.Minikit.Browser */
(function (window, undefined) {
    'use strict';
    var Browser = (function (args) {

        // change the url in browser with given href
        var changeURL = function (href) {
            if (history.pushState) {
                history.pushState(null, null, href);
            } else {
                document.location.hash = href;
            }
        };

        // back trigger
        var goBack = function(){
            window.history.back();
        };
        
        // public method
        return {
            goBack: goBack,
            changeURL: changeURL,
        };
    })();

    // register
    window.Minikit.Browser = Browser;

})(window, window.document, Element.prototype);
