define(['jquery', 'app','parse','services/services'], function ($, app, Parse) {
    return app.run(['$rootScope', '$location', 'User', 'Mortage',  function ($rootScope, $location, User, Mortage) {

        $rootScope.sessionUser = User.current();
        $rootScope.userHandler = User;
        $rootScope.isRole = function(roleName){
//            User.checkAccess(roleName).then(function(rsp){
//                return rsp;
//            });
        };

        /* MAIN CTRL */
        $rootScope.isThis = function(id){
            return $location.path() == id;
        };

        $rootScope.next = function(val){
            $location.path("/"+val);
        };

        $rootScope.togleDrop3 = false;

        $rootScope.setMortage = function(attribute, value) {
            return Mortage.set(attribute, value);
        };

        $rootScope.getMortage = function(attribute) {
            return Mortage.get(attribute);
        };

        $rootScope.getRate = function(){
            return Mortage.getRate();
        };

        $rootScope.nav = false;

        $rootScope.togleNav = function(){
            $rootScope.nav = !$rootScope.nav;
        };

        $rootScope.isNavActive = function(){
            return $rootScope.nav === true;
        };


        $rootScope.pushSave = false;
        $rootScope.saveAppR = function(){
            $rootScope.pushSave = true;
        };

        $rootScope.autoSaving = false;
        $rootScope.isAppSavingR = function(){
            return $rootScope.autoSaving == true;
        };

        $rootScope.isSave = false;
        $rootScope.isSavedR = function(){
            return $rootScope.isSave === true;
        }

        $rootScope.isHow = false;
        $rootScope.isActiveHow = function(){
            return $rootScope.isHow === true;
        };
        $rootScope.setHow = function(){
            $rootScope.isHow =  !$rootScope.isHow;
        }

        /* #MAIN CTRL */
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

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
           $('html, body').scrollTop(0);
            $rootScope.togleDrop3 = false;

           if(next.authenticate){

               if($rootScope.sessionUser){

                   User.checkAccess(next.role).then(function(rsp){
                       if(!rsp)
                           $location.path("/");
                   });
               }
               else {
                   $location.path("/");
                   $("#login").modal("show");
               }


           }


        });


    }]);
});