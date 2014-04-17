define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/challenges.html'),
        template    = _.template(tpl);

    return BaseView.extend({

        events: {
            
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.hunt = options.hunt;
            this.challenges = this.hunt.get('challenges');
            this.render(); 
        },

        render: function () {
            this.$el.html(template({ challenges: this.challenges } ));
            return this;
        },
        
        postRender: function() {
        
        },
        
        onClose: function() {
            
        }
    });

});