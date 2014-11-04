var mainUrl = "//dyom.parseapp.com/";
require.config({
    urlArgs: "vol=" +  (new Date()).getTime(),
    paths: {
        jquery: mainUrl+'resources/lib/js/jquery/jquery.min',
        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js',
        jqueryVisible: mainUrl+'resources/lib/js/jquery/jquery.visible.min',
        bootstrap: mainUrl+'resources/lib/js/bootstrap/bootstrap.min',
        facebook: 'https://connect.facebook.net/en_US/sdk',
        twitter: 'https://platform.twitter.com/widgets',
        angular: mainUrl+'resources/lib/js/angularjs/angular.min',
        angularRoute: mainUrl+'resources/lib/js/angularjs/angular-route.min',
        angularResource: mainUrl+'resources/lib/js/angularjs/angular-resource.min',
        angularAnimate: mainUrl+'resources/lib/js/angularjs/angular-animate.min',
        angularSanitate: mainUrl+'resources/lib/js/angularjs/angular-sanitize.min',
        angularTouch: mainUrl+'resources/lib/js/angularjs/angular-touch.min',
        datePicker: mainUrl+'resources/lib/js/bootstrap/bootstrap-datepicker',
        parse: mainUrl+'resources/lib/js/parse-1.2.19.min'
    },
    baseUrl: 'resources/js/',
    shim: {
        'jquery': { exports: 'jQuery' },
        'jqueryui': { exports: 'jQuery' },
        'jqueryVisible': { exports: 'visible' , deps: ['jquery']},
        'bootstrap': { exports: 'bootstrap', deps: ['jquery'] },
        'facebook' : { exports: 'FB'},
        'twitter' : { exports: 'twttr'},
        'angular': { exports: 'angular' },
        'angularRoute': { exports: 'ngRoute',  deps: ['angular'] },
        'angularResource': {exports: 'ngResource', deps: ['angular'] },
        'angularAnimate': {exports: 'ngAnimate', deps: ['angular'] },
        'angularSanitate': {exports: 'ngSanitize',  deps: ['angular'] },
        'angularTouch': {exports: 'ngTouch',  deps: ['angular'] },
        'datePicker': {deps: ['angular', 'bootstrap'] },
        'parse': { exports: 'Parse' }
    },
    priority: [
        'jquery',
        'angular',
        'parse'
    ]
});

require(['jquery', 'angular', 'fb', 'pars', 'twitter', 'routes', 'conf', 'controllers/controllers', 'services/services', 'directives/directives', 'filters/filters'], function ($, angular, FB, Parse, twttr) {
    $(function () {
        angular.bootstrap(document, ['app']);
    });
});