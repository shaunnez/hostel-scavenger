/*********************************************************************************
	Dependencies
/********************************************************************************/
var path = require('path')
	, fs = require('fs')
    , http = require('http')
    , request = require('request')
	, moment = require('moment')
	, express = require('express')
/*********************************************************************************
	General Configuration & Exported Variables  
/********************************************************************************/
var env = process.argv.length > 2 ? process.argv[2].toLowerCase() : 'local'
	, port = process.env.PORT || 9876
	, clientPath = path.join(__dirname, '/client')

var app = exports.app = express()
/*********************************************************************************
	Express 
/********************************************************************************/
// server configuration
var configureServer = function () {  
	// general settings
    app.configure(function () {
        app.set('port', port);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('s3cr3t'));
        app.use(express.session({
			secret		: 's3cr3t'
            , cookie	: { maxAge: new Date(Date.now() + 864000000) } // one day
        }));
		
        app.use(app.router);
        app.use(express.static(clientPath));
    });
    // development settings
    app.configure('development', function () {
        app.use(express.errorHandler());
    });
    //production settings
    app.configure('production', function () {
        app.use(express.logger());
        app.use(express.errorHandler());
    });
}

/*********************************************************************************
    Express Server End Points    
	- sets up the route path end point and the catch all end point
	- loads individual routes from the routes/express folder  
/********************************************************************************/
var configureExpressEndPoints = function() {
    app.get("/", function (req, res) {
	    req.session.loginDate = new Date().getTime();
		res.sendfile(clientPath + "/index.html");
	});
	// capture everything else - setup 405 / 500 here
	app.use(function (req, res, next) {
        res.sendfile(clientPath + "/index.html");
    });
}

configureServer();
console.log("Express Server Configured");
configureExpressEndPoints();
console.log("Express End Points Configured");
httpServer = http.createServer(app).listen(port);
httpServer.on('connection', function(socket) { socket.setTimeout(60 * 10000);  })
console.log("Express Server Running on Port: " + port);
/*********************************************************************************
     End
/********************************************************************************/