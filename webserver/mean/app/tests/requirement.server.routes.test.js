'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Requirement = mongoose.model('Requirement'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, requirement;

/**
 * Requirement routes tests
 */
describe('Requirement CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Requirement
		user.save(function() {
			requirement = {
				name: 'Requirement Name'
			};

			done();
		});
	});

	it('should be able to save Requirement instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Requirement
				agent.post('/requirements')
					.send(requirement)
					.expect(200)
					.end(function(requirementSaveErr, requirementSaveRes) {
						// Handle Requirement save error
						if (requirementSaveErr) done(requirementSaveErr);

						// Get a list of Requirements
						agent.get('/requirements')
							.end(function(requirementsGetErr, requirementsGetRes) {
								// Handle Requirement save error
								if (requirementsGetErr) done(requirementsGetErr);

								// Get Requirements list
								var requirements = requirementsGetRes.body;

								// Set assertions
								(requirements[0].user._id).should.equal(userId);
								(requirements[0].name).should.match('Requirement Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Requirement instance if not logged in', function(done) {
		agent.post('/requirements')
			.send(requirement)
			.expect(401)
			.end(function(requirementSaveErr, requirementSaveRes) {
				// Call the assertion callback
				done(requirementSaveErr);
			});
	});

	it('should not be able to save Requirement instance if no name is provided', function(done) {
		// Invalidate name field
		requirement.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Requirement
				agent.post('/requirements')
					.send(requirement)
					.expect(400)
					.end(function(requirementSaveErr, requirementSaveRes) {
						// Set message assertion
						(requirementSaveRes.body.message).should.match('Please fill Requirement name');
						
						// Handle Requirement save error
						done(requirementSaveErr);
					});
			});
	});

	it('should be able to update Requirement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Requirement
				agent.post('/requirements')
					.send(requirement)
					.expect(200)
					.end(function(requirementSaveErr, requirementSaveRes) {
						// Handle Requirement save error
						if (requirementSaveErr) done(requirementSaveErr);

						// Update Requirement name
						requirement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Requirement
						agent.put('/requirements/' + requirementSaveRes.body._id)
							.send(requirement)
							.expect(200)
							.end(function(requirementUpdateErr, requirementUpdateRes) {
								// Handle Requirement update error
								if (requirementUpdateErr) done(requirementUpdateErr);

								// Set assertions
								(requirementUpdateRes.body._id).should.equal(requirementSaveRes.body._id);
								(requirementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Requirements if not signed in', function(done) {
		// Create new Requirement model instance
		var requirementObj = new Requirement(requirement);

		// Save the Requirement
		requirementObj.save(function() {
			// Request Requirements
			request(app).get('/requirements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Requirement if not signed in', function(done) {
		// Create new Requirement model instance
		var requirementObj = new Requirement(requirement);

		// Save the Requirement
		requirementObj.save(function() {
			request(app).get('/requirements/' + requirementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', requirement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Requirement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Requirement
				agent.post('/requirements')
					.send(requirement)
					.expect(200)
					.end(function(requirementSaveErr, requirementSaveRes) {
						// Handle Requirement save error
						if (requirementSaveErr) done(requirementSaveErr);

						// Delete existing Requirement
						agent.delete('/requirements/' + requirementSaveRes.body._id)
							.send(requirement)
							.expect(200)
							.end(function(requirementDeleteErr, requirementDeleteRes) {
								// Handle Requirement error error
								if (requirementDeleteErr) done(requirementDeleteErr);

								// Set assertions
								(requirementDeleteRes.body._id).should.equal(requirementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Requirement instance if not signed in', function(done) {
		// Set Requirement user 
		requirement.user = user;

		// Create new Requirement model instance
		var requirementObj = new Requirement(requirement);

		// Save the Requirement
		requirementObj.save(function() {
			// Try deleting Requirement
			request(app).delete('/requirements/' + requirementObj._id)
			.expect(401)
			.end(function(requirementDeleteErr, requirementDeleteRes) {
				// Set message assertion
				(requirementDeleteRes.body.message).should.match('User is not logged in');

				// Handle Requirement error error
				done(requirementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Requirement.remove().exec();
		done();
	});
});