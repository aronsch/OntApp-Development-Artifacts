'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, user3, user4;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
            roles: ['create', 'edit', 'comment']
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
            roles: ['create', 'edit', 'comment']
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});

describe('User Model Permission Tests:', function() {
    before(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            roles: ['create', 'edit', 'comment']
        });
        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            roles: ['user']
        });
        user3 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            roles: ['admin']
        });
        user4 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local',
            roles: ['create', 'edit', 'comment']
        });

        done();
    });

    describe('Method hasRole', function() {
        it('should not partially match role array entry', function(done) {
            user.hasRole('com').should.be.false();
            user.hasRole('ed').should.be.false();
            user.hasRole('creat').should.be.false();
            done();
        });

        it('should allow admins access to all role permissions', function(done) {
            user3.canCreate().should.be.true();
            user3.canEdit().should.be.true();
            user3.canEditGlossary().should.be.true();
            user3.canComment().should.be.true();
            user3.canModerate().should.be.true();
            user3.canCreateUser().should.be.true();
            user3.canEditUser().should.be.true();
            user3.canDeactivate().should.be.true();
            done();
        });

    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});