/* Kristuff.Minikit.SideMenu */
(function (window, undefined) {
    'use strict';
    var sideMenu = function (el) {
        var htmlSideMenu = el,
            htmlSideMenuPinTriggerImage = {};

        var toggleMenuState = function () {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (width <= 767) {
                htmlSideMenu.classList.toggle('open');
            } else {
                htmlSideMenu.classList.toggle('expanded');
                var evt = new CustomEvent('stateChange', { detail: {} });
                htmlSideMenu.dispatchEvent(evt);
            }
        };

        var toggleMenuPinState = function () {
            htmlSideMenu.classList.toggle('pinned');
            if (Minikit.isObj(htmlSideMenuPinTriggerImage)) {
                htmlSideMenuPinTriggerImage.classList.toggle('fa-rotate-90');
            }
        };

        var htmlSideMenuPinTrigger = el.querySelector('.side-menu-pin-trigger');
        if (Minikit.isObj(htmlSideMenuPinTrigger)) {
            htmlSideMenuPinTriggerImage = htmlSideMenuPinTrigger.querySelector('i.fa');

            if (htmlSideMenuPinTrigger.classList.contains('pinned')) {
                htmlSideMenuPinTriggerImage.classList.add('fa-rotate-90')
            } else{
                htmlSideMenuPinTriggerImage.classList.remove('fa-rotate-90')
            }

            htmlSideMenuPinTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                toggleMenuPinState();
            }, false);
        }

        var htmlOverlay = document.querySelector('.overlay');
        if (Minikit.isObj(htmlOverlay)) {
            htmlOverlay.addEventListener("click", function (e) {
                htmlSideMenu.classList.remove('open');
                htmlSideMenu.classList.remove('pinned');
            }, false);
        }

        Array.prototype.forEach.call(document.querySelectorAll('.side-menu-trigger'), function (elmt, i) {
            elmt.addEventListener('click', function (e) {
                e.preventDefault();
                toggleMenuState();
            }, false);
        });

        return {
            htmlElement: htmlSideMenu
        };
    };
    Minikit.ready(function () {
        Minikit.each(document.querySelectorAll('.side-menu'), function (element) {
            var menu = new sideMenu(element);
        });
    });
    window.Minikit.SideMenu = sideMenu;
})(window);