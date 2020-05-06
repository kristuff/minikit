/* kristuff.Minikit.Alerts */
(function (window, undefined) {
    'use strict';
    var Alerts = (function () {
        var create = function (content, args) {
            var getArg = function(obj, defaultValue){
                return (typeof obj === 'undefined') ? defaultValue : obj;
            };
            if (!args){
                args = {
                    type: 'info', 
                    elementType : 'div',
                    dissmissable: false 
                }
            }
            var tagName = getArg(args.elementType, 'DIV');
            var type = getArg(args.type, 'info');
            var dissmissable =  getArg(args.dissmissable , false);
            var el = document.createElement(tagName);
                el.classList.add('alert');
                el.setAttribute('data-alert', type);
                if (dissmissable === true) {
                    el.innerHTML += '<button type="button" class="alert-close"><i class="fa fa-times"></i></button>';
                }
                el.innerHTML += content;
            
            return el;
        };
        var handleDocumentClick = function (e) {
            var element = e.target.tagName === 'I' ? e.target.parentNode : e.target;
            if (element.tagName === 'BUTTON' && element.classList.contains('alert-close')) {
                //event//TODO
                element.parentNode.parentNode.removeChild(element.parentNode);
                var evt = new CustomEvent('alertClosed', { detail: { id: null, todo: null} });
                document.dispatchEvent(evt);
            };
        };
        var add = function (parent, content, args) {
            var realparent = Minikit.isObj(parent) ? parent : document.body;
            var alert = create(content, args);
            realparent.appendChild(alert);
        };
        Minikit.ready(function () {
            Minikit.Event.add(document.body, 'click', handleDocumentClick);
        });
        return {
            create: create,
            add: add
        };
    })();
    window.Minikit.Alerts = Alerts;
})(window);
