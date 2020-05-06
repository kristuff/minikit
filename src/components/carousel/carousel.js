/* kristuff.Minikit.Carousel */
(function (window, undefined) {
    'use strict';
    var Carousel = (function (element, options) {
        var _autoDuration = 0,
            _selectedIndex = 0,
            _touchAnchorX = 0,
            _touchTime = 0,
            _touchX1 = 0,
            _touchX2 = 0;
        var _container = element.querySelector('.carousel-inner');
        var _interval = null;
        var _nav = element.querySelector('nav');
        var _countSlides = function () {
            return _container.querySelectorAll('.carousel-item').length;
        };
        var _updateNav = function () {
            var html = '', count = _countSlides();
            for (var i = 0; i < count; i++) {
                if (i > 0) html += '&nbsp;';
                html += '<a' + (i == _selectedIndex ? ' class="current"' : '') + ' data-index="' + i + '" href="#">●</a>';
            }
            _nav.innerHTML = html;
        }
        var _autoPlay = function (ms) {
            if (_interval) {
                clearInterval(_interval);
                _interval = null;
            }
            if (ms) {
                _autoDuration = ms;
                _interval = setInterval(function () { next(); }, ms);
            }
        }
        var _handleEvent = function (event) {
            if (event.touches && event.touches.length > 0) {
                _touchTime = +new Date;
                _touchX1 = _touchX2;
                _touchX2 = event.touches[0].screenX;
            }
            var screen = document.documentElement.clientWidth;
            var position = _selectedIndex + (_touchAnchorX - _touchX2) / screen;
            var velocity = (new Date - _touchTime) <= 200 ? (_touchX1 - _touchX2) / screen : 0;
            switch (event.type) {
                case 'blur':
                    stop();
                    break;
                case 'click':
                    if (event.target.parentNode != _nav) break;
                    var i = parseInt(event.target.dataset.index);
                    if (!isNaN(i)) {
                        event.preventDefault();
                        stop();
                        selectedIndex(i);
                        play(_autoDuration);
                    }
                    break;
                case 'focus':
                    _autoPlay(_autoDuration);
                    break;
                case 'touchstart':
                   // event.preventDefault();
                    stop();
                    _container.style.transition = 'none';
                    _touchAnchorX = _touchX1 = _touchX2;
                    break;
                case 'touchmove':
                    //_container.style.transform = 'translate3d(' + (-position * 100) + 'vw, 0, 0)';
                    _container.style.transform = 'translate3d(' + (-position * 100) + '%, 0, 0)';
                    break;
                case 'touchend':
                    _container.style.transition = '';
                    var offset = Math.min(Math.max(velocity * 4, -0.5), 0.5);
                    selectedIndex(Math.round(position + offset));
                    break;
                case 'transitionend':
                    var i = _selectedIndex, count = _countSlides();
                    if (i >= 0 && i < count) break;
                    // The slides should wrap around. Instantly move to just outside screen on the other end.
                    _container.style.transition = 'none';
                    _container.style.transform = 'translate3d(' + (i < 0 ? -count * 100 : 100) + '%, 0, 0)';
                    //_container.style.transform = 'translate3d(' + (i < 0 ? -count * 100 : 100) + 'vw, 0, 0)';
                    // Force changes to be applied sequentially by reflowing the element.
                    _container.offsetHeight;
                    _container.style.transition = '';
                    _container.offsetHeight;
                    // Animate the first/last slide in.
                    selectedIndex(i < 0 ? count - 1 : 0);
                    break;
            }
        };
        var selectedIndex = function (i) {
            var count = _countSlides();
            if (i < 0) { i = -1; } else if (i >= count) { i = count; }
            _selectedIndex = i;
            _container.style.transform = 'translate3d(' + (-i * 100) + '%, 0, 0)';
            //_container.style.transform = 'translate3d(' + (-i * 100) + 'vw, 0, 0)';
            _updateNav();
        };
        var next = function () {
            selectedIndex(_selectedIndex + 1);
        };
        var previous = function () {
            selectedIndex(_selectedIndex - 1);
        };
        var stop = function () {
            _autoPlay(0);
        }
        var play = function (duration) {
            _autoPlay(duration);
        }
        element.addEventListener('click', _handleEvent);
        element.addEventListener('touchstart', _handleEvent);
        element.addEventListener('touchmove', _handleEvent);
        element.addEventListener('touchend', _handleEvent);
        element.addEventListener('transitionend', _handleEvent);
        window.addEventListener('blur', _handleEvent);
        window.addEventListener('focus', _handleEvent);
        selectedIndex(0);
        element.setAttribute('data-binded', 'true');
        return {
            next: next,
            prev: previous,
            selectedIndex: selectedIndex,
            play: play,
            stop: stop
        }
    });
    Minikit.ready(function () {
        Array.prototype.map.call(document.querySelectorAll('.carousel:not([data-binded])'), function (element) {
            var carousel = new Carousel(element);
            var auto = Minikit.getAttr(element, 'data-carousel-auto', 0);
            if (auto != 0) {
                carousel.play(auto);
            }
        })
    });
    window.Minikit.Carousel = Carousel;
})(window);
