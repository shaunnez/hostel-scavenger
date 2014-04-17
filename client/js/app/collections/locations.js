define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone'),
        Location    = require('models/location');
    
    return Backbone.Firebase.Collection.extend({

        initialize: function(options) {
            var options = options || {};
            if(options.limit) {
                this.firebase = new Firebase($$.FirebaseURL + "/locations/" + $$.today()).limit(options.limit);
            } else {
                this.firebase = new Firebase($$.FirebaseURL + "/locations/" + $$.today())
            }
        },
        
        model: Location
        
        
    });
    
});
