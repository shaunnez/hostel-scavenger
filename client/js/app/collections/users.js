define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone'),
        User        = require('models/user');
    
    return Backbone.Firebase.Collection.extend({

        model: User,
        
        firebase: new Firebase($$.FirebaseURL + "/users")
        
    });
    
});
