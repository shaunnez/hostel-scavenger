define(function (require) {
    
    "use strict";
    
    var $           = require('jquery'),
        $$          = require('utils/globals'),
        ps          = require('utils/PageSlider'),
        BaseRouter  = require('app/baseRouter'),
        Backbone    = require('backbone');

    return BaseRouter.extend({ 

        container : $("#main-container"),
        
        routes: { 
            "logout"            : "logout",
            "login"             : "login",
            "menu"              : "menu",
            "challenges"        : "challenges",
            "challenges/:id"    : "challenge",
            "tasks"             : "tasks",
            "leaderboard"       : "leaderboard",
            "profile"           : "profile",
            "map"               : "map",
            "messages"          : "messages",
            "*actions"          : "menu"
        },
        
        // before going to any route, check we are authenticated via Firebase
        // scope.auth is a callback which happens on the login page
        before: function(params, next) {
            var scope = this;
            if(!scope.auth) {
                scope.firebaseLogin(next);
            } else {
                return next();
            }
        },

        // create new firebase login, function is a callback for the login method
        firebaseLogin: function(next) {
            var scope = this;
            scope.auth = new FirebaseSimpleLogin($$.connection(), function(err, fbUser) {
                if(!err && fbUser) { 
                    scope.loadUser(fbUser, function() {
                        scope.loadHunts(function() {
                            return next(); 
                        });
                    });
                } else if (!err) {
                    scope.login();
                } else {
                    $$.notification("error", err);
                }
            });
        },
        
        // load user data based on firebase user and leader
        loadUser: function(fbUser, callback) {
            var scope = this;
            require(["models/user", "models/leader"], function (User, Leader) {
                scope.user = new User({ id : fbUser.id });
                scope.leader = new Leader({ id : fbUser.id });
                var data = {};
                if(fbUser.provider == "facebook") {
                    data = { uid: fbUser.uid, email: fbUser.email, username: fbUser.username, fbAvatar: "http://graph.facebook.com/" + fbUser.id + "/picture?width=250&height=250" };
                } else if(fbUser.provider == "twitter") {
                    data = { uid: fbUser.uid, email: fbUser.username + "@twitter.com", username: fbUser.username, fbAvatar: fbUser.profile_image_url };
                } else {
                    data = { uid: fbUser.uid, email: fbUser.email, username: fbUser.email.split("@")[0] };
                }
                scope.user.set(data);
                scope.leader.set({ username: data.username })
                if(data.fbAvatar) {
                    scope.leader.set({ fbAvatar: data.fbAvatar });
                }
                callback();
            })
        },
        
        // load waypoints and sort by location
        loadHunts: function(callback) {
            var scope = this;
            this.requestHunts(function(data) {
                if(!data) {
                    $$.notification("error", "Error fetching scavenger hunts", false);
                    callback();
                } else {
                    scope.hunts = data;
                    scope.hunt = data.at(0);
                    // request google maps data
                    if(navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function(position) {
                                
                            }, function(error) {
                                $$.notification("error", "Error geolocation", false);
                            }
                        );
                    }
                    callback();
                }
            });
        },
        
        // load hunts from wordpress URL or use local copy
        requestHunts: function(callback) {
            var scope = this;
            require(["collections/hunts"], function(Hunts) {
                var hunts = new Hunts();
                hunts.fetch({ 
                    dataType: 'jsonp', 
                    success: function(data) {
                        callback(data);
                    },
                    error: function(data) {
                        hunts.url = "/json/start.json";
                        hunts.fetch({ 
                            success: function(data) {
                                callback(data);
                            },
                            error: function(data) {
                                callback(null);
                            },
                        });
                    }
                });
            });
        },
        
  
        // check authentication
        // initialize PageSlider for transitions between views
        // Slide to new page, run any close on old view, run postRender on new view
        loadView: function(view) {
            var scope = this;
            if(!scope.slider) {
                scope.slider = new PageSlider(scope.container);
            } 
            this.slider.slidePage($(view.el), function() {
                scope.currentView && scope.currentView.close() && scope.currentView.remove();
                scope.currentView = view;
                scope.currentView && scope.currentView.postRender();
            })
        },
        
        // logout, take to login view
        logout: function() {
            var scope = this;
            $$.notification("info", "Logging out", true, null, function() {
                scope.auth && scope.auth.logout();
                scope.user = null;
                scope.navigate("#", { trigger: true, replace: true });
            });
        },
        
        // login view
        login: function () {
            var scope = this;
            require(["app/views/login" ], function (LoginView) {
                scope.loadView( new LoginView({ auth : scope.auth }));
            });
        },
    
        // home view
        home: function() {
            var scope = this;
            require(["app/views/home"], function (HomeView) {
                scope.loadView( new HomeView({ user: scope.user }));
            }); 
        },
        
        // menu view
        menu: function(id) {
            var scope = this;
            require(["app/views/menu"], function (MenuView) {
                scope.loadView( new MenuView({ user: scope.user, hunt: scope.hunt }));
            }); 
        },
        
        // challenges view
        challenges: function() {
            var scope = this;
            require(["app/views/challenges"], function (ChallengesView) {
                scope.loadView( new ChallengesView({ user: scope.user, hunt: scope.hunt }));
            }); 
        },
        
        // challenge view
        challenge: function(id) {
            var scope = this;
            require(["app/views/challenge"], function (ChallengeView) {
                scope.loadView( new ChallengeView({ user: scope.user, leader: scope.leader, hunt: scope.hunt, challengeId: id }));
            }); 
        },
        
        // tasks view
        tasks: function() {
            var scope = this;
            require(["app/views/tasks"], function (TasksView) {
                scope.loadView( new TasksView({ user: scope.user, leader: scope.leader, hunt: scope.hunt }));
            }); 
        },
        
        // leaderboard view
        leaderboard: function() {
            var scope = this;
            require(["app/views/leaderboard" ], function (LeaderboardView) {
                scope.loadView( new LeaderboardView({ user: scope.user, hunt: scope.hunt }));
            }); 
        },
        
        // profile view
        profile: function() {
            var scope = this;
            require(["app/views/profile" ], function (ProfileView) {
                scope.loadView( new ProfileView({ user: scope.user }));
            }); 
        },
        
        // map view
        map: function() {
            var scope = this;
            require(["app/views/map"], function (MapView) {
                scope.loadView( new MapView({ user: scope.user, hunt: scope.hunt}));
            }); 
        },
        
        // messages view
        messages: function() {
            var scope = this;
            require(["app/views/messages", "collections/messages" ], function (MessagesView, Messages) {
                if(!scope.chatMessages) { scope.chatMessages = new Messages({ limit: 50 }); }
                scope.loadView( new MessagesView({ user: scope.user, messages: scope.chatMessages }) );
            }); 
        },
        
    });

});