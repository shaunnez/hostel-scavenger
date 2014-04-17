
define(function (require) {
	  
    "use strict";

    var $           = require('jquery'),
        $$          = require('utils/globals'),
        Backbone    = require('backbone'),
        Hunt        = require('models/hunt');
    
    return Backbone.Collection.extend({
        
        model: Hunt,
        
        url: "http://hostelliving.getfreehosting.co.uk/json/get_page/?slug=options&callback=?",
        
        parse: function(data) {
            if(data && data.status == "ok") {
                var attachments = data.page.attachments;
                var images = {}
                for(var i = 0, j = attachments.length; i < j; i++) {
                    images[attachments[i].id] = attachments[i].images;
                }
                
                var custom_fields = data.page.custom_fields;
                var hunts = [];
                var huntsLength = parseInt(custom_fields["hunt"]);
                
                for(var i = 0, j = huntsLength; i < j; i++) {
                    var huntKey = "hunt_" + i;
                    var huntName = custom_fields[huntKey + "_hunt_name"][0];
                    var huntId = huntName.replace(/ /g, '').toLowerCase();
                    
                    var start = custom_fields[huntKey + "_start"][0];
                    var end = custom_fields[huntKey + "_end"][0];
                    
                    var startDate = new Date();
                    startDate.setHours(Number(start.split(":")[0]));
                    startDate.setMinutes(Number(start.split(":")[1]));
                    startDate.setSeconds(0);
                    
                    var endDate = new Date();
                    endDate.setHours(Number(end.split(":")[0]));
                    endDate.setMinutes(Number(end.split(":")[1]));
                    endDate.setSeconds(0);
                    
                    var challengeKey = huntKey + "_challenge";
                    var challengesLength = parseInt(custom_fields[challengeKey]); 
                    var taskKey = huntKey + "_task";
                    var tasksLength = parseInt(custom_fields[taskKey]); 
                    
                    var challenges = [];
                    var tasks = [];
                    for(var y = 0, z = challengesLength; y < z; y++) {
                        var cKey = challengeKey + "_" + y;
                        var challengeName = custom_fields[cKey + "_name"][0]
                        var challengeId = huntId + "_" + challengeName.replace(/ /g, '').toLowerCase();
                        
                        var fullLocation = custom_fields[cKey + "_location"][0];
                        var splitLocation = fullLocation.split("|");
                        
                        var challenge = {
                            id                  : challengeId.hashCode() + $$.today(),
                            name                : challengeName,
                            description         : custom_fields[cKey + "_description"][0],
                            points              : parseInt(custom_fields[cKey + "_points"][0]),
                            validatedPoints     : parseInt(custom_fields[cKey + "_validated_points"][0]),
                            gpsRange            : parseInt(custom_fields[cKey + "_gps_range"][0]),
                            touristInformation  : custom_fields[cKey + "_tourist_information"][0],
                            latitude            : splitLocation[1].split(",")[0],
                            longitude           : splitLocation[1].split(",")[1]
                        }
                                
                        if(custom_fields[cKey + "_image"]) {
                            challenge.image = images[Number(custom_fields[cKey + "_image"][0])];
                        }
                        
                        challenges.push(challenge);
                    }
                    
                    for(var y = 0, z = tasksLength; y < z; y++) {
                        var tKey = taskKey + "_" + y;
                        var taskName = custom_fields[tKey + "_name"][0]
                        var taskId = huntId + "_" + taskName.replace(/ /g, '').toLowerCase();
                        var task = {
                            id                  : taskId.hashCode() + $$.today(),
                            name                : taskName,
                            points              : parseInt(custom_fields[tKey + "_points"][0]),
                            validatedPoints     : parseInt(custom_fields[tKey + "_validated_points"][0]),
                            challengeName       : custom_fields[tKey + "_challenge_name"][0]
                        }
                        
                        tasks.push(task);
                    }
                    
                    var hunt = { id: huntId.hashCode(), name: huntName, start: startDate, end: endDate, challenges: challenges, tasks: tasks }
                    hunts.push(hunt);
                }
                return hunts;
            } else {
                return [];
            }
        },
        
        /*
        sortWayPointsByClosest: function(latLng) {
            var waypoints = this;
            function sortIt(a, b) {
                var latLngA = new google.maps.LatLng(a.latitude, a.longitude);
                var latLngB = new google.maps.LatLng(b.latitude, b.longitude);
                var distA = google.maps.geometry.spherical.computeDistanceBetween (latLng, latLngA);
                var distB = google.maps.geometry.spherical.computeDistanceBetween (latLng, latLngB);
                if(distA > distB) {
                    return 1;
                } else {
                    return -1;
                }
            }
            var sorted = waypoints.toJSON().sort(sortIt);
            return sorted;
        }
        */
        
    });
    
});


/*
var waypointsLength = parseInt(custom_fields.waypoint);

for(var i = 0, j = waypointsLength; i < j; i++) {
    var key = "waypoint_" + i;
    var tasksKey = key + "_tasks_";
    var clueLength = parseInt(custom_fields[key + "_clues"]);
    var tasksLength = parseInt(custom_fields[key + "_tasks"]);
    
    var fullLocation = custom_fields[key + "_location"][0];
    var splitLocation = fullLocation.split("|");
    var waypoint = {
        id                  : i,
        areaDescription     : custom_fields[key + "_area_description"][0],
        locationDescription : splitLocation[0], 
        latitude            : splitLocation[1].split(",")[0],
        longitude           : splitLocation[1].split(",")[1],
        clues               : [], 
        tasks               : [] 
    };
    for(var c = 0, d = clueLength; c < d; c++) {
        var cluesKey = key + "_clues_" + c;
        waypoint.clues.push({ 
            id: c,
            description: custom_fields[cluesKey + "_description"][0], 
            distance_to_clue_shown: parseFloat(custom_fields[cluesKey + "_distance_to_clue_shown"][0]), 
        })
    }
    
    for(var t = 0, u = tasksLength; t < u; t++) {
        var tasksKey = key + "_tasks_" + t;
        waypoint.tasks.push( { id: t, task : custom_fields[tasksKey + "_task"][0], points: Number(custom_fields[tasksKey + "_points"][0]) } )
    }
    waypoints.push(waypoint);
    */