/*! kristuff.Minikit.Format*/
(function (window, undefined) {
    'use strict';
    var Format = (function () {
        
        var date = function (date, format, isTimestamp) {
            if (isTimestamp === true) date = new Date(date * 1000)
            var YYYY = date.getFullYear();
            var M = date.getMonth() + 1;
            var MM = M > 9 ? M : '0' + M;
            var D = date.getDate();
            var DD = D > 9 ? D : '0' + D;
            var h = date.getHours();
            var hh = h > 9 ? h : '0' + h;
            var m = date.getMinutes();
            var mm = m > 9 ? m : '0' + m;
            var s = date.getSeconds();
            var ss = s > 9 ? s : '0' + s;
            var str = format;
            str = replaceAll(str, '{YYYY}', YYYY);
            str = replaceAll(str, '{M}', M);
            str = replaceAll(str, '{MM}', MM);
            str = replaceAll(str, '{D}', D);
            str = replaceAll(str, '{DD}', DD);
            str = replaceAll(str, '{h}', h);
            str = replaceAll(str, '{hh}', hh);
            str = replaceAll(str, '{m}', m);
            str = replaceAll(str, '{mm}', mm);
            str = replaceAll(str, '{s}', s);
            str = replaceAll(str, '{ss}', ss);
            return str;
        };

        var time = function (secs, format) {
            var hr =  Math.floor(secs / 3600);
            var min = Math.floor((secs - (hr * 3600)) / 60);
            var sec = Math.floor(secs - (hr * 3600) - (min * 60));
            var HR = hr > 9 ? hr : '0' + hr;
            var MIN = min > 9 ? min : '0' + min;
            var SEC = sec > 9 ? sec : '0' + sec;
            var str = format;
            str = replaceAll(str, '{H}', HR);
            str = replaceAll(str, '{h}', hr);
            str = replaceAll(str, '{M}', MIN);
            str = replaceAll(str, '{m}', min);
            str = replaceAll(str, '{S}', SEC);
            str = replaceAll(str, '{s}', sec);
            return str;
        };

        var bytesReadable = function (bytes) {
            var i = -1;
            var byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
            do {
                bytes = bytes / 1024;
                i++;
            } while (bytes > 1024);
            return Math.max(bytes, 0.1).toFixed(1) + byteUnits[i];
        };
        
        var replaceAll = function (str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        };

        return {
            replaceAll: replaceAll,
            date: date,
            time: time,
            bytesReadable: bytesReadable
        };
    })();
    window.Minikit.Format = Format;
})(window);
