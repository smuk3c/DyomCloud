define(['jquery', 'app', "facebook", "twitter", "jqueryVisible", 'bootstrap', 'datePicker', 'slick'], function ($, app, FB, twttr) {

// === DIRECTIVES OBJECT
    var directives = {};

    directives.preventDef = [function(){
        return function(scope, element, attrs) {
            element.bind("click", function(event) {
                event.preventDefault();
            });
        };
    }];

    directives.popOver = [function(){
        return function(scope, element, attrs) {
            $(element).popover({
                title: attrs.title,
                content: attrs.content,
                trigger: attrs.trigger,
                placement: attrs.placement
            })
        };
    }];

    directives.ngCalendar = [function(){
        return function(scope, element, attrs) {
            $(element).datepicker({
                startview: attrs.view,
                format: 'mm/dd/yyyy',
                autoclose: true
            })
        };
    }];

    directives.ngCurrency = ['$filter', function($filter){
        return function(scope, element, attrs) {
            element.bind("keypress", function(e) {
                if (e.which != 8 && e.which != 36 && e.which != 46 && e.which != 44 && e.which != 0 && (e.which < 48 || e.which > 57))
                    return false;
            });

            element.bind("change input", function(){
                if($(element).val().length>1)
                    $(element).val($filter('noFractionCurrency')($(element).val().replace(/\$|,/g,'')));
                else if($(element).val().length<2)
                    $(element).val("$"+$(element).val().replace(/\$|,/g,''));
            });

        };
    }];

    directives.ngPhone = ['$filter', function($filter){
        return function(scope, element, attrs) {
            element.bind("keypress", function(e) {
                if (e.which != 8 && e.which != 36 && e.which != 46 && e.which != 44 && e.which != 0 && (e.which < 48 || e.which > 57))
                    return false;

                if($(element).val().length==0)
                    $(element).val("("+$(element).val());

                if($(element).val().length==4)
                    $(element).val($(element).val()+") ");

                if($(element).val().length==9)
                    $(element).val($(element).val()+"-");

                if($(element).val().length>=14)
                    return false;

            });

        };
    }];

    directives.ngMls = ['$filter', function($filter){
        return function(scope, element, attrs) {

            element.bind("keypress", function(e) {

//                if($(element).val().length>0 && $(element).val().length<6){
//                    if (e.which != 8 && e.which != 36 && e.which != 46 && e.which != 44 && e.which != 0 && (e.which < 48 || e.which > 57))
//                        return false;
//                }
//
//                if($(element).val().length==0){
//                    if(e.which < 97 /* a */ || e.which > 122 /* z */)
//                        return false;
//                }

                if($(element).val().length>7){
                        return false;
                }

            });

        };
    }];

    directives.ngSin = ['$filter', function($filter){
        return function(scope, element, attrs) {
            element.bind("keypress", function(e) {
                if (e.which != 8 && e.which != 36 && e.which != 46 && e.which != 44 && e.which != 0 && (e.which < 48 || e.which > 57))
                    return false;

                if($(element).val().length>=11)
                    return false;

                if($(element).val().length==3)
                    $(element).val($(element).val()+"-");

                if($(element).val().length==7)
                    $(element).val($(element).val()+"-");
            });

        };
    }];

    directives.ngPercentage = [function(){
        return function(scope, element, attrs) {

            element.bind("keypress", function(e) {
                if (e.which != 8 && e.which != 36 && e.which != 46 && e.which != 44 && e.which != 0 && (e.which < 48 || e.which > 57))
                    return false;

                if($(element).val().length==8)
                    return false;
            });

            element.bind("keydown", function(e) {
                var key = event.keyCode || event.charCode;

                if( key == 8 || key == 46 )
                    element.val(element.val().substring(0, element.val().length-1));
            });

            element.bind("change input", function(){

                var strLength= $(element).val().length;
                if(strLength>1)
                    $(element).val($(element).val().replace(/%/g,'')+"%");
                else if(strLength<2)
                    $(element).val($(element).val().replace(/%/g,'')+"%");
            });

        };
    }];

    directives.scrollAnimate = [function(){
        return function(scope, element, attrs) {
            $(window).scroll(function() {
               if($(element).visible(true))
                    element.addClass(attrs.scrollAnimate);
            });
        };
    }];

    directives.navCheck = [function(){
        return function(scope, element, attrs) {
            $(window).scroll(function() {
                if($(window).scrollTop()>30)
                    element.addClass("nav-scrolled");
                else
                    element.removeClass("nav-scrolled");
            });
        };
    }];

    directives.ngFixedbox = [function(){
        return function(scope, element, attrs) {
            $(window).scroll(function() {
                if($(window).scrollTop()>100) {
                    element.addClass("fixedBox");
                    element.css("top", $(window).scrollTop()-82);
                }
                else
                    element.removeClass("fixedBox");
            });
        };
    }];

    directives.ngNav = [function() {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: 'resources/views/nav.html'
        }
    }];

    directives.ngFoot = [function() {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: 'resources/views/foot.html'
        }
    }];

    directives.ngScrolling = [function(){
        return function (scope, element) {
            $(element).slick({
                infinite: true,
                speed: 1500,
                slidesToShow: 5,
                slidesToScroll: 2,
                autoplay: true,
                autoplaySpeed: 1,
                dots: false,
                arrows: false,
                centerMode: true,
                variableWidth: true,
                adaptiveHeight: true
            });
        }
    }];

    directives.ngTyping = ['$timeout', function($timeout) {
        return function (scope, element, attr) {

            var typing = attr.ngTyping.split("");

            if(element.text().length < typing.length)
                $timeout(addType, 2000);

            function addType(){
                element.text(element.text()+typing[element.text().length]);

                if(element.text().length < typing.length)
                    $timeout(addType, 100);
                else
                    scope.finished = true;
            }

        }
    }];

    directives.ngLike = ['$timeout', function($timeout){
        return function($scope, element, attr){
            var start = function(){
                var html = '<div class="fb-like" data-href="https://fbappsi.com/dyom/" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>';
                $(element).html(html)
                FB.XFBML.parse(element.parent()[0]);
            };

            $timeout(start,1000);
        };
    }];

    directives.twitter = ['$timeout', function($timeout){
        return {
            link: function(scope, element, attr) {
                var start =  function() {
                    twttr.widgets.createShareButton(
                        attr.url,
                        element[0],
                        function(el) {}, {
                            count: 'none',
                            text: attr.text
                        }
                    );
                };

                $timeout(start,1000);
            }
        }
    }];


// ==== REGISTER DIRECTIVES IN ANGULAJRS APP
    app.directive(directives);

});