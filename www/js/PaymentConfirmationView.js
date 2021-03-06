var PaymentConfirmationView = function () {

    self = this;

    this.initialize = function() {
        this.$el = $('<div/>');
    };

    this.render = function() {
        contribution = window.localStorage.getItem("contribution");
        contribution = JSON.parse(contribution)[0];
        friends = window.localStorage.getItem("friends");
        friends = JSON.parse(friends);
        for (var f in friends) {
            if (friends[f].id == contribution.fields.contributed_to){
                friend = friends[f];
            }
        }
        self.$el.html(self.template({contribution: contribution, friend: friend}));
        return this;
    };
    this.initialize();

}
