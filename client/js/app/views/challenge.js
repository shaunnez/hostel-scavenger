define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        BaseView    = require('views/base'),
        tpl         = require('text!tpl/challenge.html'),
        template    = _.template(tpl);

    return BaseView.extend({

        events: {
            
        }, 
        
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.hunt = options.hunt;
            this.challengeId = options.challengeId;
            this.user = options.user;
            this.leader = options.leader;
            this.challenges = this.hunt.get('challenges');
            this.challenge = this.getChallenge(options.challengeId, this.challenges);
            this.currentWaypointLatLng = new google.maps.LatLng(this.challenge.latitude, this.challenge.longitude)
            this.render(); 
        },

        render: function () {
            this.$el.html(template( { challenge: this.challenge } ));
            this.$optionsContainer = this.$el.find("#options");
            this.$inlineFile = this.$el.find(".inline-file");
            this.$canvas = this.$el.find("#challenge-canvas");
            this.ctx = this.$canvas[0].getContext('2d');
            return this;
        },
        
        postRender: function() {
            this.listenTo(this.user, 'change', this.renderValidate);
            var scope = this;
            var url = this.challenge.image ? this.challenge.image.medium.url : this.getStaticMapUrl();
            var image = new Image();
            image.onload = function() { 
                scope.$optionsContainer.removeClass("loader").html(image); 
                scope.renderValidate() 
            };
            image.src = url;
            this.updateMyLatLong();
        }, 
        
        onClose: function() {
            this.stopListening(this.user, 'change', this.renderValidate);
            this.$el.find("#challengeImagePicker").off("click"); 
            this.$el.find("#challengeImagePicker").off("change"); 
            clearTimeout(this.timeout);
        },
        
        // update lat long every 30 seconds
        updateMyLatLong: function() {
            var scope = this;
            this.getPosition(function(position) {
                scope.myLatLng =new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                clearTimeout(scope.timeout);
                scope.timeout = setTimeout(function() {
                    scope.updateMyLatLong();
                }, 30000);
            });
        },
        
        renderValidate: function() {
            var scope = this;
            var userChallenges = this.user.challenges();  
            var userChallenge = this.getChallenge(this.challengeId, userChallenges);
            var state = userChallenge && userChallenge.state != undefined ? userChallenge.state : "incomplete";
            if(state == "incomplete") {
                var theHTML = '<input id="challengeImagePicker" type="file" class="file" accept="image/*;capture=camera" capture="camera"  /> <span class="btn btn-success btn-info btn-block">VALIDATE</span>';
                this.$inlineFile.html(theHTML);
                this.$el.find("#challengeImagePicker").on("click", function(e) { scope.checkPosition(e) });
                this.$el.find("#challengeImagePicker").on("change", function(e) { scope.uploadChallenge(e) }); 
            } else {
                this.$el.find("#challengeImagePicker").remove().off('change').off('click');
                this.$inlineFile.find(".btn").removeClass('btn-info').text("VALIDATED");
            }
        },
        
        getChallenge: function(id, challengeList) {
            var challenge = {};
            for(var i = 0, j = challengeList.length; i < j; i++) {
                if(challengeList[i].id.toString() == id.toString()) {
                    challenge = challengeList[i];
                    break;
                }
            }
            return challenge;
        },
                   
        getStaticMapUrl: function() {
            var height = this.$optionsContainer.height();
            var width = this.$optionsContainer.width();
            if(height == 0) { height = 320; }
            if(width == 0) { width=320; }
            var url = "http://maps.googleapis.com/maps/api/staticmap?sensor=true&scale=2&zoom=13";
            url += "&size=" + width + "x" + height;
            url += "&center=" + this.challenge.latitude + "," + this.challenge.longitude;
            url += "&markers=color:red%7Ccolor:red%7Clabel:C%7C" + this.challenge.latitude + "," + this.challenge.longitude;
           
            return url;
        },
        
        // check user is close enough to waypoint
        checkPosition: function(e) {
            var distanceToShow = this.distanceBetweenTwoPoints(this.myLatLng, this.currentWaypointLatLng);
            if(this.challenge.gpsRange > distanceToShow) {
                return true;
            } else {
                $$.notification("error", "You are not close enough to the waypoint!");
                e.preventDefault();
                return false;
            }
        },
        
        uploadChallenge: function(e) {
            var scope = this;
            var files = e.target.files;
            var $inlineFiles = this.$inlineFile;
            if (files.length > 0) {
                var file = files[0];
                var FR= new FileReader();
                FR.onload = function(e) {
                    var data = e.target.result;
                    var challenge = _.clone(scope.challenge);
                    challenge.state = "pending";
                    challenge.image = scope.resizeImageCanvas(data);
                    challenge.date = $$.today();
                    var points = scope.leader.points() + challenge.points;
                    // update user tasks
                    var clonedUserChallenges = _.clone(scope.user.challenges());
                    clonedUserChallenges.push(challenge);
                    scope.user.set({ 'challenges': clonedUserChallenges });
                    // update leader points
                    scope.leader.set({ 'points' :  points });
                    scope.renderValidate();
                    $$.notification("success", "Successfully sent photo");
                };       
                FR.readAsDataURL( file );
            } 
        
            e.preventDefault();
            return false;
        },
        
        resizeImageCanvas: function(data) {
            var img = new Image();
            img.src = data;
            var MAX_WIDTH = 800;
            var MAX_HEIGHT = 600;
            var width = img.width;
            var height = img.height;
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            this.$canvas[0].width = width;
            this.$canvas[0].height = height;
            this.ctx.drawImage(img, 0, 0, width, height);
            return this.$canvas[0].toDataURL("image/jpeg", 0.7);
        },
  
        getPosition: function(callback) {
            if ( navigator && navigator.geolocation ) {
                // get the current position, display location, and center map
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        callback(position)
                    }, function(error) {
                        callback(false);
                    }
                );
            } else {
                callback(false) 
            }
        },
        
        // use google maps library to compute the distance between two points in meters
        distanceBetweenTwoPoints: function(latLngA, latLngB) {
            return google.maps.geometry.spherical.computeDistanceBetween (latLngA, latLngB);
        }

    });

});