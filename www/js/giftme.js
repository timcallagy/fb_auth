// If we are running in the live environment, use these variables.
if (!window.cordova) {
    var backend_url = 'https://giftmeserver.herokuapp.com/'; 
    Stripe.setPublishableKey('pk_live_rzB00nH8Ua6HTGoh77BGXtuy');
// else, use these variables.
} else {
    var backend_url = 'http://127.0.0.1:8000/';
    Stripe.setPublishableKey('pk_test_iQi63h5Zd5LyKJGOMGUYxRvp');
}

var add_gift_form = $('#add-gift-form');
// This function must be structured this way to allow the button to fire multiple click events.
//$(function() {
//    return $("body").on("click", "#add-gift-btn", function() {

//function add_gift() {
$(function() {
    return $("body").on("click", "#add-gift-btn", function() {
        //    form = $('#add-gift-form').serialize();
        //url = 'https://giftmeserver.herokuapp.com/add_gift/';
        // url = 'http://127.0.0.1:8000/add_gift/';
        
        name = $('#gift-name').val();
        //name = document.getElementById('gift-name').value;
        console.log(name);
        price = $('#gift-price').val();
        url = $('#gift-url').val();
        owner_id = $('#gift-owner-id').val();
        $.ajax({
            url: backend_url + 'add_gift/',
            type: 'post',
            dataType: 'json',
            data: {name: name, url: url, price: price, owner_id: owner_id},
            success: function(data) {
                // data == false if the gift was not successfully added.
                if (data == false ) {
                    $('#price-error').show();
                } else {
                    $('#price-error').hide();
                    // Reload so that the form can be submitted again.
                    /*
                       addGiftView = new AddGiftView();
                       addGiftView.render();
                       slider.slidePage(addGiftView.$el);
                       window.location.redirect = "#wishlist/";
                       href = window.location.href;
                       window.location.href = href.slice(0, href.indexOf("#")) + "#wishlist/";
                       window.location.reload();
                       */
                    window.location = "#wishlist/";
                    $('#add-gift-form').remove();
                    $('#add-gift-holder').append(add_gift_form);

                }
            },
            error: function() {
                console.log('Error');
            }
        });
    });
});

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

function delete_gift(pk) {
    gift = $("#gift-" + pk);
    accessToken = window.localStorage.getItem("accessToken");
    userID = window.localStorage.getItem("userID");
    $.ajax({
        url: backend_url + "delete_gift/" + pk + "/",
        type: 'post',
        data: {'accessToken': accessToken, 'userID': userID},
        success: function() {
            gift.hide();
            console.log('Success');
            console.log(gift);
        },
        error: function() {
            gift.hide();
            console.log('Error');
            console.log(gift);
        }
    });
}

// This function must be structured this way to allow the button to fire multiple click events.
$(function() {
    return $("body").on("click", "#pay-btn", function() {
        $('#gift-message-error').hide();
        $('#payment-error').hide();
        $('#payment-failed-msg').hide();
        $('#pay-btn').hide();
        $('#processing-btn').show();

        amount = $('#amount').val();
        message = $('#gift-message').val();
        if (message.length > 5000){
            $('#gift-message-error').show();
        }
        card_number = $('#card-number').val();
        card_cvc = $('#card-cvc').val();
        expiry_month = $('#expiry-month').val();
        expiry_year = $('#expiry-year').val();

        Stripe.card.createToken({
            number: card_number,
            cvc: card_cvc,
            exp_month: expiry_month,
            exp_year: expiry_year
        }, stripeResponseHandler);

        function stripeResponseHandler(status, response) {
            if (response.error) {
                $('#pay-btn').show();
                $('#processing-btn').hide();
                $('#payment-failed-msg').show();
                $('#payment-error').html(response.error.message);
                $('#payment-error').show();
            } else {
                var token = response.id;
                var contributor_id = localStorage.getItem("id");
                var accessToken = localStorage.getItem("accessToken");
                var contributor_name = localStorage.getItem("my_name");
                gift_pk = $('#gift-pk').val();
                friend_id = $('#friend-id').val();
                $.ajax({
                    url: backend_url + 'pay/' + gift_pk + '/',
                    type: 'post',
                    dataType: 'json',
                    data: {token: token, amount: amount, message: message, card_number: card_number, card_cvc: card_cvc, expiry_month: expiry_month, expiry_year: expiry_year, contributor_id: contributor_id, contributor_name: encodeURI(contributor_name), accessToken: accessToken, timestamp: Date.now()},
                    success: function(data) {
                        if (data.indexOf('Error') > -1) {
                            $('#payment-failed-msg').show();
                            $('#payment-error').html("Something went wrong at GiftMe");
                            $('#payment-error').show();
                            $('#pay-btn').show();
                            $('#processing-btn').hide();
                            console.log('Error');
                        } else {
                            window.localStorage.setItem("contribution", JSON.stringify(data));
                            window.location = "#payment-confirmation/";
                            //window.location.redirect = "#payment-confirmation/";
                            //href = window.location.href;
                            //window.location.href = href.slice(0, href.indexOf("#")) + "#payment-confirmation/";
                            //window.location.reload();
                        }
                    },
                    error: function() {
                        $('#payment-failed-msg').show();
                        $('#payment-error').html("Something went wrong at GiftMe");
                        $('#payment-error').show();
                        $('#pay-btn').show();
                        $('#processing-btn').hide();
                        console.log('Error');
                    }
                });
            }
        }
    });
});

function send_whatsapp(message) {
    window.plugins.socialsharing.shareViaWhatsApp(message, null /* img */, 'https://play.google.com/store/apps/details?id=co.giftmeapp.gift_me' /* url */, function() {
            console.log('share ok')
            }, 
            function(errormsg){
                alert(errormsg)
            });
}
