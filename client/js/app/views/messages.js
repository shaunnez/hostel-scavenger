define(function (require) {
    
    "use strict";
    
    var $               = require('jquery'),
        $$              = require('utils/globals'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        Message         = require('models/message'),
        BaseView        = require('views/base'),
        tpl             = require('text!tpl/messages.html'),
        msgTpl          = require('text!tpl/message.html'),
        messageTemplate = _.template(msgTpl),
        template        = _.template(tpl);

    return BaseView.extend({

        events: {
            'focus #txtChatMessage'     : 'scrollBottom', 
            'click #btnSend'            : 'sendMessage'
        }, 
        
        // initialize the view
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.user = options.user;           // model
            this.messages = options.messages;   // collection
            this.render(); 
        },

        // render the template, bind variables to dom elements
        render: function () {
            this.$el.html(template());
            this.$messages = this.$el.find(".messages-container");
            this.$txtMessage = this.$el.find("#txtChatMessage");
            return this;
        },
        
        // BaseView: post page slider transition method
        // render existing messages, bind listener to new messages
        postRender: function() {
            if(this.messages.length > 0) {
                for(var i = 0, j = this.messages.length; i < j; i++) {
                    this.addMessage(this.messages.at(i));
                }
            }
            this.listenTo(this.messages, 'add', this.addMessage);
        },
        
        // stop listening to messages
        onClose: function() {
            this.stopListening(this.messages)
        },
        
        // calculate whether to auto scroll the user to the bottom
        // test: at top of list (on initialize) or we are within a certain distance from the bottom of the list
        autoScroll: function() {
            var doScroll = false,
                scrollTop = this.$messages.scrollTop(),
                scrollHeight = this.$messages.get(0).scrollHeight,
                containerHeight = this.$messages.height(),
                variance = 500; 
            
            var scrollTest = containerHeight >= (scrollHeight - scrollTop - variance);
            if(scrollTop == 0 || scrollTest) {
                doScroll = true;
            }
            return doScroll;
        },
        
        // add message to dom based on template, scroll if applicable
        addMessage: function(message) {
            this.$messages.append( messageTemplate( { user: this.user, message: message } ) );
            this.$messages.stop();
            if(this.autoScroll()) {
                this.scrollBottom();
            }
        },
        
        // actual method to scroll to bottom
        scrollBottom: function() {
            this.$messages.scrollTop(this.$messages.get(0).scrollHeight);
        },
        

        // validate message, add to collection, clear input
        // automatically to dom added on collection update
        sendMessage: function(e) {
            e && e.preventDefault();
            if(this.$txtMessage.val() !== "") {
                if(this.$txtMessage.val().length > 450) {
                    $$.notification("error", "Please only sent up to 450 characters in your message");
                    return false;
                }
                var scope = this;
                this.messages.add(new Message({ userid: this.user.id, email: this.user.get('email'), username: this.user.get('email'), avatar: this.user.avatar(), body: this.$txtMessage.val() }) );
                this.$txtMessage.val("");
            }
            return false;
        },
        
    });

});