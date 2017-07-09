var app = angular.module('myApp', ['ngGrid']);
app.controller(
    'MyCtrl',
    function ($scope, $http, dataService) {
        $scope.accordionOptions = [{ "title": "Invited", "val": "js/data/studentData.json" }, { "title": "Rejected", "val": "js/data/teacherData.json" }];
    });
app.controller(
    'MyCtrl2',
    function ($scope, $http, dataService) {
        $scope.defaultUrl = "js/data/studentData.json";
    });
app.controller(
    'MyCtrl3',
    function ($scope, $http, dataService) {
        $scope.accordionOptions = [{ "title": "Admin", "val": "js/data/studentData.json" }];
    });
app.service('dataService', function ($http) {
    this.getInformation = function (url) {
        return $http.get(url);
    }
});
