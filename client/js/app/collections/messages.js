define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone'),
        Message     = require('models/message');
    
    return Backbone.Firebase.Collection.extend({

        initialize: function(options) {
            var options = options || {};
            if(options.limit) {
                this.firebase = new Firebase($$.FirebaseURL + "/messages/" + $$.today()).limit(options.limit);
            } else {
                this.firebase = new Firebase($$.FirebaseURL + "/messages/" + $$.today())
            }
        },
        
        model: Message
        
        
    });
    
});
