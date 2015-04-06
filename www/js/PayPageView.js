var PayPageView = function (service, id, pk) {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {
        // This function must be structured this way to allow the button to fire multiple click events.
        $(function() {
            return $("body").on("click", "#pay-btn", function() {
                $("#pay-btn").attr("disabled", true);
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
                    $("#pay-btn").attr("disabled", false);
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
        $.get(backend_url + "get_gift/" + pk + "/", function( data ) {
            data = JSON.parse(data);
            friends = window.localStorage.getItem("friends");
            friends = JSON.parse(friends);
            for (var f in friends) {
                if (friends[f].id == data[0].fields.owner_id){
                    friend = friends[f];
                }
            }
            self.$el.html(self.template({id: id, pk: pk, gift: data[0].fields, friend: friend}));
            return this;
        });
    };
    this.initialize();
}
