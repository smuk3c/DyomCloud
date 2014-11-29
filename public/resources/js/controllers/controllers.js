define(['jquery', 'app', 'parse', 'bootstrap'], function ($, app, Parse) {

// === CONTROLLERS OBJECT
var controllers = {};

    controllers.LandingCtrl = ['$rootScope', '$window', '$scope', '$timeout', '$filter', 'Mortage',  function($rootScope, $window, $scope, $timeout, $filter, Mortage){

        $scope.finished = false;
        $scope.isFinished = function(){
            return $scope.finished == true;
        }

        $scope.windowHeight = $window.innerHeight;
        $scope.amount =  Mortage.get("amount");

        $scope.$watch('amount', function(val) {
            if(val != "" && val != null){
                val = val.replace(/\$|,/g,'');

                if(val == "")
                    val = 0;

                Mortage.set("amount", parseFloat(val));
            }
        });

    }];

    controllers.AdminCtrl = ['$rootScope', '$scope', '$routeParams', 'Application',  function($rootScope, $scope, $routeParams, Application){

        $scope.offset = 0;
        $scope.limit = 5;
        $scope.count = 0;
        $scope.load = false;
        $scope.order = 1;

        $scope.isload = function(){
          return $scope.load == true;
        };

        $scope.remove = function ($index, $event) {
            $scope.applications.splice($index, 1);
        };

        $scope.getList = function(){
            $scope.load = true;
            Application.getList($scope.offset, $scope.limit, $scope.order).then(function(aApplications) {
                $scope.applications = aApplications;
                $scope.load = false;
            });
        };

        $scope.$watch("order", function(){
            $scope.load = true;
            Application.getList($scope.offset, $scope.limit, $scope.order).then(function(aApplications) {
                $scope.applications = aApplications;
                $scope.load = false;
            });
        });

        $scope.$watch("limit", function(){
            $scope.load = true;
            $scope.offset = 0;
            Application.getList($scope.offset, $scope.limit, $scope.order).then(function(aApplications) {
                $scope.applications = aApplications;
                $scope.load = false;
            });
        });

        $scope.$watch("offset", function(){
            $scope.load = true;
            Application.getList($scope.offset, $scope.limit, $scope.order).then(function(aApplications) {
                $scope.applications = aApplications;
                $scope.load = false;
            });
        });

        $scope.counting = function(){
            Application.count().then(function(count) {
                $scope.count = count;
            });
        };

        $scope.isPagination = function(){
            return $scope.count > $scope.limit;
        };

        $scope.increaseOffset = function(){
            $scope.offset = $scope.offset+1;
        };

        $scope.decreaseOffset = function(){
            $scope.offset = $scope.offset-1;
        };

        $scope.numPages = function () {
            $scope.pages =  Math.ceil($scope.count / $scope.limit);
            return new Array($scope.pages );
        };

        $scope.setOffset = function(i){
        $scope.offset = i;
        };

        $scope.application = {};
        $scope.assets = {};
        $scope.liabilities = {};

        $scope.isAppSel = false;

        init();
        function init(){
            $scope.counting();
            $scope.getList();

            if(typeof $routeParams.id != "undefined" && $routeParams.id!="") {
                Application.findById($routeParams.id).then(function(aApplications) {
                    $scope.application = aApplications;
                    $scope.assets = JSON.parse(aApplications.get('Assets'));
                    $scope.liabilities = JSON.parse(aApplications.get('Liabilities'));
                    $scope.isAppSel = true;
                });
            }
            else
                $scope.isAppSel = false;
        }

    }];

    controllers.ApplicationCtrl = ['$rootScope', '$scope', '$timeout', '$filter', 'Application', 'Mortage', 'User',  function($rootScope, $scope, $timeout, $filter, Application, Mortage, User){

        $scope.AppACL = new Parse.ACL();
        $scope.AppACL.setRoleReadAccess("Administrator", true);
        $scope.AppACL.setRoleReadAccess("Partner", true);
        $scope.AppACL.setRoleWriteAccess("Administrator", true);
        $scope.AppACL.setWriteAccess($rootScope.sessionUser, true);
        $scope.AppACL.setReadAccess($rootScope.sessionUser, true);

        $scope.liabilitiesVals = {
            "debts" : [
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ],
            "creditCards": [
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ],
            "owingautomobile":[
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ],
            "mortages":[
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ],
            "financeCompany":[
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ],
            "alimonyChild":[
                {
                    where: "",
                    description: "",
                    balance: ""
                }
            ]
        };
        $scope.assetsVals = {
            "cash" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "deposit" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "automobile" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "valueHome" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "stocks" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "rrsp": [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ],
            "otherAssets" : [
                {
                    where: "",
                    description: "",
                    val: ""
                }
            ]
        };
        $scope.assets = [];

        $rootScope.$watch("pushSave", function(){
            $scope.saveApp();
        });

        // END of user handling functions
        $scope.autoSaving = false;
        $scope.isAppSaving = function(){
          return $scope.autoSaving == true;
        };

        function saveApp (){
            $scope.saveApp();
        }

        $scope.isSave = false;
        $scope.isSaved = function(){
            return $scope.isSave === true;
        }

        $scope.saveApp = function(){
            if(!$scope.autoSaving){

                $scope.autoSaving = true;
                $scope.Application.Liabilities= JSON.stringify($scope.liabilitiesVals);
                $scope.Application.Assets = JSON.stringify($scope.assetsVals);

                $scope.Application.save(null, {
                    success: function(rsp) {
                        $scope.Application = rsp;
                        $scope.$apply(function(){
                            $scope.autoSaving = false;
                            $scope.isSave = true;
                            $rootScope.autoSaving = false;
                            $rootScope.isSave = true;
                            $rootScope.pushSave = false;
                        });
                    },
                    error: function(rsp, error) {
                        $scope.$apply(function(){
                            $scope.autoSaving = false;
                        });
                    }
                });

                setTimeout(saveApp, 40000);
            }
        };

        $scope.Application = new Application();
        $scope.Application.set("ACL", $scope.AppACL);

        $scope.Application.Application2 = false;
        $scope.Application.submited = false;

        var sub = {
            "cash" : "Cash",
            "deposit" : "Deposit",
            "automobile" : "Automobile",
            "valueHome" : "ValueHome",
            "stocks" : "Stocks",
            "rrsp": "RRSP",
            "otherAssets" : "OtherAssets",
            "debts" : "Debts",
            "creditCards": "CreditCards",
            "owingautomobile":"Owingautomobile",
            "mortages":"Mortages",
            "financeCompany":"FinanceCompany",
            "alimonyChild":"AlimonyChild"
        };

        $rootScope.$watch("sessionUser", function(val){
            if(val!=null){
                Application.findByUser(val).then(
                    function(App){
                        if(App) {
                            $scope.Application = App;

                            if(Mortage.get("change")==true && Mortage.get("amount")!=null){
                                $scope.Application.MortageRate = Mortage.getRate();

                                $scope.Application.MortageTerm =  Mortage.get("period");

                                $scope.Application.MortageType = Mortage.get("type");

                                $scope.Application.PurchasePrice = Mortage.get("amount");
                                $scope.Application.NewMortageValueRefinance =  Mortage.get("amount");
                                $scope.Application.ExistingMortageValue =  Mortage.get("amount");
                                $scope.Application.TotalFoundsRequired =  Mortage.get("amount");

                            }
                            else {
                                Mortage.set("amount",  $scope.Application.PurchasePrice);
                                Mortage.set("type",  $scope.Application.MortageType);
                                Mortage.set("period",  $scope.Application.MortageTerm);
                            }

                            if(!App.has("Personal1Email"))
                                $scope.Application.Personal1Email = $scope.sessionUser.get("email");

                            if(App.has("Liabilities")){
                                var _Liabilities = JSON.parse(App.Liabilities);
                                for (var key in _Liabilities) {
                                    $scope.liabilitiesVals[key] = _Liabilities[key];

                                    if(_Liabilities[key][0].balance!="")
                                        $scope.assets.push( sub[key]);
                                }

                            }

                            if(App.has("Assets")){
                                var _Assets = JSON.parse(App.Assets);

                                for (var key in _Assets) {
                                    $scope.assetsVals[key] = _Assets[key];

                                    if(_Assets[key][0].val!="")
                                        $scope.assets.push( sub[key]);

                                }
                            }
//

                            $scope.calculateMonthlyPayment();
                        }
                        else {
                            $scope.Application.user = val;
                            $scope.AppACL.setWriteAccess($rootScope.sessionUser, true);
                            $scope.AppACL.setReadAccess($rootScope.sessionUser, true);
                            $scope.Application.set("ACL", $scope.AppACL);
                        }
                    },
                    function(error){
                        $scope.Application.user = val;
                    }
                );

                setTimeout(saveApp, 40000);
            }
        });

        $scope.$watch("Application.MortageTerm", function(val){
            Mortage.setPeriod("period", val);
            $scope.Application.MortageRate = Mortage.getRate();
            $scope.calculateMonthlyPayment();
        });

        $scope.$watch("Application.MortagePurchaseDownPayment", function(val){
            $scope.calculateMonthlyPayment();
        });

        $scope.$watch("Application.MortageType", function(val){
            Mortage.setPeriod("type", val);

            if(val=="Variable") {
                Mortage.setPeriod("period", "5 Year Term");
                $scope.Application.MortageTerm = "5 Year Term";
            }

            $scope.Application.MortageRate = Mortage.getRate();
            $scope.calculateMonthlyPayment();
        });

        $scope.$watch("Application.MortageTerm", function(val){
            Mortage.setPeriod("period", val);

            if(val!="5 Year Term") {
                Mortage.setPeriod("type", "Fixed");
                $scope.Application.MortageType = "Fixed";
            }

            $scope.Application.MortageRate = Mortage.getRate();
            $scope.calculateMonthlyPayment();
        });

        $scope.$watch("Application.PurchaseDownPercent", function(val){
            if(val!=null && val!="other" && Mortage.get("amount")!=null) {
                $scope.Application.MortagePurchaseDownPayment = $filter('noFractionCurrency')( Mortage.get("amount").replace(/\$|,/g,'') * parseFloat(val) );
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.PurchasePrice", function(val){
            if(val!=null) {
                Mortage.set("amount", val.replace(/\$|,/g,''));

                $scope.Application.NewMortageValueRefinance =  val;
                $scope.Application.ExistingMortageValue =  val;
                $scope.Application.TotalFoundsRequired =  val;

                if($scope.Application.PurchaseDownPercent != 'other' && $scope.Application.PurchaseDownPercent!=""){
                    $scope.Application.MortagePurchaseDownPayment = $filter('noFractionCurrency')( Mortage.get("amount").replace(/\$|,/g,'') * parseFloat($scope.Application.PurchaseDownPercent) );
                }

                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.NewMortageValueRefinance", function(val){
            if(val!=null) {
                Mortage.set("amount", val.replace(/\$|,/g,''));

                $scope.Application.PurchasePrice =  val;
                $scope.Application.ExistingMortageValue =  val;
                $scope.Application.TotalFoundsRequired =  val;

                $scope.calculateMonthlyPayment();

            }
        });

        $scope.$watch("Application.ExistingMortageValue", function(val){
            if(val!=null) {
                Mortage.set("amount", val.replace(/\$|,/g,''));

                $scope.Application.NewMortageValueRefinance =  val;
                $scope.Application.PurchasePrice =  val;
                $scope.Application.TotalFoundsRequired =  val;
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.TotalFoundsRequired", function(val){
            if(val!=null) {
                Mortage.set("amount", val.replace(/\$|,/g,''));

                $scope.Application.NewMortageValueRefinance =  val;
                $scope.Application.ExistingMortageValue =  val;
                $scope.Application.PurchasePrice =  val;
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.MortageAmortization", function(val){
            if(val!=null) {
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.PaymentSchedule", function(val){
            if(val!=null) {
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.$watch("Application.MortagePurpose", function(val){
            if(val!=null) {
                $scope.calculateMonthlyPayment();
            }
        });

        $scope.Application.MortageRate = Mortage.getRate();
        $scope.Application.MortageTerm =  Mortage.get("period");
        $scope.Application.MortageType = Mortage.get("type");
        $scope.Application.MortagePaymentAmount = 0;
        $scope.Application.PaymentSchedule = "Monthly";

        $scope.Application.PurchasePrice = Mortage.get("amount");
        $scope.Application.NewMortageValueRefinance =  Mortage.get("amount");
        $scope.Application.ExistingMortageValue =  Mortage.get("amount");
        $scope.Application.TotalFoundsRequired =  Mortage.get("amount");

        $scope.calculateMonthlyPayment = function(){
            if($scope.Application.has('MortageAmortization') &&
                $scope.Application.has('MortageRate') &&
                $scope.Application.has('PurchasePrice')){


                    var a = $scope.Application.get('MortageAmortization').split(" "),
                        n = parseFloat(a[0]) * 12,
                        i = (parseFloat($scope.Application.get('MortageRate'))/12)/100,
                        p = 0;

                if($scope.Application.has('PurchasePrice') && $scope.Application.get('PurchasePrice').length>0)
                    p = parseFloat($scope.Application.get('PurchasePrice').replace(/\$|,/g,''));

                if( $scope.Application.get('MortagePurpose') == "Purchase" || $scope.Application.get('MortagePurpose') == "Pre-Approval")
                    p = p-parseFloat( $scope.Application.get('MortagePurchaseDownPayment').replace(/\$|,/g,'') );

                if( $scope.Application.get('PaymentSchedule') == "Bi-weekly") {
                        n = parseFloat(a[0]) * 26;
                        i = (parseFloat($scope.Application.get('MortageRate'))/26)/100;
                }

                    var payment = p * ( ( i * Math.pow( (i+1), n) ) / ( Math.pow( (i+1), n) - 1 ) );

                    $scope.Application.set('MortagePaymentAmount', payment);


            }
            else
                $scope.Application.set('MortagePaymentAmount', 0 );
        };

        $scope.steps = {
            1 : false,
            2 : false,
            3:  false,
            4:  false,
            5:  false,
            6:  false,
            7:  false,
            8:  false
        };

        $scope.isValidStep = function(ind){
            return $scope.steps[ind] === true;
        };

        $scope.$watchCollection("Application", function(){

                if($scope.Application.has("MortagePurpose") &&
                    $scope.Application.has("MortageType") &&
                    $scope.Application.has("MortageTerm") &&
                    $scope.Application.has("MortageRate") &&
                    $scope.Application.has("MortageAmortization") &&
                    $scope.Application.has("PaymentSchedule") &&
                    $scope.Application.get("MortagePurpose").length>0 &&
                    $scope.Application.get("MortageType").length>0 &&
                    $scope.Application.get("MortageTerm").length>0 &&
                    $scope.Application.get("MortageRate").length>0 &&
                    $scope.Application.get("MortageAmortization").length>0 &&
                    $scope.Application.get("PaymentSchedule").length>0) {

                    if($scope.Application.get("MortagePurpose") == 'Purchase' ||
                        $scope.Application.get("MortagePurpose") == 'Pre-Approval') {

                        if($scope.Application.has("PurchasePrice") &&
                        $scope.Application.has("MortagePurchaseDownPayment") &&
                            $scope.Application.get("PurchasePrice").length>0 &&
                            $scope.Application.get("MortagePurchaseDownPayment").length>0 &&
                            $scope.Application.get("ClosingDate").length>0){

                            if( ($scope.Application.get("MortageMLS")=="Y" && $scope.Application.has("MortageMLSNumber") && $scope.Application.get("MortageMLSNumber").length>0 ) || $scope.Application.get("MortageMLS")=="N") {
                                if(!$scope.steps[1]) {
                                    $scope.steps[1] = true;
//                                    $scope.progress = $scope.progress+20;
                                }
                            }
                            else {
                                if($scope.steps[1]) {
                                    $scope.steps[1] = false;
//                                    $scope.progress = $scope.progress-20;
                                }
                            }
                        }
                        else {
                            if($scope.steps[1]) {
                                $scope.steps[1] = false;
//                                $scope.progress = $scope.progress-20;
                            }
                        }

                    }

                    if($scope.Application.get("MortagePurpose") == 'Refinance'){

                        if($scope.Application.has("AppraisedValue") &&
                            $scope.Application.has("ExistingMortageValueRefinance") &&
                            $scope.Application.has("NewMortageValueRefinance") &&
                            $scope.Application.get("AppraisedValue").length>0 &&
                            $scope.Application.get("ExistingMortageValueRefinance").length>0 &&
                            $scope.Application.get("NewMortageValueRefinance").length>0){
                                if(!$scope.steps[1]) {
                                    $scope.steps[1] = true;
//                                    $scope.progress = $scope.progress+20;
                                }
                        }
                        else {
                            if($scope.steps[1]) {
                                $scope.steps[1] = false;
//                                $scope.progress = $scope.progress-20;
                            }
                        }

                    }

                    if($scope.Application.get("MortagePurpose") == 'Switch'){

                        if($scope.Application.has("AppraisedValue") &&
                            $scope.Application.has("ExistingMortageValue") &&
                            $scope.Application.has("MaturityDate") &&
                            $scope.Application.get("AppraisedValue").length>0 &&
                            $scope.Application.get("ExistingMortageValue").length>0 &&
                            $scope.Application.get("MaturityDate").length>0){
                            if(!$scope.steps[1]) {
                                $scope.steps[1] = true;
//                                $scope.progress = $scope.progress+20;
                            }
                        }
                        else {
                            if($scope.steps[1]) {
                                $scope.steps[1] = false;
//                                $scope.progress = $scope.progress-20;
                            }
                        }

                    }

                    if($scope.Application.get("MortagePurpose") == 'Construction'){
                        if($scope.Application.has("PurchasePriceConstruction") &&
                            $scope.Application.has("ApprovedPermits") &&
                            $scope.Application.has("ConstructionBudget") &&
                            $scope.Application.has("TotalFoundsRequired") &&
                            $scope.Application.get("PurchasePriceConstruction").length>0 &&
                            $scope.Application.get("ApprovedPermits").length>0 &&
                            $scope.Application.get("ConstructionBudget").length>0 &&
                            $scope.Application.get("TotalFoundsRequired").length>0){
                            if(!$scope.steps[1]) {
                                $scope.steps[1] = true;
//                                $scope.progress = $scope.progress+20;
                            }
                        }
                        else {
                            if($scope.steps[1]) {
                                $scope.steps[1] = false;
//                                $scope.progress = $scope.progress-20;
                            }
                        }
                    }

                }
                else {
                    if($scope.steps[1]) {
                        $scope.steps[1] = false;
//                        $scope.progress = $scope.progress-20;
                    }
                }

            if($scope.Application.has("Personal1Fname") &&
                $scope.Application.has("Personal1Lname") &&
                $scope.Application.has("Personal1SIN") &&
                $scope.Application.has("Personal1HomePhone") &&
                $scope.Application.has("Personal1Email") &&
                $scope.Application.get("Personal1Fname").length>0 &&
                $scope.Application.get("Personal1Lname").length>0 &&
                $scope.Application.get("Personal1SIN").length>0 &&
                $scope.Application.get("Personal1HomePhone").length>0 &&
                $scope.Application.get("Personal1Email").length>0){

                if(!$scope.steps[2]) {
                    $scope.steps[2] = true;
//                    $scope.progress = $scope.progress+20;
                }

            }
            else {
                if($scope.steps[2]) {
                    $scope.steps[2] = false;
//                    $scope.progress = $scope.progress-20;
                }
            }

            if($scope.Application.has("Personal1Street1") &&
                $scope.Application.has("Personal1City") &&
                $scope.Application.has("Personal1Province") &&
                $scope.Application.has("Personal1Postal") &&
                $scope.Application.has("Personal1ResidentalStatus") &&
                $scope.Application.get("Personal1Street1").length>0 &&
                $scope.Application.get("Personal1City").length>0 &&
                $scope.Application.get("Personal1Province").length>0 &&
                $scope.Application.get("Personal1Postal").length>0 &&
                $scope.Application.get("Personal1ResidentalStatus").length>0){

                if(!$scope.steps[3]) {
                    $scope.steps[3] = true;
//                    $scope.progress = $scope.progress+20;
                }

            }
            else {
                if($scope.steps[3]) {
                    $scope.steps[3] = false;
//                    $scope.progress = $scope.progress-20;
                }
            }

            if($scope.Application.has("Personal1SelfEmployed") &&
                $scope.Application.has("Personal1IncomeType") &&
                $scope.Application.get("Personal1SelfEmployed").length>0 &&
                $scope.Application.get("Personal1IncomeType").length>0){

                if(!$scope.steps[4]) {
                    $scope.steps[4] = true;
//                    $scope.progress = $scope.progress+20;
                }

            }
            else {
                if($scope.steps[4]) {
                    $scope.steps[4] = false;
//                    $scope.progress = $scope.progress-20;
                }
            }

            if($scope.Application.get("Application2")){

                if($scope.Application.has("Personal2Fname") &&
                    $scope.Application.has("Personal2Lname") &&
                    $scope.Application.has("Personal2SIN") &&
                    $scope.Application.has("Personal2Email") &&
                    $scope.Application.get("Personal2Fname").length>0 &&
                    $scope.Application.get("Personal2Lname").length>0 &&
                    $scope.Application.get("Personal2SIN").length>0 &&
                    $scope.Application.get("Personal2Email").length>0){

                    if(!$scope.steps[5]) {
                        $scope.steps[5] = true;
//                        $scope.progress = $scope.progress+4;
                    }

                }
                else {
                    if($scope.steps[5]) {
                        $scope.steps[5] = false;
//                        $scope.progress = $scope.progress-4;
                    }
                }


                if($scope.Application.has("Personal2Street1") &&
                    $scope.Application.has("Personal2City") &&
                    $scope.Application.has("Personal2Province") &&
                    $scope.Application.has("Personal2Postal") &&
                    $scope.Application.get("Personal2Street1").length>0 &&
                    $scope.Application.get("Personal2City").length>0 &&
                    $scope.Application.get("Personal2Province").length>0 &&
                    $scope.Application.get("Personal2Postal").length>0){

                    if(!$scope.steps[6]) {
                        $scope.steps[6] = true;
//                        $scope.progress = $scope.progress+4;
                    }

                }
                else {
                    if($scope.steps[6]) {
                        $scope.steps[6] = false;
//                        $scope.progress = $scope.progress-4;
                    }
                }

                if($scope.Application.has("Personal2SelfEmployed") &&
                    $scope.Application.has("Personal2IncomeType") &&
                    $scope.Application.get("Personal2SelfEmployed").length>0 &&
                    $scope.Application.get("Personal2IncomeType").length>0){

                    if(!$scope.steps[7]) {
                        $scope.steps[7] = true;
//                        $scope.progress = $scope.progress+2;
                    }

                }
                else {
                    if($scope.steps[7]) {
                        $scope.steps[7] = false;
//                        $scope.progress = $scope.progress-2;
                    }
                }

            }

            if($scope.Application.has("PropertyStreet1") &&
                $scope.Application.has("PropertyCity") &&
                $scope.Application.has("PropertyProvince") &&
                $scope.Application.has("PropertyType") &&
                $scope.Application.get("PropertyStreet1").length>0 &&
                $scope.Application.get("PropertyCity").length>0 &&
                $scope.Application.get("PropertyProvince").length>0 &&
                $scope.Application.get("PropertyType").length>0){

                if(!$scope.steps[8]) {
                    $scope.steps[8] = true;
//                    $scope.progress = $scope.progress+20;
                }

            }
            else {
                if($scope.steps[8]) {
                    $scope.steps[8] = false;
//                    $scope.progress = $scope.progress-20;
                }
            }

        });

        $scope.progress = 0;
        $scope.appStep = 0;
        $scope.isStep = function(ind){
             return $scope.appStep === ind;
        };

        $scope.$watch("appStep", function(new_val){
            if(new_val==0)
                $scope.progress = 0;
            if(new_val==1)
                $scope.progress = 9;
            if(new_val==2)
                $scope.progress = 18;
            if(new_val==3)
                $scope.progress = 27;
            if(new_val==4)
                $scope.progress = 36;
            if(new_val==5)
                $scope.progress = 45;
            if(new_val==6)
                $scope.progress = 54;
            if(new_val==7)
                $scope.progress = 63;
            if(new_val==8)
                $scope.progress = 72;
            if(new_val==9)
                $scope.progress = 81;
            if(new_val==10)
                $scope.progress = 90;
            if(new_val==11)
                $scope.progress = 100;
        });


        $scope.setStep = function(ind){

            var proced = false;

            if($scope.steps[1] == true &&
                $scope.steps[2] == true  &&
                $scope.steps[3] == true &&
                $scope.steps[4] == true &&
                $scope.steps[8] == true){

                    proced = true;
            }
            else {

                if(ind==1 &&
                    $scope.steps[1] == true)
                    proced = true;

                if(ind==2 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true)
                    proced = true;

                if(ind==3 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true)
                    proced = true;

                if(ind>3 && ind<8 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true &&
                    $scope.steps[4] == true)
                    proced = true;

                if(ind<7 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true &&
                    $scope.steps[4] == true &&
                    $scope.steps[8] == true)
                    proced = true;


            }



            if(proced){
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                $scope.appStep = ind;
            }

        };

        $scope.increaseStep = function(){
            var proced = false;

            var ind = $scope.appStep+1;

            if($scope.steps[1] == true &&
                $scope.steps[2] == true  &&
                $scope.steps[3] == true &&
                $scope.steps[4] == true &&
                $scope.steps[8] == true){

                proced = true;
            }
            else {

                if(ind==1 &&
                    $scope.steps[1] == true)
                    proced = true;

                if(ind==2 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true)
                    proced = true;

                if(ind==3 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true)
                    proced = true;

                if(ind>3 && ind<8 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true &&
                    $scope.steps[4] == true)
                    proced = true;

                if(ind<7 &&
                    $scope.steps[1] == true &&
                    $scope.steps[2] == true &&
                    $scope.steps[3] == true &&
                    $scope.steps[4] == true &&
                    $scope.steps[8] == true)
                    proced = true;


            }

            if(proced){
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                $scope.appStep++;
            }
        };

        $scope.decreaseStep = function(){
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            $scope.appStep--;
        };


        $scope.appLoading = false;
        $scope.isAppLoading = function(){
            return $scope.appLoading;
        };

        $scope.isApplicationValid = function(){
            var rsp = 0;
            angular.forEach($scope.steps, function(value, key){
                if(value==true)
                    rsp++;
            });

            return rsp==5;
        };

        $scope.submitApplication = function(){

                $scope.appLoading = true;
                $scope.Application.submited = true;
                $scope.Application.Liabilities= JSON.stringify($scope.liabilitiesVals);
                $scope.Application.Assets = JSON.stringify($scope.assetsVals);

                $scope.Application.save(null, {
                    success: function(rsp) {

                        $('html, body').animate({
                            scrollTop: 0
                        }, 1000);

                        $scope.$apply(function(){
                            $scope.appLoading = false;
                            $scope.successSubmit = true;
                        });

                        Parse.Cloud.run('sendMail', {
                            email: rsp.get("Personal1Email"),
                            name: rsp.get("Personal1Fname")+" "+rsp.get("Personal1Lname"),
                            appId: rsp.id
                        }, {
                            success: function(result) { },
                            error: function(error) {}
                        });

                    },
                    error: function(rsp, error) {
                        $scope.$apply(function(){
                            $scope.appLoading = false;
                            $scope.error = error.message;
                        });
                    }
                });


        };

        $scope.copyAddresss = function(ind){

                $scope.Application.Personal2Street1 = $scope.Application.get("Personal1Street1");
                $scope.Application.Personal2Street2 = $scope.Application.get("Personal1Street2");
                $scope.Application.Personal2City = $scope.Application.get("Personal1City");
                $scope.Application.Personal2Province = $scope.Application.get("Personal2Province");

        };

        $scope.sections = {
            "mortage" : false,
            "personal1" : false,
            "employment1" : false,
            "personal2": false,
            "employment2" : false,
            "property" : false,
            "other" : false,
            "cash" : false,
            "deposit" : false,
            "automobile" : false,
            "valueHome" : false,
            "stocks": false,
            "rrsp" : false,
            "otherAssets" : false,
            "debts": false,
            "creditCards": false,
            "owingautomobile":false,
            "mortages" : false,
            "financeCompany":false,
            "alimonyChild":false
        };

        $scope.toggleSections = function(ind){
            angular.forEach($scope.sections, function(value, key){
                if(key===ind)
                    $scope.sections[ind] = true;
                else
                    $scope.sections[key] = false;
            });
        };
        $scope.isToggleSection = function(ind){
            return $scope.sections[ind] === true;
        }

        $scope.isAssets = function(){
            return $scope.assets.length > 0;
        };

        var obj = null;

        $scope.pushAsset = function(val){
            if(val!="" && $scope.assets.indexOf(val)==-1){
                $scope.assets.push(val);
            }
            $scope.assestsMenu = "";
            obj = val;

            setTimeout(scrollTo, 200);
        };

        var scrollTo = function (){
            var val = obj;
            var el = $('#box_'+val);
            var elOffset = el.offset().top;
            var elHeight = el.height();
            var windowHeight = $(window).height();
            var offset;

            if (elHeight < windowHeight) {
                offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
            }
            else {
                offset = elOffset;
            }

            $('html, body').animate({scrollTop:offset}, 700, function(){
                $('#box_'+val+' input:eq(0)').focus();
            });
        }

        $scope.isInAsset = function(val){
            return $scope.assets.indexOf(val) > -1;
        };
        $scope.removeAssets = function(val){
            $scope.assets.splice($scope.assets.indexOf(val), 1);
        };

        $scope.addAssestsVal = function(val){
            $scope.assetsVals[val].push({
                where: "",
                description: "",
                val: ""
            });
        };

        $scope.removeAssestsVal = function(val){
            var new_array = [];
            angular.forEach($scope.assetsVals[val], function(value, key){
                if($scope.assetsVals[val].length>1 &&
                    (value.where != "" ||
                        value.description != "" ||
                        value.val != ""))
                    new_array.push(value);
            });
            $scope.assetsVals[val] = [];
            if(new_array.length == 0)
                $scope.addAssestsVal(val);
            else
                $scope.assetsVals[val] = new_array;

        };

        $scope.addLiabilities = function(val){
            $scope.liabilitiesVals[val].push({
                where: "",
                description: "",
                balance: ""
            });
        };

        $scope.removeLiabilities = function(val){
            var new_array = [];
            angular.forEach($scope.liabilitiesVals[val], function(value, key){
                if($scope.liabilitiesVals[val].length>1 &&
                    (value.where != "" ||
                        value.description != "" ||
                        value.balance != ""))
                    new_array.push(value);
            });
            $scope.liabilitiesVals[val] = [];
            if(new_array.length == 0)
                $scope.addLiabilities(val);
            else
                $scope.liabilitiesVals[val] = new_array;

        };
    }];

    controllers.StaticCtrl = ['$rootScope', '$scope', '$window', function($rootScope, $scope, $window){

        $scope.faqIndex = -1;
        $scope.isFaqIndex = function(id){
            return $scope.faqIndex == id;
        };
        $scope.setFaq = function(id){
            $scope.faqIndex = id;
        };

        $scope.faqs = [
            {
                "title" : "Q: How long will this process take?",
                "desc"  : "A: Typically an application will take anywhere between 5 and 10 minutes to complete. Once completed, we will call you within 24hrs with an approval or solutions.  Some cases will require more time, depending on the complexity of the application."
            },
            {
                "title" : "Q: Is our information secure? How is our information treated?",
                "desc"  : "A: We take privacy serious. Once you submit your application, one of our licensed mortgage agents will review your application and submit it directly to the financial institution for review."
            },
            {
                "title" : "Q: When do I get paid my commission or cash-back?",
                "desc"  : "A: Once the deal has been funded, you or your solicitor will receive payment within 24hrs by electronic email or wire transfer."
            },
            {
                "title" : "Q: Can I pick choose my bank or lender?",
                "desc"  : "A: Yes, please indicate your lender of choice in the comment section of the application."
            },
            {
                "title" : "Q: Where do we sign documents?",
                "desc"  : "A: Once we have your approval, we will contact you to make arrangements.  We can meet at our office, or one of our mobile mortgage agents will be happy to come to you."
            }
        ];

        angular.element($window).bind("scroll", function() {
            if($rootScope.isActiveHow()){

                if($('body').scrollTop() > $('.partner-howItworks').height()+50) {
                    $rootScope.isHow = false;
                    $rootScope.$apply();
                }

            }
        });


    }];


// ==== REGISTER CONTROLLERS IN ANGULAJRS APP
app.controller(controllers);

});