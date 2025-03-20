'use strict';

var refreshToken = require('../../client_secret.json');

module.exports = {
	db: 'mongodb://mongodb',
	app: {
		title: 'REQS - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: 'reqs.application@gmail.com',
		options: {
			service: 'Gmail',
            logger: true,
            debug: true,
			auth: {
			    type: 'OAuth2',
                user: 'reqs.application@gmail.com',
                clientId: refreshToken.web.client_id,
                clientSecret: refreshToken.web.client_secret,
                refreshToken: '1/08Mf6-wwCBcCq2mkqDxuw-YcOyIqYeDXyN5zUhEnUFA'
			}
		}
	}
};
