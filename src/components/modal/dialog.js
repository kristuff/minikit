
/* kristuff.Minikit.Dialog */
(function (w, d, undefined) {
    'use strict';

    var dialog = function (args) {
        var html,
            message     = Minikit.isObj(args.message) ? args.message : '',
            cancelable  = Minikit.isObj(args.cancelable)  && args.cancelable === true ? true : false,
            type        = Minikit.isObj(args.type) ? args.type : 'none',
            callBack    = Minikit.isObj(args.callback) ? args.callback : null,
            icon        = '',
            id          = Minikit.newId();

        switch (type) {
            case 'warning': icon =  'exclamation-triangle'; break;
            case 'question': icon = 'question-circle';      break;
            case 'error': icon =    'exclamation-circle';   break;
        }

        html = d.createElement('DIV');
        html.classList.add('dialog');
        html.classList.add('active');
        html.id = id;
        html.setAttribute('data-dialog-type', type);

        var htmlInner = '<div class="dialog-inner ">';
        //htmlInner += cancelable ? ' <div class="dialog-header"><a class="dialog-button-close" href="#"><i class="fa fa-times"></i></a></div>' : '';
        htmlInner += ' <div class="dialog-title"></div>' +
                               ' <div class="dialog-message">' +
                               '   <span class="dialog-message-icon"><i class="fa fa-3x fa-' + icon + '"></i></span>' +
                               '   <span class="dialog-message-text">' + message + '</span>' +
                               ' </div>' +
                               ' <div class="dialog-actions">' ;
        htmlInner += cancelable ? '<a href="#" class="button button-o fw dialog-button-cancel">Cancel</a>' : '';
        htmlInner +=            ' <a href="#" class="button fw dialog-button-ok theme">OK</a>' +
                          ' </div>' +
                         ' </div>';
        html.innerHTML = htmlInner;
        d.querySelector('body').appendChild(html);

        // give focus to OK Button
        d.querySelector('.dialog#' + id + ' .dialog-button-ok').focus();

        // close when click on overlay only
        var overlayClick = function (e) {
            var el = e.target.closest('.dialog-inner');
            if (!Minikit.isObj(el)) {
                close(e);
            }
        };
        var ok = function(e){
            e.preventDefault();
            close(e);
            Minikit.isFn(callBack, true);
        };
        var close = function (e) {
            e.preventDefault();
            html.classList.remove('active');
            destroy();
        };

        // escape 
        var handleKey = function (evt) {
            if (evt.keyCode === 27 && cancelable) {
                close(evt);
            }
        };
        // unbind
        var destroy = function () {
            Minikit.Event.remove(d.querySelector('.dialog#' + id + ' .dialog-button-ok'), 'click', ok);
            if (cancelable) {
                Minikit.Event.remove(d.querySelector('.dialog#' + id + ' .dialog-button-cancel'), 'click', close);
            }
            Minikit.Event.remove(html, 'click', close);
            Minikit.Event.remove(d, 'keyup', handleKey);
            d.querySelector('body').removeChild(html);
            html = null;
        }
        // bind
        Minikit.Event.add(d.querySelector('.dialog#' + id + ' .dialog-button-ok'), 'click', ok);
        if (cancelable) {
            Minikit.Event.add(d.querySelector('.dialog#' + id + ' .dialog-button-cancel'), 'click', close);
        }
        Minikit.Event.add(html, 'click', overlayClick);
        Minikit.Event.add(d, 'keyup', handleKey);

       
    };

    // close 
    var closeModal = function (e) {
        var element = e.target.closest('.dialog');
        if (Minikit.isObj(element)) {
            e.preventDefault();
            element.classList.remove('active');
        }
    };
    
    // close when click on overlay only
    var closeModalOnOverlayClick = function (e) {
        var element = e.target.closest('.dialog-inner');
        if (!Minikit.isObj(element)) {
            e.target.classList.remove('active');
        }
    };
    var closeModalOnEscapeKey = function (e) {
        if (e.keyCode === 27) {
            Minikit.each(document.querySelectorAll('.dialog.closable.active'), function (element) {
                element.classList.remove('active');
            });
        }
    };
    var showModal = function (element) {
        var dialogTargetId = element.getAttribute('data-dialog-target'),
            dialogTarget = document.getElementById(dialogTargetId),
            targetTabId = element.getAttribute('data-dialog-tab'),
            targetTab = Minikit.isObj(targetTabId) ? document.getElementById(targetTabId) : false;

        // dialog tab
        if (Minikit.isObj(targetTab)) {

            // set selected tab
            Minikit.each(targetTab.closest('.tab-control').querySelectorAll(':scope > .tab'), function (el) {
                el.classList.remove('current');
            });
            targetTab.classList.add('current');

            // set selected nav tab
            Minikit.each(targetTab.closest('.tab-control').querySelectorAll(':scope > .tab-items > li > a'), function (el) {
                if (el.getAttribute('data-tab-target') === targetTabId) {
                    el.closest('li').classList.add('current');
                } else {
                    el.closest('li').classList.remove('current');
                }
            });
        }

        // dialog tab
        if (Minikit.isObj(dialogTarget)) {
            dialogTarget.classList.add('active');
        }
    };

    Minikit.ready(function () {
        Minikit.Event.add(d, 'keyup', closeModalOnEscapeKey);
        Minikit.each(document.querySelectorAll('.dialog.closable'), function (element) {
            Minikit.Event.add(element, 'click', closeModalOnOverlayClick);
        });
        Minikit.each(document.querySelectorAll('.dialog.closable .dialog-button-close'), function (element) {
            Minikit.Event.add(element, 'click', closeModal);
        });
        Minikit.each(document.querySelectorAll('.dialog.closable .dialog-button-cancel'), function (element) {
            Minikit.Event.add(element, 'click', closeModal);
        });
        Minikit.each(document.querySelectorAll('[data-dialog-target]'), function (element) {
            Minikit.Event.add(element, 'click', function (e) {
                e.preventDefault();
                showModal(element);
            });
        });
    });
    w.Minikit.dialog = dialog;
})(window, document);
