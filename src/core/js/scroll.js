/*! Kristuff.Minikit.Scroll */
(function (w, d, undefined) {
    'use strict';
    var Scroll = (function () {
        var scrollToElement = function (element) {
            if (Minikit.isObj(element)) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };
        var scrollToTop = function () {
            w.scroll({ top: 0, left: 0, behavior: 'smooth' });
        };
        var scrollToBottom = function () {
            w.scroll({ bottom: 0, left: 0, behavior: 'smooth' });
        };
        var scrollLeft = function () {
            return (w.pageXOffset !== undefined) ? w.pageXOffset : (d.documentElement || d.body.parentNode || d.body).scrollLeft;
        };
        var scrollTop = function () {
            return (w.pageYOffset !== undefined) ? w.pageYOffset : (d.documentElement || d.body.parentNode || d.body).scrollTop;
        };
     
        var refreshScrollChangeElements = function () {
            Minikit.each(d.querySelectorAll('[data-scroll-change]'), function (el) {

                var scrollVisibility = Minikit.getAttr(el, 'data-scroll-change', 100),
                    scrollClass      = Minikit.getAttr(el, 'data-scroll-class', 'scrolled'),
                    y = w.scrollY;

                if (y > scrollVisibility) {
                    el.classList.add(scrollClass);

                } else if (y < scrollVisibility) {
                    el.classList.remove(scrollClass);
                }
            });
        };
        var initScrollChangeElements = function () {    
            w.addEventListener('scroll', Minikit.throttle(refreshScrollChangeElements, 50));
        };
        var initScrollTargetElements = function () {
            Minikit.each(d.querySelectorAll('[data-scroll-target]'), function (el) {
                //if (el.getAttribute('data-scroll-target-binded') === 'true') return;
                Minikit.Event.add(el, 'click', function (e) {
                    e.preventDefault();
                    var target = Minikit.getAttr(el, 'data-scroll-target', '');
                    switch (target) {
                        case '': return false;
                        case 'top': scrollToTop(); break;
                        case 'bottom': scrollToBottom(); break;
                        default: scrollToElement(d.getElementById(target));
                    }
                });
                //el.setAttribute('data-scroll-target-binded', 'true');
            });
        };

        Minikit.ready(function () {
            initScrollChangeElements();
            initScrollTargetElements();
        });

        return {
            left: scrollLeft,
            top: scrollTop,
            toTop: scrollToTop,
            toBottom: scrollToBottom,
            toElement: scrollToElement
        };
    })();
    w.Minikit.Scroll = Scroll;
})(window, document);
