'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
    flash = require('connect-flash'),
    config = require('./config'),
    consolidate = require('consolidate'),
    path = require('path'),
    dbSettings = require('../db-settings.js'),
    lockSettings = require('../record-lock-settings.js'),
    _ = require('lodash'),
    q = require('q');


module.exports = function (db) {
    // Initialize express app
    var app = express();

    // Globbing model files
    config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
        require(path.resolve(modelPath));
    });

    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.facebookAppId = config.facebook.clientID;
    app.locals.jsFiles = config.getJavaScriptAssets();
    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    // TODO: change for production
    app.set('showStackError', true);

    // Set swig as the template engine
    app.engine('server.view.html', consolidate[config.templateEngine]);

    // Set views path and view engine
    app.set('view engine', 'server.view.html');
    app.set('views', './app/views');

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }


    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    // Express MongoDB session storage

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: new mongoStore({
            mongooseConnection: db.connection,
            collection: config.sessionCollection,
            url: "mongodb://mongodb"
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // connect flash for flash messages
    app.use(flash());

    // Use helmet to secure Express headers
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    // TODO: require authentication to serve private angular modules?
    app.use(express.static(path.resolve('./public')));


    // Globbing routing files
    config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        // TODO: remove for production
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    if (process.env.NODE_ENV === 'secure') {
        // Log SSL usage
        console.log('Securely using https protocol');

        // Load SSL key and certificate
        var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

        // Create HTTPS Server
        var httpsServer = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);

        // Return HTTPS server instance
        return httpsServer;
    }

    // DB setup
    db.then(function (dbCn) {
        var User = dbCn.model('User'),
            Requirement = dbCn.model('Requirement'),
            Role = dbCn.model('Role'),
            Lock = dbCn.model('Lock'),
            createOpts = {
                upsert: true,
                setDefaultsOnInsert: true,
                new: true
            };


        dbSettings.roleCollectionSetup(dbCn.connection.collections.Roles);
        dbSettings.userCollectionSetup(dbCn.connection.collections.Users);
        dbSettings.requirementCollectionSetup(dbCn.connection.collections.Requirements);

        if (lockSettings.enabled) {
            dbSettings.lockCollectionSetup(dbCn.connection.collections.Locks);
        }

        if (process.env.NODE_ENV === 'development') {
            // TEMP: dev environment users
            User.findOneAndUpdate({username: 'domain-manager'}, {
                displayName: 'Domain Manager',
                provider: 'local',
                username: 'domain-manager',
                password: 'testtest',
                organizationURL: 'http://www.engineeringsemantics.com',
                organizationName: 'Engineering Semantics',
                email: 'aronsch@gmail.com',
                firstName: 'Domain',
                lastName: 'Manager'
            }, createOpts).exec(function (err, u) {
                if (err) {
                    console.log(err);
                } else if (u) {
                    console.log('Test user', u.username, 'created');
                    u.addRoles(['view only', 'admin', 'domain manager'], function (status) {
                        if (status.ok) console.log(u.username, 'roles added');
                    });
                }
            });

            User.findOneAndUpdate({username: 'aronsch'}, {
                displayName: 'Aron Schneider',
                provider: 'local',
                username: 'aronsch',
                password: 'testtest',
                organizationURL: 'http://www.engineeringsemantics.com',
                organizationName: 'Engineering Semantics',
                email: 'aronsch@gmail.com',
                lastName: 'Schneider',
                firstName: 'Aron'
            }, createOpts).exec(function (err, u) {
                if (err) {
                    console.log(err);
                } else if (u) {
                    console.log('Test user', u.username, 'created');
                    u.addRoles(['view only', 'admin'], function (status) {
                        if (status.ok) console.log(u.username, 'roles added');
                    });
                }
            });

            User.findOneAndUpdate({username: 'toddsch'}, {
                displayName: 'Todd Schneider',
                provider: 'local',
                username: 'toddsch',
                password: 'testtest',
                organizationURL: 'http://www.engineeringsemantics.com',
                organizationName: 'Engineering Semantics',
                email: 'aronsch@gmail.com',
                lastName: 'Schneider',
                firstName: 'Todd'
            }, createOpts).exec(function (err, u) {
                if (err) {
                    console.log(err);
                } else if (u) {
                    console.log('Test user', u.username, 'created');
                    u.addRoles(['view access', 'admin'], function (status) {
                        if (status.ok) console.log(u.username, 'roles added');
                    });
                }
            });

            User.findOneAndUpdate({username: 'basicuser'}, {
                displayName: 'Basic User',
                provider: 'local',
                username: 'basicuser',
                password: 'testtest',
                organizationURL: 'http://www.engineeringsemantics.com',
                organizationName: 'Engineering Semantics',
                email: 'aronsch@gmail.com',
                lastName: 'User',
                firstName: 'Basic'
            }, createOpts).exec(function (err, u) {
                if (err) {
                    console.log(err);
                } else if (u) {
                    console.log('Test user', u.username, 'created');
                    u.addRoles(['view access'], function (status) {
                        if (status.ok) console.log(u.username, 'roles added');
                    });
                }
            });

            User.findOneAndUpdate({username: 'otherOrgUser'}, {
                displayName: 'OtherOrg User',
                provider: 'local',
                username: 'otherOrgUser',
                password: 'testtest',
                organizationURL: 'http://www.otherorg.com',
                organizationName: 'Other Org',
                email: 'aronsch@gmail.com',
                lastName: 'OtherOrg',
                firstName: 'Basic'
            }, createOpts).exec(function (err, u) {
                if (err) {
                    console.log(err);
                } else if (u) {
                    console.log('Test user', u.username, 'created');
                    u.addRoles(['view access'], function (status) {
                        if (status.ok) console.log(u.username, 'roles added');
                    });
                }
            });

        }

    });
    // Return Express server instance
    return app;
};
