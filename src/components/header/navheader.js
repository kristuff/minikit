/* Kristuff.Minikit.Headers */
(function (window, undefined) {
    'use strict';
    
    // open / close nav on mobile/tab
    var initMobileHeaders = function () {
        var header,trigger, overlay;

        trigger = document.querySelector('.nav-trigger');
        overlay = document.querySelector('.overlay');
                      
        if (Minikit.isObj(trigger)) {
                
                // get header
                header = trigger.closest('header');

                // close menu 
                var closeMenu = function () {
                    header.classList.remove('nav-open');
                };

                // open/close primary navigation on mobile
                Minikit.Event.add(trigger, 'click', function (event) {
                    event.preventDefault();
                    header.classList.toggle('nav-open');
                });

                //on resize/scroll, click overlay => close menu
                Minikit.Event.add(window, 'resize', Minikit.throttle(closeMenu, 50));
                Minikit.Event.add(window, 'scroll', Minikit.throttle(closeMenu, 50));
                Minikit.Event.add(overlay, 'click', closeMenu);
        }
    };

    // child navigation
    var initNavHasChild = function () {
        var mainHeader = document.querySelector('.main-header');
        if (Minikit.isObj(mainHeader)){
                //click on item and show submenu
                Minikit.each(mainHeader.querySelectorAll('.main-header .has-children > a'), function (element) {
                    Minikit.Event.add(element, 'click', function (event) {
                        event.preventDefault();

                        // if element is selected, deselect it and go
                        if (element.closest('li').classList.contains('selected')) {
                            element.closest('li').classList.remove('selected');
                            return;
                        }

                        // deselect other elements, except parent ??
                        Minikit.each(mainHeader.querySelectorAll('.main-header .has-children.selected'), function (childElement) {
                            if (! childElement.contains(element)){
                                childElement.classList.remove('selected');
                            }
                        });

                        // make item selected
                        element.closest('li').classList.add('selected');
                    });
                });
                
                Minikit.Event.add(document, 'click', function (event) {
                    if (!(event.target).matches('.has-children a')) {
                        Minikit.each(document.querySelectorAll('.main-header .has-children.selected'), function (element) {
                            element.classList.remove('selected');
                        });
                        //accountInfo.classList.remove('selected');
                    }
                });
        }
    };

    // auto fixed header
    var initAutoFixHeaders = function () {
        var mainHeader = document.querySelector('.main-header.auto-fix');
        if (!Minikit.isObj(mainHeader)) return;

            //set scrolling variables
            var scrolling = false,
		        currentTop = 0,
		        scrollOffsetVisible = 350,
		        scrollOffsetFixed = 250,
		        headerHeight = mainHeader.clientHeight;

            //on window scrolling - fix sidebar nav
            Minikit.Event.add(window, 'scroll', function () {
                if (!scrolling) {
                    scrolling = true;
                   // (!window.requestAnimationFrame) ?
				         setTimeout(autoFixHeader, 20); //
				     //   : requestAnimationFrame(autoFixHeader);
                }
            });

            function autoFixHeader() {
                var currentTop = Minikit.Scroll.top();
                if (currentTop > scrollOffsetFixed) {
                    mainHeader.classList.add('fixed');

                     if (currentTop > scrollOffsetVisible) {
                        mainHeader.classList.add('slide-down');
                    } else {
                        mainHeader.classList.remove('slide-down');
                    }
                } else {
                    mainHeader.classList.remove('fixed');
                }
                scrolling = false;
            }

    };

    // todo
    var initAutoHideHeaders = function () {
        var mainHeader = document.querySelector('.main-header.auto-hide'),
		    secondaryNavigation = document.querySelector('.secondary-nav'),
            //this applies only if secondary nav is below intro section .sub-nav-hero
		    belowNavHeroContent = document.querySelector('.hero + .secondary-nav + .main-content');

            if (!Minikit.isObj(mainHeader)) return;

            //set scrolling variables
            var scrolling = false,
		        previousTop = 0,
		        currentTop = 0,
		        scrollDelta = 10,
		        scrollOffset = 150,
		        headerHeight = mainHeader.clientHeight;


            //on window scrolling - fix sidebar nav
            Minikit.Event.add(window, 'scroll', Minikit.throttle(autoHideHeader, 20));
            Minikit.Event.add(window, 'resize', function () {
                headerHeight = mainHeader.clientHeight;
            });

            function autoHideHeader() {
                var currentTop = Minikit.Scroll.top();
                if (previousTop !== currentTop) {
                    (Minikit.isObj(belowNavHeroContent))
			            ? checkStickyNavigation(currentTop) // secondary navigation below intro
			            : checkSimpleNavigation(currentTop);

                    previousTop = currentTop;
                    scrolling = false;
                }
            }

            function checkSimpleNavigation(currentTop) {
                //there's no secondary nav or secondary nav is below primary nav
                if (previousTop - currentTop > scrollDelta) {
                    //if scrolling up...
                    mainHeader.classList.remove('is-hidden');
                } else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
                    //if scrolling down...
                    mainHeader.classList.add('is-hidden');
                }
            }
            function checkStickyNavigation(currentTop) {
                var style = window.getComputedStyle(belowNavHeroContent),
                    secondaryNavCurrentlyFixed = secondaryNavigation.classList.contains('fixed'),
                    secondaryNavFixed = currentTop > belowNavHeroContent.offsetTop - mainHeader.clientHeight - (secondaryNavCurrentlyFixed ? 0 : secondaryNavigation.clientHeight),
                    primaryNavVisible = previousTop >= currentTop || currentTop < belowNavHeroContent.offsetTop - secondaryNavigation.clientHeight + scrollDelta;


                if (primaryNavVisible) {
                    mainHeader.classList.remove('is-hidden');
                    secondaryNavigation.classList.remove('slide-up');
                } else {
                    mainHeader.classList.add('is-hidden');
                    secondaryNavigation.classList.add('slide-up');
                }

                if (secondaryNavFixed) {
                    belowNavHeroContent.classList.add('secondary-nav-fixed');
                    secondaryNavigation.classList.add('fixed');
                } else {
                    secondaryNavigation.classList.remove('fixed');
                    belowNavHeroContent.classList.remove('secondary-nav-fixed');
                }
        }
    };

    Minikit.ready(function () {
        initMobileHeaders();
        initNavHasChild();
        initAutoFixHeaders();
        // initAutoFixedHeader();
        initAutoHideHeaders();
    });

})(window);
