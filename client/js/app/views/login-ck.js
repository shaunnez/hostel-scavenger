define(function(e){"use strict";var t=e("jquery"),n=e("utils/globals"),r=e("underscore"),i=e("backbone"),s=e("views/base"),o=e("text!tpl/login.html"),u=r.template(o);return s.extend({events:{"click #btnLogin":"loginClick","click #btnFacebook":"loginFacebook","click #btnTwitter":"loginTwitter","click #btnRegister":"registerClick","keypress #txtPassword":"processKey","keypress #txtConfirmPassword":"processKey"},initialize:function(e){this.auth=e.auth;this.render()},render:function(){this.$el.html(u());this.$email=this.$el.find("#txtEmail");this.$password=this.$el.find("#txtPassword");this.$confirmPasswordContainer=this.$el.find(".confirm-password");this.$confirmPassword=this.$el.find("#txtConfirmPassword");return this},loginClick:function(){var e=this.$email.val(),t=this.$password.val();if(!n.isEmail(e)){n.notification("error","Please enter in a valid email");return}if(t.length<=6){n.notification("error","Please make sure your password length is greater than 6 characters");return}this.login(e,t)},login:function(e,t){n.notification("info","Logging in: "+e,!0);var r={email:e,password:t};this.auth.login("password",r)},loginFacebook:function(){this.auth.login("facebook",{scope:"email"})},loginTwitter:function(){this.auth.login("twitter")},registerClick:function(){if(this.$confirmPasswordContainer.css("display")=="none"){this.$confirmPasswordContainer.fadeIn();return}var e=this.$email.val(),t=this.$password.val(),r=this.$confirmPassword.val();if(!n.isEmail(e)){n.notification("error","Please enter in a valid email");return}if(t.length<=6){n.notification("error","Please make sure your password length is greater than 6 characters");return}if(t!==r){n.notification("error","Please make sure both passwords are the same");return}this.register(e,t)},register:function(e,t){n.notification("info","Registering: "+e,!0);var r=this;this.auth.createUser(e,t,function(i,s){i?n.notification("error",i):r.login(e,t)})},processKey:function(e){if(e.which===10||e.which===13){this.$confirmPasswordContainer.css("display")=="none"?this.loginClick():this.registerClick();return!1}}})});