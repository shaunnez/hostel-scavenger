define(function (require) {
    
    "use strict";
    
    var $               = require('jquery'),
        $$              = require('utils/globals'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        BaseView        = require('views/base'),
        Leaders         = require('collections/leaders'),
        tpl             = require('text!tpl/leaderboard.html'),
        leaderTpl       = require('text!tpl/leader.html'),
        leaderTemplate  = _.template(leaderTpl),
        template        = _.template(tpl);

    return BaseView.extend({

        events: {
            
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.leaders = new Leaders();
            this.leaders.comparator = function(a, b) { 
                var result = 0;
                if(a.points() > b.points()) {
                    return -1;
                } else if(a.points() < b.points()) {
                    return 1;
                } else {
                    return 0;
                }
            }
            this.fading = false;
            this.render(); 
        },

        render: function () {
            this.$el.html(template());
            this.$tbody = this.$el.find("tbody");
            return this; 
        },
        
        postRender: function() {
            this.listenTo(this.leaders, 'change', this.sortLeaders);
            this.listenTo(this.leaders, 'sort', this.renderLeaders);
            if(this.leaders.length > 1) { 
                this.sortLeaders(); 
            } else if(this.leaders.length == 1) {
                this.renderLeaders();
            }
        },
        
        sortLeaders: function() {
            this.leaders.sort();    
        },
        
        renderLeaders: function() {
            var scope = this;
            var output = "";
            for(var i = 0, j = this.leaders.length; i < j; i++) {
                var leader = this.leaders.at(i);
                output += leaderTemplate({ leader: leader });
            }
            clearTimeout(this.timeout);
            scope.$tbody.fadeOut();
            this.timeout = setTimeout(function() {
                scope.$tbody.html(output).fadeIn()
            }, 500);
        },
        
        onClose: function() {
            this.stopListening(this.leaders);
            
        }
    });

});