var HomeView = function (service) {

    self = this;

    var getStatus = function () {
        facebookConnectPlugin.getLoginStatus(
                function (response) {
                    facebookConnectPlugin.api('/me', [],
                        function(response) {
                            userPic = 'http://graph.facebook.com/' + response.id + '/picture?type=small';
                            window.localStorage.setItem("id", response.id);
                            window.localStorage.setItem("my_name", response.first_name + " " + response.last_name);
                            self.$el.html(self.template(response));
                            return self;
                        },
                        function(response) {
                            console.log(response);
                        }
                        );
                },
                function (response) { 
                    console.log('error');
                    alert(response);
                    console.log(response);
                });
    }

    this.initialize = function() {
        this.$el = $('<div/>');
        function login() {
            if (!window.cordova) {
                var appId = prompt("Enter FB Application ID", "");
                facebookConnectPlugin.browserInit(appId);
            }
            var checkFB = function(){
                if (typeof facebookConnectPlugin != 'undefined' && typeof FB != 'undefined'){
                    facebookConnectPlugin.login( ["email"],
                          function (response) { 
                              console.log('success!');
                            //window.location="#home/";
                            getStatus();
                           },
                            function (response) { 
                            window.location="#login/";
                          });
                } else {
                    console.log('FB NOT READY');
                    setTimeout(checkFB, 500);
                }
            }
            checkFB();
        }
        login();
    };
    this.render = function() {
        //getStatus();
        /*
           openFB.api({
           path: '/me',
           success: function(data) {
           userPic = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
           window.localStorage.setItem("id", data.id);
           window.localStorage.setItem("my_name", data.first_name + " " + data.last_name);
           self.$el.html(self.template(data));
           return self;
           },
           error: function(data) {
           openFB.login(
           function(response) {
           if(response.status === 'connected') {
           window.localStorage.setItem("access_token", response.authResponse.token);
           openFB.api({
           path: '/me',
           success: function(data) {
           userPic = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
           window.localStorage.setItem("id", data.id);
           window.localStorage.setItem("my_name", data.first_name + " " + data.last_name);
           self.$el.html(self.template(data));
           return self;
           },
           error: errorHandler});
           } else {
           alert('Facebook login failed: ' + response.error);
           }
           }, {scope: 'email,user_friends'});
           }
           });
           */
    };

    this.initialize();

    function errorHandler(error) {
        alert(error.message);
    }

}
