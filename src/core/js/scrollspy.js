/*! Kristuff.Minikit.Scrollspy */
(function (w, d, undefined) {
    'use strict';
  
    var scrollspy = function(){

        var sectionCollection = document.querySelectorAll(".scrollspy-section");
        if (sectionCollection.length === 0) return;

        var sections = {};
        var i = 0;
    
        Array.prototype.forEach.call(sectionCollection, function(el) {
            
            sections[el.id] = el.offsetTop - parseInt(Minikit.getAttr(el,'data-scrollspy-offset', 0), 10);
        });
        
       
       var onScroll = function(e){
          var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    
            for (i in sections) {
                if (sections[i] <= scrollPosition) {

                    Minikit.each(document.querySelectorAll('.active.scrollspy-link'), function(element){
                        element.classList.remove('active');
                        element.classList.remove('scrollspy-link');
                    });
                    Minikit.each(document.querySelectorAll('a[href*=' + i + ']'), function (element){
                        element.classList.add('active')
                        element.classList.add('scrollspy-link');
                    });
                }
            }
        };

        w.addEventListener('scroll', Minikit.throttle(function (e) {
            onScroll(e);
        }, 50));

    };

    Minikit.ready(function () {
        scrollspy();
    });

})(window, document);
