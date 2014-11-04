define(['app','parse','services/services'], function (app, Parse) {
    return app.run(['$rootScope', '$location', 'User', 'Mortage',  function ($rootScope, $location, User, Mortage) {

        var Rates = Parse.Object.extend("rates");
        var query = new Parse.Query(Rates);
        query.find({
            success: function(objects) {
                for(var i=0; i<objects.length; i++){
                    var obj = objects[i];
                    Mortage.setRebate(obj.get("years"), obj.get("rate"));

                    if(obj.get("years") == 5)
                      Mortage.set("variable", obj.get("variableRate"))
                }
            }
        });

        $rootScope.sessionUser = User.current();

        $rootScope.$on("$routeChangeStart", function (event, next, current) {

           if (next.authenticate && $rootScope.sessionUser==null || (next.authenticate && $rootScope.sessionUser!=null && !$rootScope.sessionUser.has("isAdmin") && !$rootScope.sessionUser.get("isAdmin")) )
               $location.path('/login');

        });

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });

    }]);
});