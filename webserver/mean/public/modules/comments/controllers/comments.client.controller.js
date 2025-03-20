'use strict';

// Comment controller
angular.module('comments').controller('CommentsController', CommentsController);

CommentsController.$inject = ['$scope', '$stateParams', '$location', 'Authentication', 'Comment'];
function CommentsController($scope, $stateParams, $location, Authentication, Comment) {
    $scope.authentication = Authentication;

    /* Controller Public Functions */

    // if requirement specified, get comments, otherwise start query for comments
    $scope.comments = $scope.requirement ? $scope.requirement.Properties.comments() : Comment.list({name: $stateParams.name});

    $scope.create = create;
    $scope.remove = remove;
    $scope.update = update;
    $scope.findOne = findOne;
    $scope.isAddingComment = false;

    $scope.setAddingComment = setAddingComment;
    $scope.doneAddingComment = doneAddingComment;

    // Controller scope state
    $scope.user = Authentication.user;
    $scope.comment = new Comment({
        Class: 'Comment',
        RelatedToIRI: $scope.requirement ? $scope.requirement.Properties.namePath() :  $stateParams.name,
        UserName:  $scope.user.username,
        Value: ''
    });

    if($scope.requirement) {
        // if requirements specified, extend requirement comments
        Comment.transformAllResults($scope.comments)
    } else {
        $scope.comments.$promise.then(function (data) {
            // otherwise add callback to comments query
            Comment.transformAllResults($scope.comments);
        });
    }

    /**
     * Create new Comment
     */
    function create() {
        // Create new Comment object
        var comment = new Comment(angular.copy($scope.comment));

        comment.$save(function (response) {
            response.$resolved = true;
            response = Comment.transformResult(response);
            $scope.comments.splice(_.indexOf($scope.comments, comment), 1, response);
            $scope.doneAddingComment();
        }, function (errorResponse) {
            // restore comment field content
            $scope.comment = comment;
            $scope.comment.$error = errorResponse;
            console.error(errorResponse);
            // remove optimistically added comment
            $scope.comments.splice(_.indexOf($scope.comments, comment), 1);
        });

        // always:
        // clear error state
        comment.$error = undefined;
        // set comment user
        comment.user = $scope.user;
        // optimistic addition to comment display list
        $scope.comments.push(comment);
        // clear comment input
        $scope.comment.Value = '';
    }


    /**
     * Remove existing Comment
     * @param comment
     */
    function remove(comment) {
        // TODO
    }

    /**
     * Update existing comment.
     */
    function update() {
        clearRelatedDetails();
        var comment = angular.copy($scope.comment);

        comment.user = Authentication.user;
        comment.$update(function () {

        }, function (errorResponse) {
            console.error(errorResponse);
        });
    }

    /**
     * Queries ontology using provided properties to find comments.
     * @param searchProperties
     * @returns {query|commentResource.query|{method, url, transformRequest, transformResponse, isArray}}
     */
    function query(searchProperties) {
        return new Comment.query('', searchProperties);
    }

    /**
     * Browse to the specified IRI.
     * @param iri
     */
    function openIRI(iri) {
        $location.search({iri: iri});
        $location.path('/comments/iri');
    }

    /**
     * Retrieve a single comment using IRI or database ID.
     * TODO: retire DB ids
     * TODO: rename this - setComment
     */
    function findOne() {
        if ($stateParams.iri) {
            $scope.comment = Comment.getIri({iri: $stateParams.iri})
        } else if ($stateParams.commentId) {
            $scope.comment = Comment.get({
                commentId: $stateParams.commentId
            });
        }

    }


    /**
     * For the current selected comment, extend displayed properties with any missing property keys
     */
    function handleCommentResolved() {
        if ($scope.comment && $scope.comment.$resolved) {
            $scope.models.extendComment($scope.comment);
            $scope.related = $scope.comment.Properties.relatedComments();

            $scope.$watchCollection('comment.Properties.RelatedComments.Value', function () {
                var relatedUpdate = $scope.comment.Properties.relatedComments();
                angular.forEach($scope.related, function (related, key) {
                    $scope.related[key] = relatedUpdate[key];
                });
            });

            // get any comments attached to this comments
            if ($scope.comment.Properties.relatedComments().length) {
                $scope.getRelated();
            }
        }
    }

    function setAddingComment() {
        $scope.isAddingComment = true;
    }

    function doneAddingComment() {
        $scope.isAddingComment = false;
    }



    /**
     * Escape URLs/URIs
     * @param input
     * @returns {string}
     */
    function escape(input) {
        return window.encodeURIComponent(input);
    }
}
