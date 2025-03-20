'use strict';

//Requirements service used to communicate Requirements REST endpoints
angular.module('comments').factory('CommentObj', CommentFactory);

CommentFactory.$inject = [];
function CommentFactory () {

    /**
     * Base Comment prototype
     * @param commentObj
     * @constructor
     */
    function Comment(commentObj) {
        angular.merge(this, commentObj);
        this.Class = "Comment";
    }

    Comment.prototype.createdDate = function () {
        return dateFrmStr(this.CreatedDateTime);
    };

    function dateFrmStr (dateStr) {
        return moment.utc(dateStr, 'YYYY-MM-DD-HH:mm:ss:SS');
    }

    return Comment;
}



