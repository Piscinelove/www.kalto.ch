'use strict';

// core module
var Ottavio = (function(){
    var
        events = [],
        isMobile = { //  mobile detection utility
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        },
        init = function() {
            for (var e in events){
                events[e]();
            }
        },
        refresh = function() {
           $(window).trigger('debouncedresize.slitslider').trigger('resize');
        };
    return {
        events: events,
        isMobile: isMobile,
        init: init,
        refresh: refresh
    };
})();
// end core module


// slitslider module
Ottavio.slider = (function(){
    var $navArrows = $('#nav-arrows'),
        $nav = $('#nav-dots > span'),
        $obj  = $('#slider'),
        slitslider = $obj.slitslider({
            onBeforeChange: function(slide, pos) {
                $nav.removeClass('nav-dot-current');
                $nav.eq(pos).addClass('nav-dot-current');
            }
        }),
        init = function() {
            initEvents();
        },
        initEvents = function() {
            // add navigation events
            $navArrows.children(':last').on('click', function() {
                slitslider.next();
                return false;
            });
            $navArrows.children(':first').on('click', function() {
                slitslider.previous();
                return false;
            });
            $nav.each(function(i) {
                $(this).on('click', function() {
                    var $dot = $(this);
                    if (!slitslider.isActive()) {
                        $nav.removeClass('nav-dot-current');
                        $dot.addClass('nav-dot-current');
                    }
                    slitslider.jump(i + 1);
                    return false;
                });
            });
            // everything ready, show the container
            $obj.show();
        },
        refresh = function() {
           $(window).trigger('debouncedresize.slitslider').trigger('resize');
        };
    return {
        init: init,
        refresh: refresh
    };
})();
Ottavio.events.push(Ottavio.slider.init);
// end slitslider module


// search bar module
Ottavio.searchButton = function() {
    var h = '54px';
    if ($('.search_button').length) {
        $('.search_button').click(function(a) {
            a.preventDefault();
            if (0 === $('.h_search_form').height()) {
                $('.h_search_form input[type="text"]').focus();
                $('.h_search_form').stop().animate({
                    height: h
                }, 150);
            } else {
                $('.h_search_form').stop().animate({
                    height: '0'
                }, 150);
            }
            $(window).scroll(function() {
                if (0 !== $('.h_search_form').height()) {
                    $('.h_search_form').stop().animate({
                        height: '0'
                    }, 150);
                }
            });
            $('.h_search_close').click(function(a) {
                a.preventDefault();
                $('.h_search_form').stop().animate({
                    height: '0'
                }, 150);
            });
        });
    }
};
Ottavio.events.push(Ottavio.searchButton);
// end search bar module


// pie chart module
Ottavio.pieChart = function(obj){
    var time = 1500;
    $(obj).fadeIn('slow').easyPieChart({
        //barColor: '#1abc9c',
        barColor: $('.bg-primary').css('backgroundColor'),
        trackColor: false,
        scaleColor: false,
        scaleLength: 0,
        lineCap: 'square',
        lineWidth: 5,
        size: 160,
        animate: { duration: time, enabled: true },
        onStart: function(){
            $(obj).find('.counter').countTo({
                speed: time
            });
        }
    });
};
Ottavio.events.push(Ottavio.pieChart);
// end pie chart module

// slider control module
Ottavio.sliderControl = function(){
    var $obj = $('.filter_price');
    if ($obj.length > 0) {
        var $display = $obj.parent().find('.price_current');
        $obj.slider({
            tooltip:'hide'
        }).on('slide', function(slideEvt) {
            $display.text( slideEvt.value.join(' - ') );
        });
    }
};
Ottavio.events.push(Ottavio.sliderControl);
// end slider control module


// accordion icons module
Ottavio.accordionIcon = function(){
    var
        $target = $('div.panel-collapse'),
        toggleIcon = function(e){
            $(e.target)
                .prev('.accordion-heading')
                .find('.accordion-icon')
                .toggleClass('fa-minus fa-plus');
            };
    $target
        .on('hidden.bs.collapse', toggleIcon)
        .on('shown.bs.collapse', toggleIcon);
};
Ottavio.events.push(Ottavio.accordionIcon);
// end accordion icons module


