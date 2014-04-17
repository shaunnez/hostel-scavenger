define(function (require) {

    "use strict";
    
    String.prototype.hashCode = function(){
        if (Array.prototype.reduce){
            return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
        } 
        var hash = 0;
        if (this.length === 0) return hash;
        for (var i = 0; i < this.length; i++) {
            var character  = this.charCodeAt(i);
            hash  = ((hash<<5)-hash)+character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    
    var $ = require('jquery');
    
    var $$ = {
        // base firebase URL - should be setup in a config fiel
        FirebaseURL : "https://uksntest.firebaseIO.com",
        
        // utility method to get today
        today: function() {
            var now = new Date();
            var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var timestamp = startOfDay / 1000;
            return timestamp;
        },
        
        // utility method to validate email address
        isEmail: function(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        },
        
        // firebase connection method, returns root firebase reference
        connection : function() {
            if(this.dbRef) {
                return this.dbRef;
            } else {
                return new Firebase(this.FirebaseURL); 
            }
        },
        
        
        // type: info, warning, error, success
        notification : function(type, message, showProgress, slow, callback) {
            var me = this;
            if(!this.$notification) {
                this.$notification = $(".tn-box");
                this.$notificationTxt = this.$notification.find("p");
                this.$notificationIcon = this.$notification.find("i");
                this.$notificationProgress = this.$notification.find(".tn-progress");
            }
            
            if(this.$notification.length == 0) {
                return;
            }
            this.$notificationIcon.removeClass("fa-info-circle fa-warning fa-fire fa-check");
            if(type == "info") {
                this.$notificationIcon.addClass("fa-info-circle"); 
            } else if (type == "warning") {
                this.$notificationIcon.addClass("fa-warning");
            } else if (type == "error") {
                this.$notificationIcon.addClass("fa-fire");
            } else if (type == "success") {
                this.$notificationIcon.addClass("fa-check");
            }
            
            this.$notificationTxt.html(message);
            
            this.$notificationProgress.hide();
            if(showProgress == true) {
                this.$notificationProgress.show();
            }
            
            clearTimeout(me.time);
            me.time = setTimeout(function() {
                if(slow) {
                    me.$notification.addClass("tn-box-long " + type);
                } else {
                    me.$notification.addClass("tn-box-active " + type);
                }
            }, 0);
            
            this.callbackCounter = 0;
            this.$notification.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
                setTimeout(function() {
                    me.$notification.removeClass("info warning error success tn-box-active tn-box-long")
                }, 1000);
                if(me.callbackCounter == 0) {
                    if(callback) {
                        callback();
                    }
                }
                me.callbackCounter = 1;
            });
        },
        
        hideNotificiation: function() {
            if(!this.$notification) {
                this.$notification = $(".tn-box");
            }
            this.$notification.removeClass("info warning error success tn-box-active tn-box-long")
        }
    }
    
    return $$;
});