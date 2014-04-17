define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/menu.html'),
        template    = _.template(tpl);

    return BaseView.extend({

        events: {
            
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.hunt = options.hunt;
            this.render(); 
            this.runCountdown();
        },

        render: function () {
            this.$el.html(template());
            this.$title = this.$el.find("#header .title");
            this.$loader = this.$el.find(".loader");
            this.$menuBtns = this.$el.find("#menu-container .btn");
            return this;
        },
        
        postRender: function() {
            
        },
        
        onClose: function() {
            this.stopCountdown();
        },
        
        runCountdown: function() {
            var scope = this;
            this.state = this.handleTime();
            this.handleState(scope.state);
            this.timeout = setTimeout(function() {
                scope.runCountdown();
            }, 1000);
        },
        
        stopCountdown: function() {
            clearTimeout(this.timeout);  
        },
        
        
        handleTime: function() {
            var now = new Date();
            var timeToStart = this.hunt.get('start') - now;
            var timeToEnd = this.hunt.get('end') - now;
            if(timeToStart > 0) {
                this.$title.text("Start in " + this.countdownTimer(timeToStart));
                return "pending";
            } else if(timeToEnd >= 0) {
                this.$title.text("Ends in " + this.countdownTimer(timeToEnd));
                return "running";
            } else {
                this.$title.text("Hunt Finished");
                return "complete";
            }
        },
        
        handleState: function(state) {
            this.enableMenu();
            if(state == "running") {
                this.enableMenu();
            } else if (state == "pending") {
             //   this.disableMenu();
            } else {
             //   this.disableMenu();
                this.stopCountdown();
            }
            
        },
        
        countdownTimer: function(millies){
            var hours = Math.floor(millies / 36e5),
                mins = Math.floor((millies % 36e5) / 6e4),
                secs = Math.floor((millies % 6e4) / 1000);
            
            hours = hours < 10 ? "0" + hours : hours;
            mins = mins < 10 ? "0" + mins : mins;
            secs = secs < 10 ? "0" + secs : secs;
            return hours + ':' + mins + ':' + secs;
        },
        
        disableMenu: function() {
            $.each(this.$menuBtns, function(i, btn) {     
                var $elm = $(btn);
                $elm.data("link", $elm.attr('href'));
                $elm.attr("href", "javascript:;");
                $elm.addClass("disabled");
            })
        },
        
        enableMenu: function() {
            $.each(this.$menuBtns, function(i, btn) {   
                var $elm = $(btn);
                $elm.attr("href", $elm.data('link'));
                $elm.removeClass("disabled");
            })
            
        }

    });

});