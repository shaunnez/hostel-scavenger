define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone')
    
    return Backbone.Firebase.Model.extend({

        initialize: function(options) {
            this.firebase = new Firebase($$.FirebaseURL + "/locations/" + $$.today() + "/" + options.id)
        }
        
    });
    
});