// scroll effects module
Ottavio.scrollController = function() {
    var
        controller = new ScrollMagic(),
        windowHeight = $(window).innerHeight(),
        $mainNavigation = $('#main-navigation'),
        $onePageMenu = $('body'),
        $backToTop = $('#back_to_top'),
        $parallax = $('.parallax'),
        $fadingTitle = $('.fading-title'),
        $charts = $('#charts-wrapper'),
        $timer = $('#timer-wrapper');

    function getWindowHeight() {
        return windowHeight;
    }

    controller.scrollTo(function (newpos) {
        TweenMax.to(window, 0.8, {scrollTo: {y: newpos, autoKill:false}});
    });

    // adds 'opaque' class to navigation when scrolling down
    //if ($mainNavigation.length > 0) {
    //    new ScrollScene({ offset: $mainNavigation.height() })
    //        .setClassToggle($mainNavigation, 'opaque')
    //        .addTo(controller);
    //}

    // handles 'back to top' button
    if ($backToTop.length > 0) {
        var h = getWindowHeight();
        new ScrollScene({ offset: h/5 })
            .addTo(controller)
            .on('enter', function() {
                $backToTop.fadeIn('fast');
            })
            .on('leave', function() {
                $backToTop.fadeOut('slow');
            });
        $backToTop.click(function(e){
            // e.preventDefault();
            // controller.scrollTo(0);
        });
    }

    // navigation behaviour on one page layout
    if ($onePageMenu.length > 0) {
        $onePageMenu.find('a[href^=#]').each(function(){
            var
                _this = $(this),
                _target = _this.attr('href'),
                _duration = $(_target).outerHeight();

            // highlights the proper navigation link when the relevant area is in the viewport
            new ScrollScene({triggerElement: _target, triggerHook: 'onCenter', duration:_duration })
                .setClassToggle(_this.parent(), 'active')
                .addTo(controller);

            _this.click(function(e){
                if (_target.length > 0) {
                    e.preventDefault();

                    // smooth scrolling
                    controller.scrollTo(_target);

                    // if supported by the browser, handles the Back button
                    if (window.history && window.history.pushState) {
                        history.pushState('', document.title, _target);
                    }
                }
            });
        });
    }

    // parallax background
    if ($parallax.length > 0) {
        var testMobile = Ottavio.isMobile.any();
        if (testMobile === null) {
            $parallax.each(function(){
                var
                    _this = $(this),
                    _duration = _this.outerHeight() + getWindowHeight();
                    //bgPosMovement = 'center ' + (-Math.abs(_duration*0.35)) + 'px';
                _this.css({ backgroundSize:'110%'});
                new ScrollScene( {triggerElement: _this, duration: _duration, triggerHook: 'onEnter'} )
                    .setTween( TweenMax.to(_this, 1, {backgroundPosition:'100% 50%', ease: Linear.easeNone}) )
                    .addTo( controller );
            });
        }
    }

    // fades and shifts page title when scrolling down
    if ($fadingTitle.length > 0){
        $fadingTitle.each(function(){
            var
                _this = $(this),
                _element = _this.find('.section-title').first(),
                _duration = _this.outerHeight() + getWindowHeight(),
                offset = _duration*0.35,
                alpha = 1 / (_duration);

            new ScrollScene( {triggerElement: _this, duration: _duration, triggerHook: 'onLeave'} )
                .setTween( TweenMax.to(_element, 1, {marginTop: offset+'px', marginBottom: -Math.abs(offset)+'px', opacity:alpha}) )
                .addTo( controller );
        });
    }

    // start charts plotting when scrolled into view
    if ($charts.length > 0) {
        new ScrollScene( {triggerElement: $charts} )
            .addTo( controller )
            .on('enter', function() {
                Ottavio.pieChart('.chart');
            });
    }

    // start charts plotting when scrolled into view
    if ($timer.length > 0) {
        new ScrollScene( {triggerElement: $timer} )
            .addTo( controller )
            .on('enter', function() {
                $('.timer').countTo();
            });
    }

    // updates windowHeight on resize
    $(window).on('resize', function () {
        windowHeight = $(window).innerHeight();
    });
};
Ottavio.events.push(Ottavio.scrollController);
// end scroll effects module


