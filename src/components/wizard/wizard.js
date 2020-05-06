/* kristuff.Minikit.Wizard */
(function (window, undefined) {
    'use strict';

    // wizard component
    var wizard = function (el) {
        var html = el;
        var next = function () {
            var currentIndex = Number(html.getAttribute('data-wizard-current-index'));
            var maxIndex = html.querySelectorAll('[data-wizard-index]').length -1;
            if (currentIndex < maxIndex) {
                setIndex(currentIndex + 1);
            } else {
                close('lastIndexLimit');
            }
        };
        var prev = function () {
            var currentIndex = Number(html.getAttribute('data-wizard-current-index'));
            if (currentIndex > 0) setIndex(currentIndex - 1);
        };
        var setIndex = function (index) {
            var onIndexChangedFunction = function (wizard, oldindex, newindex) {
                var nb = wizard.querySelectorAll('[data-wizard-index]').length;
                var evt = new CustomEvent('indexChanged', { detail: { oldIndex: oldindex, newIndex: newindex, total: nb} });
                wizard.dispatchEvent(evt);
            };
            var currentIndex = Number(html.getAttribute('data-wizard-current-index'));
            var maximum = null;
            Array.prototype.forEach.call(html.querySelectorAll('[data-wizard-index]'), function (el) {
                var value = parseInt(el.getAttribute('data-wizard-index'));
                maximum = (value > maximum) ? value : maximum;
            });
            Array.prototype.forEach.call(html.querySelectorAll("[data-wizard-index]"), function (el, i) {
                if (Number(el.getAttribute('data-wizard-index')) === index) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });
            html.setAttribute('data-wizard-current-index', index);
            onIndexChangedFunction(html, currentIndex, index);
        };
        var indexChanged = function (callback) {
            Minikit.Event.add(el, 'indexChanged', function (e) {
                callback(e);
            });

        };
        var close = function (raison) {
            html.parentNode.classList.remove('active');
            var evt = new CustomEvent('closed', { detail: { raison: raison} });
            html.dispatchEvent(evt);
        };
        var closed = function (callback) {
            Minikit.Event.add(el, 'closed', function (e) {
                callback(e);
            });
        };
        if (el) {
            Array.prototype.forEach.call(html.querySelectorAll(".wizard-button-next"), function (el, i) {
                Minikit.Event.add(el, 'click', function (e) {
                    e.preventDefault();
                    if (el.getAttribute('data-enabled') === 'false') return;
                    next();
                });
            });
            Array.prototype.forEach.call(html.querySelectorAll(".wizard-button-prev"), function (el, i) {
                Minikit.Event.add(el, 'click', function (e) {
                    e.preventDefault();
                    if (el.getAttribute('data-enabled') === 'false') return;
                    prev();
                });
            });
            Array.prototype.forEach.call(html.querySelectorAll(".wizard-button-close"), function (el, i) {
                Minikit.Event.add(el, 'click', function (e) {
                    e.preventDefault();
                    close('buttonClosedClick');
                });
            });
            setIndex(0);
        }

        /* Public methods */
        return {
            html: html,
            next: next,
            prev: prev,
            index: setIndex,
            onIndexChanged: indexChanged,
            onClosed: closed
        };
    };

    window.Minikit.Wizard = wizard;

})(window);
