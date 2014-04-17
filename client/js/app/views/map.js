define(function (require) {
    
    "use strict";
    
    var $               = require('jquery'),
        $$              = require('utils/globals'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        Locations       = require('collections/locations'),
        Location        = require('models/location'),
        BaseView        = require('views/base'),
        tpl             = require('text!tpl/map.html'),
        template        = _.template(tpl);

    return BaseView.extend({

        events: {
            
        }, 
        
        // initialize the view, add listeners to locations collection
        initialize: function (options) {
            this.events = _.extend({}, BaseView.prototype.events, this.events);
            this.user = options.user; 
            this.hunt = options.hunt;
            this.challenges = this.hunt.get('challenges');
            this.locations = new Locations();
            this.location = new Location({ id: this.user.id })
            this.location.set({ email: this.user.get('email'), username: this.user.get('username') })
            
            this.markers = {};
            this.challengeMarkers = {};
            this.users = {};
            this.render(); 
        },
        
        // render the template, setup variables to dom elements for later use
        render: function () {
            this.$el.html(template()); 
            this.$mapCanvas = this.$el.find("#map_canvas");
            this.$userList = this.$el.find("#user-list");
            return this;
        },
        
        // BaseView: post page slider transition method
        // setupMap here so it displays full width / height correctly
        // render inital location, bind event listeners
        postRender: function() {
            var scope = this;
            this.setupMap()
            if(this.locations.length > 0) {
                for(var i = 0, j = this.locations.length; i < j; i++) {
                    this.addLocation(this.locations.at(i));
                }
            }
            // listen to locations
            this.listenTo(this.locations, 'add', this.addLocation);
            this.listenTo(this.locations, 'remove', this.removeLocation);
            this.listenTo(this.locations, 'change', this.updateLocation);
            
            this.listenTo(this.user, 'all', this.renderChallenges);
        },
        
        // when we leave the view, destroy map markers and cleanup variables
        onClose: function() {
            var scope = this; 
            $$.hideNotificiation();
            this.map && this.myMarker && this.myMarker.setMap(null);
            this.map && this.map.Dispose && this.map.Dispose();
            _.each(this.locations, function(location) {
                scope.removeLocation(location);
            });
            this.markers = {};
            this.challengeMarkers = {};
            this.users = {};
            this.myMarker = null;
            this.map = null;
            this.bluedot = null;
            this.location.destroy({ success: function() { } });
            this.location = null;
            this.watchPosition && navigator && navigator.geolocation && navigator.geolocation.clearWatch(this.watchPosition);
            this.stopListening(this.locations)    
            this.stopListening(this.user, 'all', this.renderChallenges);
        },
        
        // create the google map
        // track location if smart phone, or if possible just plot the current position
        setupMap: function() {
            var scope = this;
            this.map = new google.maps.Map( this.$mapCanvas[0], { zoom: 14, mapTypeId: google.maps.MapTypeId.ROADMAP });
            if ( navigator && navigator.geolocation ) {
                // get the current position, display location, and center map
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        scope.displayLocation(position);
                        scope.map.setCenter(scope.myLatLng);
                        scope.renderChallenges();
                    }, function(error) {
                        scope.handleLocationError(error) 
                    }
                );
                // if we can track the position, keep updating it
                if ( navigator.userAgent && (navigator.userAgent.indexOf('iPhone') !== -1 || navigator.userAgent.indexOf('Android') !== -1) ) {
                    var options = { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000  }
                    this.watchPosition = navigator.geolocation.watchPosition( 
                        function(position) {
                            scope.displayLocation(position);
                        }, 
                        function(error) {
                            scope.handleLocationError(error) 
                        }, 
                        options
                    );
                }
            }
        },
        
        // output when we get a location error
        handleLocationError: function(error) {
            var errorMessage = [ 
                    'We are not quite sure what happened.',
                    'Sorry. Permission to find your location has been denied.',
                    'Sorry. Your position could not be determined.',
                    'Sorry. Timed out.'
            ];
            $$.notification("error", errorMessage[error.code]);
            console.log( errorMessage[ error.code ] );
        },
        
        // display current users location on google map
        displayLocation: function(position) {
            if(position && this.map && this.location) {
                // get location
                this.myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //this.myLatLng = new google.maps.LatLng(51.501689, -0.172782); 
                // update in database / firebase
                this.location.set({ latitude : position.coords.latitude, longitude: position.coords.longitude });
                //this.location.set({ latitude : 51.501689, longitude: -0.172782 });
                // create or move the marker
                if (!this.myMarker) {
                     this.myMarker = new google.maps.Marker({
                        flat: true,
                        icon: this.dotMarker('blue'),
                        map: this.map,
                        optimized: false,
                        position: this.myLatLng,
                        title: 'I might be here',
                        visible: true
                    });
                    // temporary, add user to list on side
                    //this.$userList.append("<li class='" + this.location.get('username') + "'><a>" + this.location.get('username') + "</a></li>");
                } else {
                    // move this marker
                    this.myMarker.setPosition(this.myLatLng);
                }
            }
        },
        
        // return a marker image based on the color paremeter
        dotMarker: function(color) {
            return new google.maps.MarkerImage(
                '/img/' + color + 'dot_retina.png', 
                null, // size
                null, // origin
                new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
                new google.maps.Size( 17, 17 ) // scaled size (required for Retina display icon)
            );
        },
        
        // add a location to the google map, use a red marker to show it's another user
        // also track the user in the users array, and add user to the user list
        addLocation: function(location) {
            if(location && this.user.id !== location.id && this.markers[location.id] == undefined) {
                // track locations
                this.markers[location.id] = new google.maps.Marker({
                    flat: true,
                    icon: this.dotMarker('red'),
                    map: this.map,
                    optimized: false,
                    position: new google.maps.LatLng(location.get("latitude"), location.get("longitude")),
                    title: 'I might be here',
                    visible: true
                });
                // track users
                this.users[location.id] = { email: location.get('email'), username: location.get('username') }; 
                //this.$userList.append("<li class='" + location.get('username') + "'><a>" + location.get('username') + "</a></li>");
            }
        },
        
        // remove a location from the map, markers and users array, and remove from the user list
        removeLocation: function(location) { 
            if(location) {
                var marker = this.markers[location.id];
                if(marker) {
                    marker.setMap(null);
                }
                this.markers[location.id] = null;
                this.users[location.id] = null;
                $.each(this.challengeMarkers, function(i, challengeMarker) {
                    challengeMarker.marker.setMap(null);
                    challengeMarker.circle.setMap(null);
                });
                //this.$userList.find("." + location.get('username')).remove();
            }
        },
        
        // occurs on a location change event
        // if it's not the current user, either create the marker if it doesn't exist, or mvoe the existing marker
        updateLocation: function(location) {
            if(this.user.id != this.id) {
                if(!this.markers[location.id]) {
                    this.addLocation(location);
                } else {
                    this.markers[location.id].setPosition(new google.maps.LatLng(location.get("latitude"), location.get("longitude")));
                }
            }
        },
        
        // render the challenge marker and circles
        renderChallenges: function() {
            for(var i = 0, j = this.challenges.length; i < j; i++) {
                var challenge = this.challenges[i];
                var userChallenge = this.getUserChallenge(challenge.id);
                var latLng = new google.maps.LatLng(challenge.latitude, challenge.longitude);
                var challengeMarker = this.challengeMarkers[challenge.id];
                if(challengeMarker) {
                    challengeMarker.marker.setMap(null);
                    challengeMarker.circle.setMap(null);
                }
                
                var circleData = { 
                    strokeColor: '#FF0000', strokeOpacity: 0.6, strokeWeight: 2,
                    fillColor: '#FF0000', fillOpacity: 0.25,
                    map: this.map, center: latLng, radius: challenge.gpsRange
                }
                if(userChallenge && userChallenge.state && userChallenge.state == "pending") {
                    circleData.strokeColor = "blue";
                    circleData.fillColor = "blue";
                } else if(userChallenge && userChallenge.state && userChallenge.state == "complete") {
                    circleData.strokeColor = "green";
                    circleData.fillColor = "green";
                } 
                var circle = new google.maps.Circle(circleData);
                var marker = new google.maps.Marker({ map: this.map, position: latLng, title : challenge.id.toString() });
                google.maps.event.addListener(marker, 'click', function(d) {
                    window.location = "#challenges/" + this.title;
                });
                this.challengeMarkers[challenge.id] = { marker : marker, circle: circle };
            }
        },
        
        getUserChallenge: function(id) {
            var userChallenge = {}; 
            this.userChallenges = this.user.challenges();
            for(var i = 0, j = this.userChallenges.length; i < j; i++) {
                var challenge = this.userChallenges[i];
                if(challenge.id == id) {
                    console.log('found challenge');
                    userChallenge = challenge;
                    break;
                }
            }
            return userChallenge;
        }
        
    });

});