// isotope module
Ottavio.isotope = function(){
  var
    $container = $('#isotope'),
    $filter = $('#filters'),
    instance = null,
    filter_value = $filter.find('.btn-primary').data('filter'),
    options = {
        itemSelector: '.item',
        layoutMode: 'masonry',
        masonry: null,
        filter: filter_value
    },
    calculateColumns = function(width) {
        var boxed = isBoxedLayout(),
            factor = 1;
        if (width > 435 && width < 723) {
            factor = 2;
        } else if(width > 722 && width < 1155) {
            factor = 3;
        } else if(width > 1154) {
            factor =  boxed ? 3 : 4;
        }
        //console.log(width+'/'+factor);
        return width/factor;
    },
    isBoxedLayout = function(){
        return $('body').hasClass('boxed-layout');
    },
    doFilter = function() {
        var
            _this  = $(this),
            _group = _this.parent(),
            value  = _this.attr('data-filter');
        instance.isotope({
            filter: value
        });
        _group.find('.btn-primary').removeClass('btn-primary');
        _this.addClass('btn-primary');
    };

    if ($container.length > 0) {
        if ($container.hasClass('portfolio-full')) {
            options.itemSelector = '.item-full';
            options.layoutMode = 'vertical';
        } else {
            options.masonry = {
                columnWidth: calculateColumns( $container.width() )
            };
        }
        if ($.fn.isotope !== undefined) {
            instance = $container.isotope(options);

            // layout Isotope again after all images have loaded
            instance.imagesLoaded( function() {
              instance.isotope('layout');
            });

            // bind filter button click
            if ($filter.length > 0){
                $filter.on('click', 'button', doFilter);
            }
            // re-arrange on window resize
            $(window).resize(function(){
                instance.isotope({
                    masonry: {
                        columnWidth: calculateColumns($container.width())
                    }
                });
            });
        } else {
            console.error('Isotope not available!');
        }
    }
};
Ottavio.events.push(Ottavio.isotope);
// end isotope module


// google maps module
Ottavio.gmaps = function(){
    var
        $elem = $('#map-canvas'),
        options = window.mapOptions || {},
        apiLoad = function() {
            $.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&callback=Ottavio.gmaps')
                //.done(function (script, textStatus) { })
                .fail(function (jqxhr) {
                    console.error('Could not load Google Maps: ' + jqxhr);
                });
        },
        initMap = function(){
            if ($.fn.gMap !== undefined) {
                $elem.gMap(options);
            } else {
                console.error('jQuery.gMap not available!');
            }
        };

    if (window.google && google.maps) {
        initMap();
    } else {
        apiLoad();
    }
    return {
        init: initMap
    };
};
Ottavio.events.push(Ottavio.gmaps);
// end google maps module



