/* Kristuff.Minikit.Toasts */
(function (window, undefined) {
    'use strict';
    var Toasts = (function () {

        // options
        var parentHtml = document.body;
        var Options = {
            toastDuration: 6000,
            theme: 'inherit'
            //htmlContainer: null
        };

        /* internals methods */
        var getToastsContainer = function (create) {
            var container = parentHtml.querySelector(".toast-notify-container");
            if (!Minikit.isObj(container) && create === true) {
                var el = document.createElement('DIV');
                el.classList.add('toast-notify-container');
                el.setAttribute('data-theme', Options.theme);
                parentHtml.appendChild(el);
                container = parentHtml.querySelector(".toast-notify-container");
            }
            return container;
        };
        var createToastItem = function (type, text) {
            var item, icon, itemInner;
            switch (type) {
                case 'success': icon = 'check-circle'; break;
                case 'warning': icon = 'exclamation-triangle'; break;
                case 'question': icon = 'question-circle'; break;
                case 'error': icon = 'exclamation-circle'; break;
                case 'info': icon = 'info-circle'; break;
                default:
                    icon = 'info-circle';
                    type = 'info';
            }

            item = document.createElement('DIV');
            item.classList.add('toast-notify-item');
            item.setAttribute('data-notify-type', type);
            itemInner = '<a class="toast-notify-item-close" href="#"><i class="fa fa-times"></i></a>' +
                    '<span class="toast-notify-item-icon"><i class="fa fa-2x fa-' + icon + '"></i></span>' +
                    '<span class="toast-notify-item-text">' + text + '</span>';
            item.innerHTML = itemInner;
            return item;
        };
        var showInfoToast = function (text, duration) {
            showToast('info', text, duration);
        };
        var showSuccessToast = function (text, duration) {
            showToast('success', text, duration);
        };
        var showWarningToast = function (text, duration) {
            showToast('warning', text, duration);
        };
        var showErrorToast = function (text, duration) {
            showToast('error', text, duration);
        };
        var showToast = function (type, text, duration) {
            var item, container, dur;

            // duration define and int value?
            dur = Minikit.isInt(duration) ? parseInt(duration,10) : toastDuration();

            // close toast functions
            var closeToast = function (raison) {
                var container = getToastsContainer();
                if (Minikit.isObj(container) && Minikit.isObj(item)) {
                    container.removeChild(item);
                    var evt = new CustomEvent('toastClosed', { detail: { closeRaison: raison, currentDuration: dur} });
                    container.dispatchEvent(evt);
                    item = null;
                }
            };
            var closeToastTimeOut = function () {
                if (Minikit.isObj(item)) {
                    Minikit.fadeOut(item, function () {
                        closeToast('TimeOut');
                    });
                }
            };

            // get or create toast container
            container = getToastsContainer(true);

            // create toast item
            item = createToastItem(type, text);

            // add item
            container.appendChild(item);
            Minikit.Event.add(item.querySelector('.toast-notify-item-close'), 'click', function (e) {
                e.preventDefault();
                closeToast('ButtonCloseClick');
            });

            // duration?
            if (dur != 0) {
                setTimeout(function () {
                    closeToastTimeOut();
                }, dur);
            }
        };

        // Get/Set theme
        var toastTheme = function (theme) {
            if (Minikit.isObj(theme)) {
                Options.theme = theme;
                // refresh
                var container = getToastsContainer();
                if (Minikit.isObj(container)) {
                    container.setAttribute('data-theme', Options.theme);
                }
            }
            return Options.theme;
        };

        // Get/Set Duration
        var toastDuration = function (duration) {
            if (Minikit.isObj(duration)) {
                Options.toastDuration = duration;
            }
            return Options.toastDuration;
        };

        // events
        var onToastClosed = function (fn) {
            var toastContainer = getToastsContainer(true);
            Minikit.Event.add(toastContainer, 'toastClosed', function (e) {
                fn(e);
            });
        };

        /* Public methods */
        return {
            duration: toastDuration,
            theme: toastTheme,
            show: showToast,
            showInfo: showInfoToast,
            showSuccess: showSuccessToast,
            showWarning: showWarningToast,
            showError: showErrorToast,

            //events
            onToastClosed: onToastClosed
        };

    }); //();
    window.Minikit.Toasts = Toasts;
})(window);
