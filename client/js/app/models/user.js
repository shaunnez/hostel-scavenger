define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone');
    
    return Backbone.Firebase.Model.extend({

        initialize: function(options) {
            this.firebase = new Firebase($$.FirebaseURL + "/users/" + options.id )
        },
        
        avatar: function() {
            return this.has('avatar') ? this.get('avatar') : this.has('fbAvatar') ? this.get('fbAvatar') : "/img/default-avatar.png";
        },
        
        tasks: function() {
            return this.has('tasks') ? this.get('tasks') : [];
        },
        
        challenges: function() {
            return this.has('challenges') ? this.get('challenges') : [];
        },
        
        points: function() {
            return this.has('points') ? this.get('points') : 0;
        }
        
    });
    
});
