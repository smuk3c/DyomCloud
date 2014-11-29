define([
    'angularRoute',
    'angularResource',
    'angularAnimate',
    'angularSanitate',
    'angularTouch'
], function () {
    return angular.module("app", [
        'ngRoute',
        'ngResource',
        'ngAnimate',
        'ngSanitize',
        'ngTouch'
    ]);
});