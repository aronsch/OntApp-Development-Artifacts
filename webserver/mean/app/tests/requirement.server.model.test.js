'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Requirement = mongoose.model('Requirement');

/**
 * Globals
 */
var user, requirement;

/**
 * Unit tests
 */
describe('Requirement Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			requirement = new Requirement({
				name: 'Requirement Name',
				user: user,
                Properties: {
                    Name: {
                        Value: 'Test'
                    },
                    Description: {
                        Value: 'This is a test'
                    }
                }
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return requirement.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			requirement.name = '';

			return requirement.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Requirement.remove().exec();
		User.remove().exec();

		done();
	});
});