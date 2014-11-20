define(['app', 'controllers/controllers', 'services/services'], function (app) {
    return app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'resources/views/landing.html',
                    controller: 'LandingCtrl',
                    authenticate: false
                }).
                when('/apply-now', {
                    templateUrl: 'resources/views/application.html',
                    controller: 'ApplicationCtrl',
                    authenticate: false
                }).
                when('/login', {
                    templateUrl: 'resources/views/login.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                }).
                when('/admin', {
                    templateUrl: 'resources/views/admin.html',
                    controller: 'AdminCtrl',
                    authenticate: true
                }).
                when('/how-it-works', {
                    templateUrl: 'resources/views/works.html',
                    controller: 'StaticCtrl',
                    authenticate: false
                }).
                when('/about', {
                    templateUrl: 'resources/views/contact.html',
                    controller: 'StaticCtrl',
                    authenticate: false
                }).
                when('/application/:id', {
                    templateUrl: 'resources/views/applicationPrint.html',
                    controller: 'AdminAppCtrl',
                    authenticate: false
                }).
                when('/privacy', {
                    templateUrl: 'resources/views/privacy.html',
                    controller: 'StaticCtrl',
                    authenticate: false
                }).
                when('/become-partner', {
                    templateUrl: 'resources/views/becomePartner.html',
                    controller: 'StaticCtrl',
                    authenticate: false
                }).
                otherwise({
                    redirectTo: '/',
                    authenticate: false
                });
        }]);

});
