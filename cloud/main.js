var Mandrill = require('mandrill');
Mandrill.initialize('MmN18Dwt9MfoNn6Rui7T6g');

Parse.Cloud.define("sendMail", function(request, response) {

    Mandrill.sendEmail({
        template_name: "thank_you",
        message: {
            subject: "Thank you for your application",
            from_email: "info@dyom.ca",
            from_name: "Dyom",
            merge: true,
            merge_vars: [
                {
                    "rcpt": request.params.email,
                    "vars": [
                        {
                            "name": "name",
                            "content": request.params.name
                        },
                        {
                            "name": "aid",
                            "content": request.params.appId
                        }
                    ]
                }
            ],
            to: [
                {
                    email: request.params.email,
                    name: request.params.name
                }
            ]
        },
        async: true
    },{
        success: function(httpResponse) {
            response.success("Email sent!");
        },
        error: function(httpResponse) {
            console.log(httpResponse)
            response.error("Uh oh, something went wrong");
        }
    });

});

Parse.Cloud.job("scrapper", function(request, status) {

    Parse.Cloud.useMasterKey();
    Parse.Cloud.httpRequest({
        url: 'http://invis.ca/in/about/current-rates/',
        success: function(httpResponse) {

            var data = httpResponse.text.split("<table>");
                data = data[1].split("</table>");
                data = data[0].split("<tr>");

                var b = 1;
                var requests = 0;

            for(var i=3; i<12; i++){
                    requests++;


                if(i!=10){

                    var inside_data = data[i].split("</td>");
                        inside_data = inside_data[2].split(">");
                        inside_data = inside_data[1].slice(0, -1);
                        inside_data = parseFloat(inside_data)/10;
                        inside_data = inside_data.toFixed(10);
                        inside_data = inside_data.substring(0, inside_data.length-7);



                    if(i==11){
                        Parse.Cloud.run('updateRate', {
                            year: b,
                            rate: parseFloat(inside_data),
                            varRate: true
                        }, {
                            success: function(result) {
                                requests--;
                                if(requests==0)
                                    done();
                            },
                            error: function(error) {}
                        });
                    }
                    else {
                        Parse.Cloud.run('updateRate', {
                            year: b,
                            rate: parseFloat(inside_data),
                            varRate: false
                        }, {
                            success: function(result) {
                                requests--;
                                if(requests==0)
                                    done();
                            },
                            error: function(error) {}
                        });
                    }


                }

                    if(b==7)
                        b=10;
                    else if(b==5)
                        b=7;
                    else
                        b++;

                    if(i==10)
                        b=5;
                }

                function done(){
                    status.success("Success");
                }

        },
        error: function(httpResponse) {
            status.error("Uh oh, something went wrong");
        }
    });
});

Parse.Cloud.define("updateRate", function(request, response) {

    var Rates = Parse.Object.extend("rates");
    var query = new Parse.Query(Rates);

    query.equalTo("years", request.params.year);
    query.first({
        success: function(obj) {
            if(request.params.varRate)
                obj.set("variableRate", request.params.rate);
            else
                obj.set("rate", request.params.rate);
            obj.save(null, {
                success: function(obj){
                   response.success("true");
                }
            });
        }
    });

});