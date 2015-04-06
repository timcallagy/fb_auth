var PayPageView = function (service, id, pk) {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {

        //var add_gift_form = $('#add-gift-form');
        // This function must be structured this way to allow the button to fire multiple click events.
        //$(function() {
        //    return $("body").on("click", "#add-gift-btn", function() {

        //function add_gift() {
        $(function() {
            return $("body").on("click", "#add-gift-btn", function() {
                name = $('#gift-name').val();
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
                            //$('#add-gift-form').remove();
                            //$('#add-gift-holder').append(add_gift_form);

                        }
                    },
                    error: function() {
                        console.log('Error');
                    }
                });
            });
        });

        //url = "https://giftmeserver.herokuapp.com/get_gift/";
        //url = "http://127.0.0.1:8000/get_gift/";
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
