define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone')
    
    return Backbone.Model.extend({

        defaults : function() {
            return {
                date: new Date().getTime(),
                today: $$.today()
            }
        },
        
        initialize: function(options) {
            this.firebase = new Firebase($$.FirebaseURL + "/messages/" + $$.today())
        },
        
        formattedTime: function() {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            var dt = new Date(this.get('date'));
            var month = dt.getMonth();
            var date = dt.getDate();
            var hours = dt.getHours();
            var mins = dt.getMinutes();
            var seconds = dt.getSeconds();
            
            month = months[month];
            date = date < 10 ? "0" + date : date;
            
            hours = hours < 10 ? "0" + hours : hours;
            mins = mins < 10 ? "0" + mins : mins;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return month + " " + date + " at " + hours + ":" + mins + ":" + seconds;
        },
        
        avatar: function() {
            return this.has('avatar') ? this.get('avatar') : this.has('fbAvatar') ? this.get('fbAvatar') : "/img/default-avatar.png";
        },
        
        username: function() {
            return (this.has('username') ? this.get('username') : this.get('email')).split("@")[0];
        }
        
    });
    
});
