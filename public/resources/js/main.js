'use strict';

require.config({
    urlArgs: "vol=" +  (new Date()).getTime(),
    paths: {
        jquery: 'libs/jquery/jquery.min',
        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js',
        jqueryVisible: 'libs/jquery/jquery.visible.min',
        bootstrap: 'libs/bootstrap/bootstrap.min',
        facebook: 'https://connect.facebook.net/en_US/sdk',
        twitter: 'https://platform.twitter.com/widgets',
        angular: 'libs/angularjs/angular.min',
        angularRoute: 'libs/angularjs/angular-route.min',
        angularResource: 'libs/angularjs/angular-resource.min',
        angularAnimate: 'libs/angularjs/angular-animate.min',
        angularSanitate: 'libs/angularjs/angular-sanitize.min',
        angularTouch: 'libs/angularjs/angular-touch.min',
        datePicker: 'libs/bootstrap/bootstrap-datepicker',
        parse: 'libs/parse.min',
        slick: 'libs/slick.min'
    },
    baseUrl: 'resources/js/',
    shim: {
        'jquery': { exports: 'jQuery' },
        'jqueryui': ['jquery'],
        'jqueryVisible': ['jquery'],
        'bootstrap': ['jquery'],
        'facebook' : { exports: 'FB'},
        'twitter' : { exports: 'twttr'},
        'angular': { exports: 'angular' },
        'angularRoute': ['angular'],
        'angularResource': ['angular'],
        'angularAnimate': ['angular'],
        'angularSanitate': ['angular'],
        'angularTouch': ['angular'],
        'datePicker': ['angular', 'bootstrap'],
        'parse': { exports: 'Parse' },
        'slick': { exports: 'slick' }
    },
    priority: [
        'jquery',
        'angular',
        'parse',
        'twitter',
        "facebook"
    ]
});

require([
    'jquery',
    'angular',
    'fb',
    'pars',
    'twitter',
    'app',
    'conf',
//    'constants',
    'routes',
    'controllers/controllers',
    'services/services',
    'directives/directives',
    'filters/filters'
], function ($, angular, FB, Parse, twttr) {

    $(function () {
        angular.bootstrap(document, ['app']);
    });

});