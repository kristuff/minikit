/*! Kristuff.Minikit.parallax */
(function (w, d, undefined) {
    'use strict';
  
    var parallax = (function(){
        var setParallax = function() {
            var scrolled = window.pageYOffset;

            Minikit.each(d.querySelectorAll('.parallax-bg'), function (parallaxElement) {
                var speed = Minikit.getAttr(parallaxElement,'data-parallax-speed',0.2);
                var coords = (scrolled * speed) + 'px';
                parallaxElement.style.backgroundPositionY = coords;
                parallaxElement.style.backgroundAttachment = 'unset';
            });
        };
        
        Minikit.ready(function () {
            w.addEventListener('scroll', Minikit.throttle(setParallax, 15));
        });
    })();

})(window, document);