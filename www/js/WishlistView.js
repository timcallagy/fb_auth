var WishlistView = function (service) {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
        Handlebars.registerHelper("check_if_zero", function(crowdfunded, options){
            if (crowdfunded === 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    };

    this.render = function() {
        userID = window.localStorage.getItem("id");
        function delete_gift(pk) {
            gift = $("#gift-" + pk);
            accessToken = window.localStorage.getItem("accessToken");
            $.ajax({
                url: backend_url + "delete_gift/" + pk + "/",
                type: 'post',
                data: {'accessToken': accessToken, 'userID': userID},
                success: function() {
                    gift.remove();
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
        $.get(backend_url + "get_gifts/" + userID + "/", function( data ) {
            window.localStorage.setItem("gifts", data);
            data = JSON.parse(data);
            self.$el.html(self.template(data));
            return this;
        });
    }
    this.initialize();
}
