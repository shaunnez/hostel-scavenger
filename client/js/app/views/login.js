define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/login.html'),
        template    = _.template(tpl);

    return BaseView.extend({

        events: {
            'click #btnLogin'               : 'loginClick',
            'click #btnFacebook'            : 'loginFacebook',
            'click #btnTwitter'             : 'loginTwitter',
            'click #btnRegister'            : 'registerClick',
            'keypress #txtPassword'         : 'processKey',
            'keypress #txtConfirmPassword'  : 'processKey'
        }, 
        
        initialize: function (options) {
            this.auth = options.auth;
            this.render(); 
        },

        render: function () {
            this.$el.html(template());
            this.$email = this.$el.find("#txtEmail");
            this.$password = this.$el.find("#txtPassword");
            this.$confirmPasswordContainer = this.$el.find(".confirm-password");
            this.$confirmPassword = this.$el.find("#txtConfirmPassword");
            return this;
        },
        
        loginClick: function() {
            var email = this.$email.val(),
                password = this.$password.val();
            
            if(!$$.isEmail(email)) {
                $$.notification("error", "Please enter in a valid email");
                return;
            }
            
            if(password.length <= 6) {
                $$.notification("error", "Please make sure your password length is greater than 6 characters");
                return;
            }
            
            this.login(email, password);
        },
        
        login: function(email, password) {
            $$.notification("info", "Logging in: " + email, true);
            var data = { email : email, password: password }
            this.auth.login('password', data);
        },
        
        loginFacebook: function() {
            this.auth.login('facebook', { scope: 'email' });
        },
        
        loginTwitter: function() {
            this.auth.login('twitter');
        },
        
        registerClick: function() {
            if(this.$confirmPasswordContainer.css('display') == "none") {
                this.$confirmPasswordContainer.fadeIn();
                return;
            }
            
            var email = this.$email.val(),
                password = this.$password.val(),
                confirmPassword = this.$confirmPassword.val();
            
            if(!$$.isEmail(email)) {
                $$.notification("error", "Please enter in a valid email");
                return;
            }
            
            if(password.length <= 6) {
                $$.notification("error", "Please make sure your password length is greater than 6 characters");
                return;
            }
            
            if(password !== confirmPassword) {
                $$.notification("error", "Please make sure both passwords are the same");
                return;
            }
            
            this.register(email, password);
        },
        
        register: function(email, password) {
            $$.notification("info", "Registering: " + email, true);
            var me = this;
            this.auth.createUser(email, password, function(error, user) {
                if (!error) {
                    me.login(email, password);
                } else {
                    $$.notification("error", error);
                }
            });
        },
        
        processKey: function(e) {
            if(e.which === 10 || e.which === 13) {
                if(this.$confirmPasswordContainer.css('display') == "none") {
                    this.loginClick();
                } else {
                    this.registerClick();
                }
                return false;
            }
        }
        
    });

});