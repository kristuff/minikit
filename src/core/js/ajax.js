/*! kristuff.Minikit.Ajax */
(function (window, undefined) {
    'use strict';
    var ajax = function (args) {
        var xhr = new XMLHttpRequest();

        xhr._previous_text = '';

        xhr.open(args.method, args.url, true);
        
        if (args.json === true){
             xhr.setRequestHeader('Content-type', 'application/json');
        } else if (args.method === 'POST'){
             xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        } else {
             xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        xhr.onerror = function () {
            Minikit.isFn(args.errorCallback, true);
        }
        if (Minikit.isFn(args.progressCallback) === true) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status > 101) && (args.callback !== null)) {
                        xhr._new_text = xhr.responseText.substring(xhr._previous_text.length);
                        args.callback(xhr);
                    } else {
                        if (args.errCallback !== null) {
                            args.errCallback(xhr);
                        }
                    }
                } else if ((xhr.readyState > 2) && (args.progressCallBack !== null)) {
                    xhr._new_text = xhr.responseText.substring(xhr._previous_text.length);
                    xhr._previous_text = xhr.responseText;
                    args.progressCallback(xhr);
                }

            };
        } else {
            xhr.onreadystatechange = function () {
                if ((xhr.readyState === 4) && (xhr.status > 101) && (Minikit.isFn(args.callback) === true)) {
                    args.callback(xhr);
                }
            };
        }
        if (Minikit.isFn(args.downloadProgress)) {
            xhr.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    args.downloadProgress(percentComplete);
                }
            }, false);
        }
        if (Minikit.isFn(args.uploadProgress)) {
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    args.uploadProgress(percentComplete);
                }
            }, false);
        }
        xhr.send(args.data);
    };
    window.Minikit.ajax = ajax;
})(window);
