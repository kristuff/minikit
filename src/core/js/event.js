/*! kristuff.Minikit.Event */
(function (window, undefined) {
    'use strict';
    var Event = (function () {
        var add = function (object, type, callback) {
            if (object == null || typeof (object) == 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on" + type] = callback;
            }
        };
        var remove = function (object, type, callback) {
            if (object == null || typeof (object) == 'undefined') return;
            if (object.removeEventListener) {
                object.removeEventListener(type, callback, false);
            } else if (object.dettachEvent) {
                object.dettachEvent("on" + type, callback);
            } else {
                object["on" + type] = null;
            }
        };
        var trigger = function (el, eventName) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, false);
            el.dispatchEvent(event);
        };
        var documentReady = function (fn) {
            if (document.readyState != 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        };
        var isLeftButton = function (e) {
            e = e || window.event;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                return e.which == 1;
            else if ("button" in e)  // IE, Opera 
                return e.button == 0;
            else
                return false;
        };
        var isMiddlebutton = function (e) {
            e = e || window.event;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                return e.which == 2;
            else if ("button" in e)  // IE, Opera 
                return e.button == 1;
            else
                return false;
        };
        var isRightButton = function (e) {
            e = e || window.event;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                return e.which == 3;
            else if ("button" in e)  // IE, Opera 
                return e.button == 2;
            else
                return false;
        };

        return {
            isLeftButton: isLeftButton,
            isRightButton: isRightButton,
            isMiddlebutton: isMiddlebutton,
            documentReady: documentReady,
            add: add,
            remove: remove,
            trigger: trigger
        };
    })();
    window.Minikit.Event = Event;
})(window);
