/* Kristuff.Minikit.Tabs*/
(function (window, undefined) {
    'use strict';

    var tabLink = function (e) {

        var element = e.target,
            tabControl = element.closest('.tab-control'),
            newTabId = element.getAttribute('data-tab-target'),
            newTab = tabControl.querySelector('#' + newTabId),
            tabs = tabControl.querySelectorAll(':scope > .tab'),
            navTabs = tabControl.querySelectorAll(':scope > .tab-items > li > a');

        e.preventDefault();

        // set select tab 
        Minikit.each(tabs, function (element) {
            element.classList.remove('current');
        });
        newTab.classList.add('current');

        Minikit.each(navTabs, function (element) {
            if (element.getAttribute('data-tab-target') === newTabId) {
                element.parentNode.classList.add('current');
            } else {
                element.parentNode.classList.remove('current');
            }
        });

    }
    Minikit.ready(function () {
        Minikit.each(document.querySelectorAll('[data-tab-target]'), function (element) {
            Minikit.Event.add(element, 'click', tabLink);
        });
    });

})(window);
