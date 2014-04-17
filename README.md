hostel-scavenger
================

HTML5 Mobile app using wordpress as its static data source and firebase as the realtime data sources. 

Built to allow group scavenger hunts over a mobile interface. Utilizing real-time functionality, users can chat, find specific tasks and objectives, gain points, and monitor a leaderboard.

Real-time functionality through firebase includes chat, gps - plotting of logged in users. Loads static data from wordpress using custom fields and JSONP ( if no wordpress, uses local json file ).

Nice mobile optimzied interface using google maps, hardware accelerated transitions and font-awesome icons. 

Very basic node.js server included to run locally for testing (node server.js). Client side code lives in client folder.

Developed using the code-kit IDE and bourbon.io scss compiler. Uses require.js to compile and load the javascript libraries, and backbone models/collections/views

JS Libraries used:

	- async (powerful functions for asynchronous JS development) https://github.com/caolan/async
	- backbone (small library, mv* structure) http://backbonejs.org/
	- backbone-firebase (extension for backbone to connect collections and models to firebase)
	- fastclick (removes long delay on mobile devices when tapping)
	- firebase (real-time free backend service)
	- gmap (used to load google maps via require.js)
	- jquery (needs no explaining)
	- require.js, text.js (loading of javascript libraries, compiling as well)
	- underscore (used with backbone.js, utility library for dealing with models and collections)
	
CSS Libraries used:

	- bootstrap (but only a very very small part of it, reset, buttons, grid)
	- font-awesome (beautiful icons loaded through css)
	
Demo link:
	http://www.onlinetrix.co.uk/hostel-scavenger/