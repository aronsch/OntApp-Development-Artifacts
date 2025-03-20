'use strict';

angular.module('shared').filter('groupByLetter', [
    function () {
        return function (arr, key) {

            // sort alphabetically by provided key
            // to ensure that resulting groups have same order
            arr = arr.sort(function (a, b) {
                var aStr = a[key].toUpperCase();
                var bStr = b[key].toUpperCase();
                if (aStr < bStr) {
                    return -1;
                }
                if (aStr > bStr) {
                    return 1;
                }
                return 0;
            });

            var alphaGroups = {};
            // map alphabet to object keys
            'abcdefghijklmnopqrstuvwxyz'.split('').map(function (letter) {
                alphaGroups[letter] = [];
            });

            // group items in provided array by provided key, using first character
            // to determine group
            angular.forEach(arr, function (item) {
                alphaGroups[item[key].toLowerCase()[0]].push(item);
            });
            return alphaGroups;
        };
    }
]);
