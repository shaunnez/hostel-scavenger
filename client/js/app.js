// require.js configuration
require.config({
    baseUrl: 'js/lib',
    urlArgs: 'bust=1.0.1',
    paths: {
        app:            '../app',
        tpl:            '../tpl',
        lib:            '../lib',
        models:         '../app/models',
        collections:    '../app/collections',
        utils:          '../app/utils',
        views:          '../app/views',
        firebase:       'http://cdn.firebase.com/v0/firebase',
        firebase_login: 'https://cdn.firebase.com/v0/firebase-simple-login'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'backbone-firebase': {
            deps: ['backbone', 'firebase', 'firebase_login'],
            exports: 'BackboneFirebase'
        }
    }
});

// initialize require load
require(['jquery', 'utils/globals', 'backbone', 'app/router', 'backbone-firebase', 'fastclick', 'gmap'], function ($, $$, Backbone, Router) {
    // bind fastclick to remove 300ms delay on mobile devices
    FastClick.attach(document.body); 
    // initialize router
    var router = new Router();
    // backbone history tracking (hashtag)
    Backbone.history.start();
});