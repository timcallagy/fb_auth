var AddGiftView = function (service) {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {

        $(function() {
            return $("body").on("click", "#add-gift-btn", function() {
                name = $('#gift-name').val();
                price = $('#gift-price').val();
                url = $('#gift-url').val();
                owner_id = $('#gift-owner-id').val();
                accessToken = window.localStorage.getItem("accessToken");
                userID = window.localStorage.getItem("userID");
                $.ajax({
                    url: backend_url + 'add_gift/',
                    type: 'post',
                    dataType: 'json',
                    data: {name: name, url: url, price: price, owner_id: owner_id, accessToken: accessToken, userID: userID},
                    success: function(data) {
                        // data == false if the gift was not successfully added.
                        if (data == false ) {
                            $('#add-error').show();
                        } else {
                            $('#add-error').hide();
                            $('#url-error').hide();
                            $('#price-error').hide();
                            window.location = "#wishlist/";
                        }
                    },
                    error: function(response) {
                        if (response.responseText == "Invalid URL") {
                            $('#add-error').hide();
                            $('#url-error').show();
                            $('#price-error').hide();
                        } else if (response.responseText == "Invalid amount") {
                            $('#add-error').hide();
                            $('#url-error').hide();
                            $('#price-error').show();
                        } else {
                            $('#add-error').show();
                            $('#url-error').hide();
                            $('#price-error').hide();
                        }
                    }
                });
            });
        });
        var id = window.localStorage.getItem("id");
        var csrf_token = window.localStorage.getItem("csrf_token");
        self.$el.html(self.template({id: id, csrf_token: csrf_token}));
        return self;
    };
    this.initialize();

    function errorHandler(error) {
        alert(error.message);
    }

}
