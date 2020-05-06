/*! kristuff.Minikit.Core */
(function (w, d, p, undefined) {
    'use strict';
    
    var Core = (function () {
        
        var isTouchDevice = function () {
            return 'ontouchstart' in window    // works on most browsers 
                || navigator.maxTouchPoints;   // works on IE10/11 and Surface
        };

        var shuffle = function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };

        var newId = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return '_' + Math.random().toString(36).substr(2, 9);
        };

        var each = function (elements, fn) {
            Array.prototype.forEach.call(elements, function (el) {
                fn(el);
            });
        };

        var isNotNull = function (obj) {
            return (obj !== "null") && !("undefined" === typeof obj);
        };

        var isObj = function (obj) {
            return (obj) && (obj !== "null") && (obj !== "undefined");
        };

        var isInt = function (obj) {
            return (obj === parseInt(obj, 10));
        };

        var isFn = function (fn, execute, args) {
            var result = (fn) && (fn !== "null") && (fn !== "undefined") && (typeof fn === "function");
            var args = (args !== "undefined") ? args : null;

            if (result && execute === true) {
               return fn(args);
            }
            return result;
        };

        var attr = function (el, attr, value) {
            if (isObj(el) && isObj(value)) {
                el.setAttribute(attr, value);
            }
            var currentVal = isObj(el) ? el.getAttribute(attr) : false;
            return currentVal;
        };

        var getAttr = function (el, attr, defaultValue) {
            return isObj(el) && isObj(el.getAttribute(attr)) ? el.getAttribute(attr) : defaultValue;
        };

        var fadeOut = function (el, callback) {
            var op = 1;  // initial opacity
            el.style.transition = 'all .1s linear';
            var timer = setInterval(function () {
                if (op <= 0.1) {
                    clearInterval(timer);
                    el.style.display = 'none';
                    isFn(callback, true);
                }
                el.style.opacity = op;
                el.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op -= op * 0.1;
            }, 50);
        };
        
        var fadeIn = function (el, callback) {
            var op = 0.1;  // initial opacity
            el.style.transition = 'all .1s linear';
            el.style.display = 'block';
            var timer = setInterval(function () {
                if (op >= 1) {
                    clearInterval(timer);
                    isFn(callback, true);
                }
                el.style.opacity = op;
                el.style.filter = 'alpha(opacity=' + op * 100 + ")";
                op += op * 0.1;
            }, 10);
        };

        var getWindowWidth = function () {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            return width;
        };
        
        var getWindowHeight = function () {
            var width = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            return width;
        };

        // support for full screen
        var requestFullScreen = function (element) {
            //var elem = document.body; // Make the body go full screen.
            //requestFullScreen(elem);
            // Supports most browsers and their versions.
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen ||
                            element.mozRequestFullScreen || element.msRequestFullScreen;

            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        };

        var throttle = function (fn, wait) {
            var time = Date.now();
            return function() {
                if ((time + wait - Date.now()) < 0) {
                    fn();
                    time = Date.now();
                }
            }
        };

        // support for document ready
        var documentReady = function (fn) {
            if (d.readyState != 'loading') {
                fn();
            } else {
                d.addEventListener('DOMContentLoaded', fn);
            }
        };

        // support for matches
        if (!p.matches) p.matches = p.msMatchesSelector;
        
        // support for closest
        if (!p.closest) p.closest = function (selector) {
            var el = this;
            while (el) {
                if (el.matches(selector)) {
                    return el;
                }
                el = el.parentElement;
            }
        };

        // support for :scope selector    
        // node.querySelector(':scope > someselector');
        try { 
            // check if browser supports :scope natively
            d.querySelector(':scope body');
        } catch (err) { 
            // polyfill native methods if it doesn't
            ['querySelector', 'querySelectorAll'].forEach(function (method) {
                var nativ = p[method];
                p[method] = function (selectors) {
                    if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
                        var id = this.id; // remember current element id
                        this.id = 'ID_' + Date.now(); // assign new unique id
                        selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
                        var result = d[method](selectors);
                        this.id = id; // restore previous id
                        return result;
                    } else {
                        return nativ.call(this, selectors); // use native code for other selectors
                    }
                }
            });
        };


        // utils
        var executeFunctionByName = function( functionName, context /*, args */ ) {
            var args, namespaces, func;
    
            if( typeof functionName === 'undefined' ) {
                throw 'function name not specified'; 
            }
            if( typeof eval( functionName ) !== 'function' ) { 
                throw functionName + ' is not a function'; 
            }
            if( typeof context !== 'undefined' ) { 
                if( typeof context === 'object' && context instanceof Array === false ) { 
                    if( typeof context[ functionName ] !== 'function' ) {
                        throw context + '.' + functionName + ' is not a function';
                    }
                    args = Array.prototype.slice.call( arguments, 2 );
    
                } else {
                    args = Array.prototype.slice.call( arguments, 1 );
                    context = window;
                }
            } else {
                context = window;
            }
    
            namespaces = functionName.split( "." );
            func = namespaces.pop();
    
            for( var i = 0; i < namespaces.length; i++ ) {
                context = context[ namespaces[ i ] ];
            }
    
            return context[ func ].apply( context, args );
        }

        //public fonctions
        return {
            ready: documentReady,
            each: each,
            isFn: isFn,
            isObj: isObj,
            isNotNull: isNotNull,
            isInt: isInt,
            isTouchDevice: isTouchDevice,
            attr: attr,
            getAttr: getAttr,
            executeFunctionByName: executeFunctionByName,
            shuffle: shuffle,
            newId:newId,
            throttle: throttle,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
            requestFullScreen: requestFullScreen,
            getWindowWidth: getWindowWidth,
            getWindowHeight: getWindowHeight
        };
    })();

    // register minikit core    
    w.Minikit = Core;
})(window, window.document, Element.prototype);
