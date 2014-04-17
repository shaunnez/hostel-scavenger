define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone'),
        Leader      = require('models/leader');
    
    return Backbone.Firebase.Collection.extend({

        initialize: function(options) {
            var options = options || {};
            if(options.limit) {
                this.firebase = new Firebase($$.FirebaseURL + "/leaders/" + $$.today()).limit(options.limit);
            } else {
                this.firebase = new Firebase($$.FirebaseURL + "/leaders/" + $$.today())
            }
        },
        
        model: Leader
    });
    
});
