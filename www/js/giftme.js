// If we are running in the live environment, use these variables.
if (!window.cordova) {
    var backend_url = 'http://127.0.0.1:8000/';
    Stripe.setPublishableKey('pk_test_iQi63h5Zd5LyKJGOMGUYxRvp');
    // else, use these variables.
} else {
    var backend_url = 'https://giftmeserver.herokuapp.com/'; 
        Stripe.setPublishableKey('pk_live_rzB00nH8Ua6HTGoh77BGXtuy');
}
function facebook_login(){
    var checkFB = function(){
        if (typeof facebookConnectPlugin != 'undefined'){
            facebookConnectPlugin.login( ["email", "user_friends"],
                    function (response) { 
                        window.location="#home/";
                        authResponse = response.authResponse;
                        window.localStorage.setItem("accessToken", authResponse.accessToken);
                        window.localStorage.setItem("userID", authResponse.userID);
                        $.ajax({
                            url: backend_url + 'login/',
                            type: 'post',
                            dataType: 'json',
                            data: {'accessToken': authResponse.accessToken, 'expiresIn': authResponse.expiresIn, 'userID': authResponse.userID}, 
                            success: function() {
                            },
                            error: function() {
                            }
                        });
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
function send_whatsapp(message) {
    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, 'https://play.google.com/store/apps/details?id=co.giftmeapp.gift_me' /* url */, function() {
            console.log('share ok')
            }, 
            function(errormsg){
                alert(errormsg)
            });
}