// Ajax portfolio module
Ottavio.portfolio = function(){
    var
        obj               = '#portfolio-gallery',
        $obj              = $(obj),
        hash              = '',
        url               = '',
        page              = '',
        wrapperHeight     = '',
        ajaxLoading       = false,
        pageRefresh       = true,
        content           = false,
        current           = '',
        next              = '',
        prev              = '',
        target            = '',
        scrollPosition    = '',
        projectIndex      = '',
        projectLength     = '',
        loadingError      = '<div class="alert alert-warning">content not available.</div>',
        portfolioGrid     = $('.portfolio', $obj),        
        projectContainer  = $('.ajax-content-inner', $obj),
        messageContainer  = $('.status-message', $obj),
        exitProject       = $('.closeProject', $obj),
        nextLink          = $('.nextProject', $obj),
        prevLink          = $('.prevProject', $obj),
        projectNav        = $('.project-navigation', $obj),
        easing            = 'easeOutExpo',
        folderName        = $obj.data('folder');

    $(window).bind( 'hashchange', function() {
        hash = $(window.location).attr('hash');
        var root = '#!'+ folderName +'/';
        var rootLength = root.length;

        if (hash.substr(0, rootLength) !== root){
            return;

        } else {
            var
                correction = 50,
                headerH = $('nav').outerHeight() + correction;

            hash = $(window.location).attr('hash');
            url = hash.replace(/[#\!]/g, '' );

            portfolioGrid.find('.item.current').removeClass('current' );

            /* url pasted in address bar (or page refresh) */
            if (pageRefresh === true && hash.substr(0, rootLength) === root) {
                $('html, body').stop().animate({ scrollTop: (projectContainer.offset().top-20)+'px'}, 800, easing, function(){
                    loadProject();
                });

                /* click on portfolio grid or project navigation */
            } else if(pageRefresh === false && hash.substr(0,rootLength) === root) {
                $('html,body').stop().animate({scrollTop: (projectContainer.offset().top-headerH)+'px'}, 800, easing, function(){
                    if (content === false) {
                        loadProject();
                    } else {
                        projectContainer.animate({opacity:0, height:wrapperHeight}, loadProject );
                    }
                    projectNav.fadeOut('100');
                    exitProject.fadeOut('100');
                });

                /* click on browser back button (no refresh)  */
            } else if (hash === '' && pageRefresh === false || hash.substr(0,rootLength) !== root && pageRefresh === false || hash.substr(0,rootLength) !== root && pageRefresh === true) {
                scrollPosition = hash;
                $('html, body').stop().animate({scrollTop: scrollPosition+'px'}, 1000, deleteProject );
            }

            /* add active class to selected project  */
            portfolioGrid.find('.item a[href="#!' + url + '"]' ).parents('li').addClass( 'current' );
        }
        return false;
    });

    function loadProject(){
        messageContainer.animate({
            opacity:0,
            height:'0px'
        }).empty();
        if (!ajaxLoading) {
            ajaxLoading = true;
            projectContainer.load( url + ' .ajaxpage', function(xhr, statusText){
                if (statusText === 'success') {
                    page =  $('.ajaxpage', obj);
                    $('.ajaxpage', obj).waitForImages(function() {                        
                        ajaxLoading = false;
                    });
                    $('.owl-carousel', $obj).owlCarousel();
                    projectNav.fadeIn();
                }
                if (statusText === 'error') {
                    projectContainer
                        .animate({
                            opacity:0,
                            height:'0px'
                        })
                        .empty();
                    messageContainer
                        .html( loadingError )
                        .animate( {
                            opacity: 1,
                            height: (messageContainer.find('.alert').outerHeight(true)+'px')
                        });                    
                    ajaxLoading = false;
                }
            });
        }
    }    

    function showProject(){
        if (content === false){
            wrapperHeight = projectContainer.children('.ajaxpage').outerHeight() + 'px';
            projectContainer.animate({opacity:1, height:wrapperHeight}, function(){
                scrollPosition = $('html, body').scrollTop();
                exitProject.fadeIn();
                content = true;
            });
        } else {
            wrapperHeight = projectContainer.children('.ajaxpage').outerHeight() + 'px';
            projectContainer.animate({opacity:1, height:wrapperHeight}, function(){
                scrollPosition = $('html, body').scrollTop();
                exitProject.fadeIn();
            });
        }

        projectIndex = portfolioGrid.find('.item.current').index();
        projectLength = $('.item', obj).length-1;

        if (projectIndex === projectLength) {
            nextLink.addClass('disabled');
            prevLink.removeClass('disabled');

        } else if (projectIndex === 0){
            nextLink.addClass('disabled');
            prevLink.removeClass('disabled');

        } else {
            nextLink.removeClass('disabled');
            prevLink.removeClass('disabled');
        }
    }

    function deleteProject(closeURL){
        projectNav.fadeOut(100);
        exitProject.fadeOut(100);
        projectContainer.animate({opacity:0, height:'0px'}).empty();
        messageContainer.animate({opacity:0, height:'0px'}).empty();

        if (typeof closeURL !== 'undefined' && closeURL !== '') {
            location.href = '#_';
        }
        portfolioGrid.find('.item.current').removeClass('current' );
    }

    /* link to next project */
    nextLink.on('click',function () {
        current = portfolioGrid.find('.item.current');
        next = current.next('.item');
        target = $(next).find('a.ajax_load').attr('href');
        $(this).attr('href', target);
        if (next.length === 0) {
            return false;
        }
        current.removeClass('current');
        next.addClass('current');
    });

    /* link to previous project */
    prevLink.on('click',function () {
        current = portfolioGrid.find('.item.current');
        prev = current.prev('.item');
        target = $(prev).find('a.ajax_load').attr('href');
        $(this).attr('href', target);
        if (prev.length === 0) {
            return false;
        }
        current.removeClass('current');
        prev.addClass('current');
    });

    /* close project */
    exitProject.on('click',function () {
        deleteProject( $(this).find('a').attr('href') );        
        return false;
    });

    // if passed in by the url, load the required portfolio detail
    $(window).trigger( 'hashchange' );

    pageRefresh = false;
};
Ottavio.events.push(Ottavio.portfolio);
// end Ajax portfolio module



// Contacts form module
Ottavio.contactForm = function(){
    var
        $form = $('#contactForm'),
        $msgSuccess = $('#successMessage'),
        $msgFailure = $('#failureMessage'),
        $msgIncomplete = $('#incompleteMessage'),
        messageDelay = 2000;

    $form.validate({
        invalidHandler: function(event, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                $msgIncomplete.show();
            } else {
                $msgIncomplete.fadeOut();
            }
        },
        submitHandler: function(form) {
            var
                _form = $(form),
                data = _form.serialize(),
                action = _form.attr('action');

            data += '&ajax=true';
            $msgIncomplete.fadeOut();
            _form.fadeOut();

            $.post(action, data)
                .done(function(response){
                    if (response === 'success'){
                        $msgSuccess.fadeIn().delay(messageDelay).fadeOut();
                        _form.trigger('reset');
                    } else {
                        $msgFailure.fadeIn().delay(messageDelay).fadeOut();
                    }
                })
                .fail(function() {
                    $msgFailure.fadeIn().delay(messageDelay).fadeOut();

                })
                .always(function(){
                    _form.delay(messageDelay+500).fadeIn();
                });
            return false;
        }
    });
};
Ottavio.events.push(Ottavio.contactForm);
// end Contacts form module



$(document).ready(function() {    
    mixpanel.init('38b71a2628028bb9a7d6f3ea80ae9038');
    $('#load').fadeOut().remove();        

    $(".learn-more").click(function() {
        $('html, body').animate({
            scrollTop: $("#features").offset().top
        }, "slow");
    });
    var cover = $($(".header-section")[(Math.floor((Math.random() * 4)))]);
    cover.removeClass("hidden");
    $("#f-" + cover.data('ref')).hide();

    mixpanel.track(
        "www-page_view",
        { "provider": cover.data('ref') }
    );
    // $(".btn").click(function(){
    //     mixpanel.track(
    //         "www-" + $(this).attr("mixpanel-name"),
    //         { "provider": $(this).attr("mixpanel-provider") }
    //     );
    // }); 
    $("#back_to_top").click(function(){
        mixpanel.track("www-video-click");
    });    

    if($('#circle-diagram').length) {
        circleDiagram('circle-diagram', 500, 500, '#circle-diagram-data');
    }

    $('.dropdown-menu input, .dropdown-menu label').click(function(e) {
        e.stopPropagation();
    });

    $('input, textarea').placeholder();

    // Start TouchSpin function
    $('input.qty').TouchSpin();

    // Start FitVids function
    $('body').fitVids();
    $('.background-video video').fillparent();

    // Swiper function
    $('.swiper-container').swiper({
        slidesPerView: 'auto'
    });

    var isScrolled = false;
    $(window).scroll(function() {
        if ($(window).scrollTop() > 30) {
            if (!isScrolled) {
                $('#main-navigation').addClass('opaque');
                $('#splash-carousel .owl-controls').fadeOut();
                    isScrolled = true;
            }
        }else{
            $('#main-navigation').removeClass('opaque');
            $('#splash-carousel .owl-controls').fadeIn();
            isScrolled = false;
        }
    });

    $('.learn-more-container').click(function() {
        $('html, body').animate({
            scrollTop: $("#benefits").offset().top
        }, "slow");
    });


    var getPageIndex = function (carousel) {
        var result;

        carousel.find('.owl-controls .owl-pagination .owl-page').each(function (idx, itm) {
            if ($(this).hasClass('active')){
                result = idx;
                return false
            }
        });

        return result;
    };

    var carousel = $('#splash-carousel');
    var pagecount = carousel.children().length;
    var currentpage = 1;
    var setTextForPage = function (page) {
        if ($('#splash-carousel').hasClass('mp')) return;

        var texts = {
            people: {
                big: 'Own your reputation &<br/>boost your sales by 70%',
                small: 'Don\'t start from scratch,<br/>claim your free eRated account',
                tiny: 'Trusted by 30,000+ sellers',
                mp_provider: 'splash_signup'
            },
            sell: {
                big: 'Get eRated certified &<br/>sell more online',
                small: 'Online sellers sell 150% more<br/>with eRated’s trust certificate',
                tiny: 'Trusted by 30,000+ sellers',
                mp_provider: 'splash_products_signup'
            },
            cars: {
                big: 'Get eRated certified &<br/>share more rides',
                small: 'Drivers get 90% more rides<br/>with eRated’s trust certificate',
                tiny: 'Trusted by thousands of drivers',
                mp_provider: 'splash_rides_signup'
            },
            house: {
                big: 'Get eRated certified &<br/>get more bookings',
                small: 'Home owners get 70% more bookings<br/>with eRated’s trust certificate',
                tiny: 'Trusted by 10,000+ hosts',
                mp_provider: 'splash_flats_signup'
            }
        };

        $('.splash-text .big-text').html(texts[page].big);
        $('.splash-text .small-text').html(texts[page].small);
        $('.splash-text .tiny-text').html(texts[page].tiny);
        $('.splash-text #start-now-link').attr('mixpanel-provider', texts[page].mp_provider);
    };

    $('.splash-text').children().each(function () {
        $(this).css({ left: -100, opacity: 0 });
    });
    setTextForPage('people');

    carousel.owlCarousel({
        autoPlay : (carousel.hasClass('mp') ? false : 9000),
        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem: true,
        transitionStyle : "fade",
        touchDrag: false,
        afterInit: function () {
            setTimeout(function () {
                $('.splash-text').children().each(function (idx, itm) {
                    setTimeout(function () {
                        $(this).css({ left: 0, opacity: 1 });
                    }.bind(this), idx * 100);
                });
            }.bind(this), 1000);
        },
        beforeMove: function () {
            currentpage++;
            if (currentpage > pagecount) { currentpage = 1 }
            $('.splash-text').children().each(function () {
                $(this).css({ opacity: 0 });
                setTimeout(function () {
                    $(this).css({left: -100});

                    var pageindex = getPageIndex($('#splash-carousel'));
                    var page = $($('#splash-carousel img')[pageindex]).attr('class');

                    setTextForPage(page);
                }.bind(this), 900);
            });
        },
        afterMove: function (e) {
            setTimeout(function () {
                $('.splash-text').children().each(function (idx, itm) {
                    setTimeout(function () {
                        $(this).css({ left: 0, opacity: 1 });
                    }.bind(this), idx * 100);
                });
            }.bind(this), 1000);
        }
    });

    var partnericons = $('#widget .deskp .partner-icons-panel .partner-icon');
    var partnericonsmobile = $('#widget .mobile .partner-icons-panel .partner-icon');

    carousel = $('#partners-carousel');
    carousel.owlCarousel({
        autoPlay : 5000,
        navigation : true, // Show next and prev buttons
        slideSpeed : 600,
        paginationSpeed : 600,
        singleItem: true,
        stopOnHover: true,
        afterMove: function () {
            var pageindex = getPageIndex($('#partners-carousel'));

            $(partnericons).removeClass('active');
            $('#widget .mobile .partner-icons-panel .partner-icon').removeClass('active');
            $(partnericons[pageindex]).addClass('active');
            $(partnericonsmobile[pageindex]).addClass('active');
            partnercontrolscarousel.slick('slickGoTo', pageindex)
        }
    });

    var partnercontrolscarousel = $('.row.partner-icons-row.mobile .partner-icons-panel');
    partnercontrolscarousel.slick({
        centerMode: true,
        centerPadding: '20px',
        slidesToShow: 5,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 3
                }
            }
        ]
    });



    $(partnericons).click(function (e) {
        $(partnericons).removeClass('active');
        $(e.target).addClass('active');

        partnericons.each(function (idx, itm) {
            if ($(this).hasClass('active')) {
                $('#partners-carousel').trigger('owl.goTo', idx);
                return false
            }
        });
    });
    $(partnericonsmobile).click(function (e) {
        $(partnericonsmobile).removeClass('active');
        $(e.target).addClass('active');

        partnericonsmobile.each(function (idx, itm) {
            if ($(this).hasClass('active')) {
                $('#partners-carousel').trigger('owl.goTo', idx);
                return false
            }
        });
    });


    var setTextForProfilePage = function (profile) {
        var texts = {
            kathy: {
                image: 'img/assets/profiles/kathy.png',
                title: 'Kathy Simpson',
                subtitle: 'Founder and CEO at Kat\'s Boutique',
                text: '"Connecting with eRated.co is one of the smartest decisions I\'ve made for my business"',
                href: 'https://app.erated.co/#v/profile/p/katsimpson',
            },
            brendan: {
                image: 'img/assets/profiles/brendan.png',
                title: 'Brendan Candon',
                subtitle: 'Founder & CEO at SideLineSwap',
                text: '"As a marketplace founder, eRated adds a ton of value by enhancing trust within our community. Our sellers have seen amazing results"',
                href: 'https://app.erated.co/#v/profile/p/brendan-candon'
            },
            lisa:{
                image: 'img/assets/profiles/lisa.png',
                title: 'Lisa Bregman',
                subtitle: 'Lisa B.B Worldwide Consignments & Sales',
                text: '"Once I signed up onto your site my clients were thrilled and my sells have improved even greater then when I was a "Top Rated Seller"',
                href: 'https://app.erated.co/#v/profile/p/lisaandarthur'
            },
            casey_mp: {
                image: 'img/assets/profiles_mp/casey.png',
                title: 'Casey Casterline',
                subtitle: 'CEO at eDivv',
                text: '"Working with the eRated team has been fantastic.  Implementation was easy, design was natively integrated and it has helped the trust in eDivv\'s peer to peer marketplace."',
                href: '#marketplaces'
            },
            brendan_mp: {
                image: 'img/assets/profiles_mp/brendan.png',
                title: 'Brendan Candon',
                subtitle: 'Founder & CEO at SideLineSwap',
                text: '"As a marketplace founder, eRated adds a ton of value by enhancing trust within our community. Our sellers have seen amazing results"',
                href: '#marketplaces'
            },
            eduardo_mp:{
                image: 'img/assets/profiles_mp/eduardo.png',
                title: 'Eduardo Del Guerra Prota',
                subtitle: 'Global Co Founder at Tripda',
                text: '"Security is of paramount importance to our users and eRated gives us the authoritative, 3rd party trust-certification our riders need to feel comfortable"',
                href: '#marketplaces'
            }
        };

        var data = texts[profile];
        var holder = $('#profiles .right-side');

        holder.find('img').attr('src', data.image);
        holder.find('h4').text(data.title);
        holder.find('h5').text(data.subtitle);
        holder.find('p').text(data.text);
        holder.find('a').attr('href', data.href);
        holder.find('#check-out-profile-link').attr('mixpanel-provider', profile);
        holder.find('#request-demo-profile-link').attr('mixpanel-profile', profile);
    };


    carousel = $('#profiles-carousel');
    carousel.owlCarousel({
        autoPlay : 5000,
        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem: true,
        stopOnHover: true,
        afterMove: function () {
            var pageindex = getPageIndex(carousel);
            var profile = $($('#profiles-carousel img')[pageindex]).attr('class');
            var holder = $('#profiles .right-side');

            holder.fadeOut(50, function () {
                setTextForProfilePage(profile);
                holder.fadeIn(10);
            });
        }
    });

    $('.marketplaces-action-button.submit').click(function () {
        var originalText = $('.marketplaces-action-button.submit').text();


        $('.error-response').hide();

        if ($('.form-name').val() == '') {
            $('.error-response.name').fadeIn();
            return;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($('.form-email').val() == '' || !re.test($('.form-email').val())) {
            $('.error-response.email').fadeIn();
            return;
        }

        $('.marketplaces-action-button.submit').text('Sending...');

        $.when($.ajax({
            url:  '//app.erated.co/demo_request',
            type: 'POST',
            data: { name: $('.form-name').val(), email: $('.form-email').val() }
        })).then(function (response) {
            $('.marketplaces-action-button.submit').text('Thanks!');
        }).fail(function (response) {
            $('.marketplaces-action-button.submit').text('Error :(');
        }).always(function () {
            setTimeout(function () {
                $('.marketplaces-action-button.submit').text(originalText);
            }, 2500);
            $('.form-name').val('');
            $('.form-email').val('');
        });
    });

    var to = null;
    var src = $('#animated-gif').attr('src');
    //var img = $('<img src="' + src.replace('.gif', '.png') + '">');
    $('#how-it-works').bind('inview', function () {
        if (to) { clearTimeout(to) }

        $('#animated-gif').attr('src', '');
        $('#animated-gif').attr('src', src);
        to = setTimeout(function () {
            $('#animated-gif').attr('src', src.replace('.gif', '.png'));
        }, 12000);
    });

    // PrettyPhoto initialization
    $('a[data-rel]').each(function() {
        $(this).attr('rel', $(this).data('rel'));
    });

    // Start WOW animations
    if (!Ottavio.isMobile.iOS()) {
        new WOW().init();
    }

    // init Theme functions
    Ottavio.init();

    // $.ajax({
    //     type: "get",
    //     url: "//blog.erated.co/post-sitemap.xml",        
    //     success: function(data) {
    //         /* handle data here */
    //         alert(data);
    //     },
    //     error: function(xhr, status) {
    //         /* handle error here */
    //         $("#show_table").html(status);
    //     }
    // });
    
    $("#videoModal .fa-times").click(function(){
        $('#videoModal').modal('toggle');
        var source = $("#eratedVideo").attr('src');
        $("#eratedVideo").attr('src','');
        $("#eratedVideo").attr('src',source);
    });

}).on('click','.navbar-toggle',function() {
    // toggle navigation
    $('.navbar-collapse').toggleClass('in');

}).on('click','.navbar-collapse.in',function(e) {
    // close navigation on click
    if( $(e.target).is('a') ) {
        $('.navbar-collapse').toggleClass('in');
    }
});

$(window).resize(function () {
    if ($(window).width() > 768) {
        $('.collapse').removeClass('in');
    }
});
