define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone');
    
    return Backbone.Firebase.Model.extend({

        initialize: function(options) {
            this.firebase = new Firebase($$.FirebaseURL + "/leaders/" + $$.today() + "/" + options.id)
        },
        
        avatar: function() {
            return this.has('avatar') ? this.get('avatar') : this.has('fbAvatar') ? this.get('fbAvatar') : "/img/default-avatar.png";
        },
        
        points: function() {
            return this.has('points') ? this.get('points') : 0;
        }
        
    });
    
});
