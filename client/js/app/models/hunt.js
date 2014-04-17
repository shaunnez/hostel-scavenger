define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone');
    
    return Backbone.Model.extend({

        initialize: function(options) {
            
        },
        /*
        getClosestClue: function(seenClues, distance) {
            var clue = {};
            for(var i = 0, j = this.get('clues').length; i < j; i++) {
                var loopClue = this.get('clues')[i];
                if(!clue.distance_to_clue_shown) {
                    clue = loopClue;
                } else {
                    var diff1 = distance - loopClue.distance_to_clue_shown;
                    var diff2 = distance - clue.distance_to_clue_shown;
                    if(Math.abs(diff1) < Math.abs(diff2)) {
                        if(seenClues.indexOf(clue.id) == -1) {
                           clue = loopClue;
                        }
                    }
                }
            }
            return clue;
        }
        */
    });
    
});