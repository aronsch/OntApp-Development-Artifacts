'use strict';

(function() {
	// Requirements Controller Spec
	describe('Requirements Controller Tests', function() {
		// Initialize global variables
		var RequirementsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Requirements controller.
			RequirementsController = $controller('RequirementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Requirement object fetched from XHR', inject(function(Requirements) {
			// Create sample Requirement using the Requirements service
			var sampleRequirement = new Requirements({
				name: 'New Requirement'
			});

			// Create a sample Requirements array that includes the new Requirement
			var sampleRequirements = [sampleRequirement];

			// Set GET response
			$httpBackend.expectGET('requirements').respond(sampleRequirements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.requirements).toEqualData(sampleRequirements);
		}));

		it('$scope.findOne() should create an array with one Requirement object fetched from XHR using a requirementId URL parameter', inject(function(Requirements) {
			// Define a sample Requirement object
			var sampleRequirement = new Requirements({
				name: 'New Requirement'
			});

			// Set the URL parameter
			$stateParams.requirementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/requirements\/([0-9a-fA-F]{24})$/).respond(sampleRequirement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.requirement).toEqualData(sampleRequirement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Requirements) {
			// Create a sample Requirement object
			var sampleRequirementPostData = new Requirements({
				name: 'New Requirement'
			});

			// Create a sample Requirement response
			var sampleRequirementResponse = new Requirements({
				_id: '525cf20451979dea2c000001',
				name: 'New Requirement'
			});

			// Fixture mock form input values
			scope.name = 'New Requirement';

			// Set POST response
			$httpBackend.expectPOST('requirements', sampleRequirementPostData).respond(sampleRequirementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Requirement was created
			expect($location.path()).toBe('/requirements/' + sampleRequirementResponse._id);
		}));

		it('$scope.update() should update a valid Requirement', inject(function(Requirements) {
			// Define a sample Requirement put data
			var sampleRequirementPutData = new Requirements({
				_id: '525cf20451979dea2c000001',
				name: 'New Requirement'
			});

			// Mock Requirement in scope
			scope.requirement = sampleRequirementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/requirements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/requirements/' + sampleRequirementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid requirementId and remove the Requirement from the scope', inject(function(Requirements) {
			// Create new Requirement object
			var sampleRequirement = new Requirements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Requirements array and include the Requirement
			scope.requirements = [sampleRequirement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/requirements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRequirement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.requirements.length).toBe(0);
		}));
	});
}());