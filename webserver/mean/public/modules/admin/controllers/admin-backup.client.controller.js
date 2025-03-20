'use strict';

angular.module('admin').controller('AdminBackupController', AdminBackupController);

AdminBackupController.$inject = ['$scope', 'Authentication', '$http'];
function AdminBackupController($scope, Authentication, $http) {
    $scope.authentication = Authentication;

    // Controller scope state
    $scope.adminUser = Authentication.user;

    $scope.dataExport = function dataExport() {
        $http.get('admin/export').then(function (res) {
            var blob = new Blob([JSON.stringify(res.data, null, 4)], { type: 'application/json' }),
                filename = $scope.downloadName();

            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else{
                var elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = filename;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
            }
        }, function (errRes) {
            $scope.error = errRes;
        });
    };

    $scope.downloadName = function () {
        return 'RequirementExportJSON_'
            + new Date().toISOString().replace(/[-:]/g,'').replace(/\..*$/, '')
            + '.json';
    }
}
