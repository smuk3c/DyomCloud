define(['app'], function (app) {

// === SERVICES OBJECT
    var factories = {};

    factories.Mortage = ['$q', '$filter', function($q, $filter){
        var factory = {};

        var rebates = {
            "1 Year Term" : {
                "name"      : "1 Year Term",
                "percent"   : 0.35,
                "rate"      : 0.289
            },
            "2 Year Term" :{
                "name"      : "2 Year Term",
                "percent"   : 0.4,
                "rate"      : 0.234
            },
            "3 Year Term" :{
                "name"      : "3 Year Term",
                "percent"   : 0.5,
                "rate"      : 0.269
            },
            "4 Year Term" :{
                "name"      : "4 Year Term",
                "percent"   : 0.5,
                "rate"      : 0.277
            },
            "5 Year Term" :{
                "name"      : "5 Year Term",
                "percent"   : 0.6,
                "rate"      : 0.299
            },
            "7 Year Term" :{
                "name"      : "7 Year Term",
                "percent"   : 0.6,
                "rate"      : 0.379
            },
            "10 Year Term" :{
                "name"      : "10 Year Term",
                "percent"   : 0.65,
                "rate"      : 0.439
            }
        };

        factory.setRebate = function(id, rate){
            rebates[id+" Year Term"].rate = rate;
        };

        var mortage = {
            "amount" : null,
            "rebate" : 0,
            "period" : "5 Year Term",
            "type": "Variable",
            "change": false,
            "variable": 0
        };

        factory.set = function(attribute, value) {
            mortage[attribute] = value;

            if(attribute=="type" && value=="Variable")
                mortage["period"] = "5 Year Term";

            if(attribute=="period" && value!="5 Year Term")
                mortage['type'] = "Fixed";

            mortage.change = true;
            factory.calculate();
        };

        factory.setPeriod = function(attribute, value) {
            mortage[attribute] = value;
            factory.calculate();
        };

        factory.getRate = function(){
            var rate = parseFloat(rebates[mortage.period].rate*10);
                rate = rate.toFixed(10);
                rate =  rate.substring(0, rate.length-8);

            if(mortage.type=="Variable") {
                rate = parseFloat(mortage.variable*10);
                rate = rate.toFixed(10);
                rate =  rate.substring(0, rate.length-8);
            }

            return rate+"%";
        };

        factory.get = function(attribute){
            if(attribute=="amount") {
                if(mortage[attribute]!=null)
                    return  $filter('noFractionCurrency')(mortage[attribute]);
                else
                    return null;
            }
            else
                return  mortage[attribute];
        };

        factory.calculate = function(){
            mortage.rebate = (mortage.amount * rebates[mortage.period].percent) / 100;
        };

        return factory;
    }];


    factories.User = [function(){
        var User = Parse.User.extend(
            {},
            {
                isAdmin: function(){
                    if(this.current()){
                        console.log(this);
                        if(this.has("isAdmin") && this.get("isAdmin"))
                            return true;
                        else
                            return false;
                        }
                    else
                        return false;
                }
            }
        );
        return User;
    }];

    factories.Application = ['$q', '$rootScope', 'Mortage', function($q, $rootScope, Mortage){
        var _Application = Parse.Object.extend("Applications", {}, {
            getList : function(page, limit, order) {
                var defer = $q.defer();
                var skip = page*limit;

                var query = new Parse.Query(this);
                    query.equalTo("submited", true);
                    query.limit(limit);
                    query.skip(skip);
                    if(order==1)
                        query.descending("createdAt");
                    else
                        query.ascending("createdAt");
                query.find({
                    success : function(aApplications) {
                        defer.resolve(aApplications);
                        $rootScope.$apply();
                    },
                    error : function(aError) {
                        defer.reject(aError);
                        $rootScope.$apply();
                    }
                });

                return defer.promise;
            },
            count : function(){
                var defer = $q.defer();
                var query = new Parse.Query(this);
                query.equalTo("submited", true);

                query.count({
                    success : function(count) {
                        defer.resolve(count);
                        $rootScope.$apply();
                    },
                    error : function(aError) {
                        defer.reject(aError);
                        $rootScope.$apply();
                    }
                });

                return defer.promise;
            },
            findById : function(id){
                var defer = $q.defer();

                var query = new Parse.Query(this);

                query.get(id, {
                    success: function(application) {
                        defer.resolve(application);
                        $rootScope.$apply();
                    },
                    error: function(aError) {
                        defer.resolve(count);
                        $rootScope.$apply();
                    }
                });

                return defer.promise;
            },
            findByUser : function(user){
                var defer = $q.defer();

                var query = new Parse.Query(this);
                    query.equalTo("user", user);

                query.first({
                    success: function(application) {
                        defer.resolve(application);
                        $rootScope.$apply();
                    },
                    error: function(aError) {
                        defer.resolve(count);
                        $rootScope.$apply();
                    }
                });

                return defer.promise;
            }
        });

        Object.defineProperty(_Application.prototype, "MortagePurpose", {
            get: function() {
                return this.get("MortagePurpose");
            },
            set: function(aValue) {
                this.set("MortagePurpose", aValue);
            }
        })
        Object.defineProperty(_Application.prototype, "MortageType", {
            get: function() {
                return this.get("MortageType");
            },
            set: function(aValue) {
                this.set("MortageType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageTerm", {
            get: function() {
                return this.get("MortageTerm");
            },
            set: function(aValue) {
                this.set("MortageTerm", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageRate", {
            get: function() {
                return this.get("MortageRate");
            },
            set: function(aValue) {
                this.set("MortageRate", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageAmortization", {
            get: function() {
                return this.get("MortageAmortization");
            },
            set: function(aValue) {
                this.set("MortageAmortization", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PurchaseDownPercent", {
            get: function() {
                return this.get("PurchaseDownPercent");
            },
            set: function(aValue) {
                this.set("PurchaseDownPercent", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PurchasePrice", {
            get: function() {
                return this.get("PurchasePrice");
            },
            set: function(aValue) {
                this.set("PurchasePrice", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortagePurchaseDownPayment", {
            get: function() {
                return this.get("MortagePurchaseDownPayment");
            },
            set: function(aValue) {
                this.set("MortagePurchaseDownPayment", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageMLS", {
            get: function() {
                return this.get("MortageMLS");
            },
            set: function(aValue) {
                this.set("MortageMLS", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageMLSNumber", {
            get: function() {
                return this.get("MortageMLSNumber");
            },
            set: function(aValue) {
                this.set("MortageMLSNumber", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "ClosingDate", {
            get: function() {
                return this.get("ClosingDate");
            },
            set: function(aValue) {
                this.set("ClosingDate", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "AppraisedValue", {
            get: function() {
                return this.get("AppraisedValue");
            },
            set: function(aValue) {
                this.set("AppraisedValue", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "ExistingMortageValue", {
            get: function() {
                return this.get("ExistingMortageValue");
            },
            set: function(aValue) {
                this.set("ExistingMortageValue", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "ExistingMortageValueRefinance", {
            get: function() {
                return this.get("ExistingMortageValueRefinance");
            },
            set: function(aValue) {
                this.set("ExistingMortageValueRefinance", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "NewMortageValueRefinance", {
            get: function() {
                return this.get("NewMortageValueRefinance");
            },
            set: function(aValue) {
                this.set("NewMortageValueRefinance", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MaturityDate", {
            get: function() {
                return this.get("MaturityDate");
            },
            set: function(aValue) {
                this.set("MaturityDate", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PurchasePriceConstruction", {
            get: function() {
                return this.get("PurchasePriceConstruction");
            },
            set: function(aValue) {
                this.set("PurchasePriceConstruction", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "ApprovedPermits", {
            get: function() {
                return this.get("ApprovedPermits");
            },
            set: function(aValue) {
                this.set("ApprovedPermits", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "ConstructionBudget", {
            get: function() {
                return this.get("ConstructionBudget");
            },
            set: function(aValue) {
                this.set("ConstructionBudget", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "TotalFoundsRequired", {
            get: function() {
                return this.get("TotalFoundsRequired");
            },
            set: function(aValue) {
                this.set("TotalFoundsRequired", aValue);
            }
        });


        Object.defineProperty(_Application.prototype, "Personal1Title", {
            get: function() {
                return this.get("Personal1Title");
            },
            set: function(aValue) {
                this.set("Personal1Title", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Fname", {
            get: function() {
                return this.get("Personal1Fname");
            },
            set: function(aValue) {
                this.set("Personal1Fname", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Lname", {
            get: function() {
                return this.get("Personal1Lname");
            },
            set: function(aValue) {
                this.set("Personal1Lname", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Initial", {
            get: function() {
                return this.get("Personal1Initial");
            },
            set: function(aValue) {
                this.set("Personal1Initial", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1BirthMonth", {
            get: function() {
                return this.get("Personal1BirthMonth");
            },
            set: function(aValue) {
                this.set("Personal1BirthMonth", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1BirthDay", {
            get: function() {
                return this.get("Personal1BirthDay");
            },
            set: function(aValue) {
                this.set("Personal1BirthDay", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1BirthYear", {
            get: function() {
                return this.get("Personal1BirthYear");
            },
            set: function(aValue) {
                this.set("Personal1BirthYear", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1SIN", {
            get: function() {
                return this.get("Personal1SIN");
            },
            set: function(aValue) {
                this.set("Personal1SIN", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1HomePhone", {
            get: function() {
                return this.get("Personal1HomePhone");
            },
            set: function(aValue) {
                this.set("Personal1HomePhone", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1WorkPhone", {
            get: function() {
                return this.get("Personal1WorkPhone");
            },
            set: function(aValue) {
                this.set("Personal1WorkPhone", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Email", {
            get: function() {
                return this.get("Personal1Email");
            },
            set: function(aValue) {
                this.set("Personal1Email", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Communication", {
            get: function() {
                return this.get("Personal1Communication");
            },
            set: function(aValue) {
                this.set("Personal1Communication", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1CommunicationTime", {
            get: function() {
                return this.get("Personal1CommunicationTime");
            },
            set: function(aValue) {
                this.set("Personal1CommunicationTime", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1CommunicationDays", {
            get: function() {
                return this.get("Personal1CommunicationDays");
            },
            set: function(aValue) {
                this.set("Personal1CommunicationDays", aValue);
            }
        });



        Object.defineProperty(_Application.prototype, "Personal1Street1", {
            get: function() {
                return this.get("Personal1Street1");
            },
            set: function(aValue) {
                this.set("Personal1Street1", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Street2", {
            get: function() {
                return this.get("Personal1Street2");
            },
            set: function(aValue) {
                this.set("Personal1Street2", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1City", {
            get: function() {
                return this.get("Personal1City");
            },
            set: function(aValue) {
                this.set("Personal1City", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Province", {
            get: function() {
                return this.get("Personal1Province");
            },
            set: function(aValue) {
                this.set("Personal1Province", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Postal", {
            get: function() {
                return this.get("Personal1Postal");
            },
            set: function(aValue) {
                this.set("Personal1Postal", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1ResidentalStatus", {
            get: function() {
                return this.get("Personal1ResidentalStatus");
            },
            set: function(aValue) {
                this.set("Personal1ResidentalStatus", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1MonthlyRent", {
            get: function() {
                return this.get("Personal1MonthlyRent");
            },
            set: function(aValue) {
                this.set("Personal1MonthlyRent", aValue);
            }
        });



        Object.defineProperty(_Application.prototype, "Personal1CompanyName", {
            get: function() {
                return this.get("Personal1CompanyName");
            },
            set: function(aValue) {
                this.set("Personal1CompanyName", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1SelfEmployed", {
            get: function() {
                return this.get("Personal1SelfEmployed");
            },
            set: function(aValue) {
                this.set("Personal1SelfEmployed", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Income", {
            get: function() {
                return this.get("Personal1Income");
            },
            set: function(aValue) {
                this.set("Personal1Income", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1IncomeType", {
            get: function() {
                return this.get("Personal1IncomeType");
            },
            set: function(aValue) {
                this.set("Personal1IncomeType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1IncomeOther", {
            get: function() {
                return this.get("Personal1IncomeOther");
            },
            set: function(aValue) {
                this.set("Personal1IncomeOther", aValue);
            }
        });



        Object.defineProperty(_Application.prototype, "Personal2Title", {
            get: function() {
                return this.get("Personal2Title");
            },
            set: function(aValue) {
                this.set("Personal2Title", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Fname", {
            get: function() {
                return this.get("Personal2Fname");
            },
            set: function(aValue) {
                this.set("Personal2Fname", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Lname", {
            get: function() {
                return this.get("Personal2Lname");
            },
            set: function(aValue) {
                this.set("Personal2Lname", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2BirthMonth", {
            get: function() {
                return this.get("Personal2BirthMonth");
            },
            set: function(aValue) {
                this.set("Personal2BirthMonth", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2BirthDay", {
            get: function() {
                return this.get("Personal2BirthDay");
            },
            set: function(aValue) {
                this.set("Personal2BirthDay", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2BirthYear", {
            get: function() {
                return this.get("Personal2BirthYear");
            },
            set: function(aValue) {
                this.set("Personal2BirthYear", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2SIN", {
            get: function() {
                return this.get("Personal2SIN");
            },
            set: function(aValue) {
                this.set("Personal2SIN", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2HomePhone", {
            get: function() {
                return this.get("Personal2HomePhone");
            },
            set: function(aValue) {
                this.set("Personal2HomePhone", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2WorkPhone", {
            get: function() {
                return this.get("Personal2WorkPhone");
            },
            set: function(aValue) {
                this.set("Personal2WorkPhone", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Email", {
            get: function() {
                return this.get("Personal2Email");
            },
            set: function(aValue) {
                this.set("Personal2Email", aValue);
            }
        });



        Object.defineProperty(_Application.prototype, "Personal2Street1", {
            get: function() {
                return this.get("Personal2Street1");
            },
            set: function(aValue) {
                this.set("Personal2Street1", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Street2", {
            get: function() {
                return this.get("Personal2Street2");
            },
            set: function(aValue) {
                this.set("Personal2Street2", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2City", {
            get: function() {
                return this.get("Personal2City");
            },
            set: function(aValue) {
                this.set("Personal2City", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Province", {
            get: function() {
                return this.get("Personal2Province");
            },
            set: function(aValue) {
                this.set("Personal2Province", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Postal", {
            get: function() {
                return this.get("Personal2Postal");
            },
            set: function(aValue) {
                this.set("Personal2Postal", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2ResidentalStatus", {
            get: function() {
                return this.get("Personal2ResidentalStatus");
            },
            set: function(aValue) {
                this.set("Personal2ResidentalStatus", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2MonthlyRent", {
            get: function() {
                return this.get("Personal2MonthlyRent");
            },
            set: function(aValue) {
                this.set("Personal2MonthlyRent", aValue);
            }
        });



        Object.defineProperty(_Application.prototype, "Personal2CompanyName", {
            get: function() {
                return this.get("Personal2CompanyName");
            },
            set: function(aValue) {
                this.set("Personal2CompanyName", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2SelfEmployed", {
            get: function() {
                return this.get("Personal2SelfEmployed");
            },
            set: function(aValue) {
                this.set("Personal2SelfEmployed", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2Income", {
            get: function() {
                return this.get("Personal2Income");
            },
            set: function(aValue) {
                this.set("Personal2Income", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2IncomeType", {
            get: function() {
                return this.get("Personal2IncomeType");
            },
            set: function(aValue) {
                this.set("Personal2IncomeType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal2IncomeOther", {
            get: function() {
                return this.get("Personal2IncomeOther");
            },
            set: function(aValue) {
                this.set("Personal2IncomeOther", aValue);
            }
        });


        Object.defineProperty(_Application.prototype, "PropertyStreet1", {
            get: function() {
                return this.get("PropertyStreet1");
            },
            set: function(aValue) {
                this.set("PropertyStreet1", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyStreet2", {
            get: function() {
                return this.get("PropertyStreet2");
            },
            set: function(aValue) {
                this.set("PropertyStreet2", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyCity", {
            get: function() {
                return this.get("PropertyCity");
            },
            set: function(aValue) {
                this.set("PropertyCity", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyProvince", {
            get: function() {
                return this.get("PropertyProvince");
            },
            set: function(aValue) {
                this.set("PropertyProvince", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyPostal", {
            get: function() {
                return this.get("PropertyPostal");
            },
            set: function(aValue) {
                this.set("PropertyPostal", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyType", {
            get: function() {
                return this.get("PropertyType");
            },
            set: function(aValue) {
                this.set("PropertyType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyLivingArea", {
            get: function() {
                return this.get("PropertyLivingArea");
            },
            set: function(aValue) {
                this.set("PropertyLivingArea", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyLivingAreaUnit", {
            get: function() {
                return this.get("PropertyLivingAreaUnit");
            },
            set: function(aValue) {
                this.set("PropertyLivingAreaUnit", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyDwellingStyle", {
            get: function() {
                return this.get("PropertyDwellingStyle");
            },
            set: function(aValue) {
                this.set("PropertyDwellingStyle", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyGarageType", {
            get: function() {
                return this.get("PropertyGarageType");
            },
            set: function(aValue) {
                this.set("PropertyGarageType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyGarageSize", {
            get: function() {
                return this.get("PropertyGarageSize");
            },
            set: function(aValue) {
                this.set("PropertyGarageSize", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyOccupiedBy", {
            get: function() {
                return this.get("PropertyOccupiedBy");
            },
            set: function(aValue) {
                this.set("PropertyOccupiedBy", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "PropertyMore", {
            get: function() {
                return this.get("PropertyMore");
            },
            set: function(aValue) {
                this.set("PropertyMore", aValue);
            }
        });

        Object.defineProperty(_Application.prototype, "Liabilities", {
            get: function() {
                return this.get("Liabilities");
            },
            set: function(aValue) {
                this.set("Liabilities", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Assets", {
            get: function() {
                return this.get("Assets");
            },
            set: function(aValue) {
                this.set("Assets", aValue);
            }
        });

        Object.defineProperty(_Application.prototype, "RealEstateAgent", {
            get: function() {
                return this.get("RealEstateAgent");
            },
            set: function(aValue) {
                this.set("RealEstateAgent", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "RealEstateOffice", {
            get: function() {
                return this.get("RealEstateOffice");
            },
            set: function(aValue) {
                this.set("RealEstateOffice", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "OtherInfo", {
            get: function() {
                return this.get("OtherInfo");
            },
            set: function(aValue) {
                this.set("OtherInfo", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Application2", {
            get: function() {
                return this.get("Application2");
            },
            set: function(aValue) {
                this.set("Application2", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "submited", {
            get: function() {
                return this.get("submited");
            },
            set: function(aValue) {
                this.set("submited", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "user", {
            get: function() {
                return this.get("user");
            },
            set: function(aValue) {
                this.set("user", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "MortageRateType", {
            get: function() {
                return this.get("MortageRateType");
            },
            set: function(aValue) {
                this.set("MortageRateType", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1MonthlyMortgagePayment", {
            get: function() {
                return this.get("Personal1MonthlyMortgagePayment");
            },
            set: function(aValue) {
                this.set("Personal1MonthlyMortgagePayment", aValue);
            }
        });
        Object.defineProperty(_Application.prototype, "Personal1Month2yMortgagePayment", {
            get: function() {
                return this.get("Personal1Month2yMortgagePayment");
            },
            set: function(aValue) {
                this.set("Personal1Month2yMortgagePayment", aValue);
            }
        });

        return _Application;
    }];


// ==== REGISTER SERVICES IN ANGULAJRS APP
    app.factory(factories);

});