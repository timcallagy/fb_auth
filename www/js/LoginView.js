var LoginView = function (service) {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
        // Send a GET request to heroku to wake up the dyno and avoid delays on the handset on other screens.
        //url = 'https://giftmeserver.herokuapp.com/wakeup/';
        //url = 'http://127.0.0.1:8000/wakeup/';
        $.ajax({
            url: backend_url + 'wakeup/',
            type: 'get',
            success: function(data) {
                console.log('Success');
            },
            error: function() {
                console.log('Error');
            }
        });
        /*
        var checkFB = function(){
            if (typeof facebookConnectPlugin != 'undefined' && typeof FB != 'undefined'){
                facebookConnectPlugin.login( ["email"],
                        function (response) { 
                            console.log('success!');
                            //window.location="#home/";
                            getStatus();
                        },
                        function (response) { 
                            console.log('failure!');
                            window.location="#login/";
                        });
            } else {
                console.log('FB NOT READY');
                setTimeout(checkFB, 500);
            }
        }
        checkFB();
        */
        /*
           function login() {
           if (!window.cordova) {
           var appId = prompt("Enter FB Application ID", "");
           facebookConnectPlugin.browserInit(appId);
           }
           var checkFB = function(){
           if (typeof facebookConnectPlugin != 'undefined'){
           facebookConnectPlugin.login( ["email"],
           function (response) { 
           console.log('success!');
           window.location="#home/";
           },
           function (response) { 
           self.render();
           });
           } else {
           console.log('FB NOT READY');
           setTimeout(checkFB, 500);
           }
           }
           checkFB();
           }
           login();
           */

        /*
           openFB.init({appId: '1533444716908405'});
           openFB.api({
           path: '/me',
           success: function(data) {
           window.location="#home/";
           },
           error: function(data) {
           self.render();
           }
           });
           */
    };


    this.render = function() {
        this.$el.html(this.template());
        return this;
    };
    this.initialize();

}
