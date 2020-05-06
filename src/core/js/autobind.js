/*! kristuff.Minikit.Core */
(function (w, d, p, undefined) {
    'use strict';

    var handleElementEvent = function(e, type) {
        var action = e.target.closest(type).getAttribute('data-bind');
        if (action != null && action != '') {
            Minikit.executeFunctionByName(action);
            e.preventDefault();
        }
    }

    var handleLinkEvent = function(e) {
        handleElementEvent(e,'A');
    }

    var handleButtonEvent = function(e) {
        handleElementEvent(e,'BUTTON');
    }

    var handleSelectEvent = function(e) {
        handleElementEvent(e,'SELECT');
    }
    var handleInputEvent = function(e) {
        handleElementEvent(e,'INPUT');
    }


    Minikit.ready( function() {
        Minikit.each(document.querySelectorAll('a[data-bind]'), function (el) {
            Minikit.Event.add(el, Minikit.getAttr(el, 'data-bind-event', 'click'), handleLinkEvent);
        });
        Minikit.each(document.querySelectorAll('button[data-bind]'), function (el) {
            Minikit.Event.add(el, Minikit.getAttr(el, 'data-bind-event', 'click'), handleButtonEvent);
        });
        Minikit.each(document.querySelectorAll('select[data-bind]'), function (el) {
            Minikit.Event.add(el, Minikit.getAttr(el, 'data-bind-event', 'change'), handleSelectEvent);
        });
        Minikit.each(document.querySelectorAll('input[data-bind]'), function (el) {
            Minikit.Event.add(el, Minikit.getAttr(el, 'data-bind-event', 'change'), handleInputEvent);
        });
    });

})(window, window.document, Element.prototype);


