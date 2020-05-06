/* Kristuff.Minikit.Table*/
(function (window, undefined) {
    'use strict';

    var table = function (elmt) {
        var html = elmt;

        var bind = function () {
            Minikit.each(document.querySelectorAll('table.table-selection'), function (el) {
                enableSelection(el);
            });
            Minikit.each(document.querySelectorAll('table.table-activation'), function (el) {
                enableActivation(el);
            });
        
            Minikit.each(document.querySelectorAll('.action-table-select'), function (el, i) {
                Minikit.Event.add(el, "click", function (e) {
                    e.preventDefault();
                    var tableid = el.getAttribute("data-table-select-id");
                    var elmt = (el.parentNode.tagName === 'LI') ? el.parentNode : el;
                    if (elmt.getAttribute('data-select-state') === 'on') {
                        elmt.setAttribute('data-select-state', 'off');
                        document.querySelector('#' + tableid).classList.remove('select');
                    } else {
                        elmt.setAttribute('data-select-state', 'on');
                        document.querySelector('#' + tableid).classList.add('select');
                    }
                });
            });
        };

        var enableSelection = function() {
            // header => toggle state in full table
            Minikit.Event.add(html.querySelector('th[data-column="Select"] .checkbox'), 'click', function (e) {
                var currentState = e.target.getAttribute('data-checked');
                var newState = (currentState === 'true') ? 'false' : 'true';
                e.target.setAttribute('data-checked', newState);
                Array.prototype.forEach.call(html.querySelectorAll('tbody tr'), function (elmt, i) {
                    elmt.setAttribute('data-select-state', newState);
                });
                onSelectionChanged();
            });

            // normal rows
            Minikit.Event.add(html.querySelector('tBody'), 'click', function (e) {
                var tdElmt = e.target.closest('TD');
                if (Minikit.isObj(tdElmt) && tdElmt.getAttribute('data-column') === 'Select') {
                    var elmt = e.target.closest('TR');
                    var currentState = elmt.getAttribute('data-select-state');
                    var newState = (currentState === 'true') ? 'false' : 'true';
                    elmt.setAttribute('data-select-state', newState);
                    onSelectionChanged();
                    //e.stopPropagation();
                }
            });
        };

        var enableActivation = function () {
            Minikit.Event.add(html.querySelector('tBody'), 'click', function (e) {
                if (this.html.classList.contains('select')) {
                    return;
                }
                if (e.target.tagName === 'DIV') {
                    return;
                }
                var elmt = e.target.closest('TR');
                if (Minikit.isObj(elmt)) {
                    Array.prototype.forEach.call(html.querySelectorAll('tbody tr'), function (eltr, i) {
                        if (eltr !== elmt) { eltr.setAttribute('data-active-state', 'false'); }
                    });
                    var currentState = elmt.getAttribute('data-active-state');
                    var newState = (currentState === 'true') ? 'false' : 'true';
                    elmt.setAttribute('data-active-state', newState);
                }
            });
        };


        var onSelectionChanged = function () {
            var nb = html.querySelectorAll('tr[data-select-state="true"]').length;
            var evt = new CustomEvent('selectionChanged', { detail: { selectionLength: nb} });
            this.html.dispatchEvent(evt);
        };


        var getSelectionNumber = function () {
            var nb = html.querySelectorAll('tr[data-select-state="true"]').length;
            return nb;
        };

        var getSelectedItems =  function () {
            var elmts = html.querySelectorAll('tr[data-select-state="true"]');
            return elmts;
        };

        /* Public methods */
        return {
            bind: bind,
            enableSelection: enableSelection,
            enableActivation: enableActivation,
            onSelectionChanged: onSelectionChanged,
            getSelectedItems: getSelectedItems,
            getSelectionNumber: getSelectionNumber
        };
    };

    window.Minikit.Table = table;

})(window);