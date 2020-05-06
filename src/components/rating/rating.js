/* Kristuff.Minikit.Ratings */
(function (window, undefined) {
    'use strict';
    var Ratings = (function () {

        // Rating control element
        var Rating = function (element, value, editable) {
            var htmlElement = element;
            var create = function () {
                if (Minikit.isObj(element)) {
                    var attrEditable = element.classList.contains('edit');
                    var isEditable = editable ? editable : attrEditable;
                    initElement(element, value, isEditable);
                }
            };
            var onRatingValueChanged = function (fn) {
                Minikit.Event.add(htmlElement, 'ratingValueChanged', fn);
            };

            // init element
            create();

            //public 
            return {
                htmlElement: htmlElement,
                onRatingValueChanged: onRatingValueChanged
            }
        };

        // Internal
        var createElement = function (value, editable) {
            var el = document.createElement('SPAN');
            el.classList.add('rating');
            initElement(el, value, editable);
            return el;
        };
        var createInstance = function (value, editable) {
            var el = document.createElement('SPAN');
            el.classList.add('rating');
            return new Rating(el, value, editable);
        };
        var initElement = function (el, value, editable) {
            if (!Minikit.isObj(el)) {
                return;
            }
            var val = Minikit.isObj(value) ? value : Minikit.getAttr(el, 'data-value', 0);
            var edit = Minikit.isObj(editable) ? editable : el.classList.contains('edit');
            el.setAttribute('data-value', val);
            if (edit === true) {
                el.classList.add('edit');
            } else {
                el.classList.remove('edit');
            }
            el.innerHTML =  '<span class="star"></span>' +
                    '<span class="star"></span>' +
                    '<span class="star"></span>' +
                    '<span class="star"></span>' +
                    '<span class="star"></span>';
            if (edit === true) {
                Minikit.Event.add(el, 'click', function (e) {
                    var arg = e.target;
                    if (!arg.classList.contains('star')) {
                        return;
                    }
                    var elmts = el.querySelectorAll('span.star');
                    var index = [].indexOf.call(elmts, arg);
                    var newValue = elmts.length - (index);
                    var currentValue = el.getAttribute('data-value');
                    el.setAttribute('data-value', newValue);
                    var evt = new CustomEvent('ratingValueChanged', { detail: { newValue: newValue, oldValue: currentValue} });
                    el.dispatchEvent(evt);
                });
            }
        };
        var initAll = function () {
            Minikit.each(document.querySelectorAll('.rating'), function (el) {
                initElement(el);
            });
        };
        var getHtml = function (value, editable) {
            var html = '';
            var val = value ? val : '0';            //TODO , + test...
            var edit = editable ? ' edit' : '';
            html += '<span class="rating' + edit;
            html += '" data-value="' + val + '">';
            html += '<span class="star"></span>';
            html += '<span class="star"></span>';
            html += '<span class="star"></span>';
            html += '<span class="star"></span>';
            html += '<span class="star"></span>';
            html += '</span>';
            return html;
        };

        /* Public methods */
        return {
            Rating: Rating,
            createElement: createElement,
            createInstance:createInstance,
            getHtml: getHtml,
            initAll: initAll
        };
    })();
    window.Minikit.Ratings = Ratings;

    Minikit.ready(function () {
        Minikit.Ratings.initAll();
    });
})(window);
