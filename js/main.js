var app = angular.module('myApp', ['ngGrid']);
app.controller(
    'MyCtrl',
    function ($scope, $http, dataService) {
        $scope.defaultUrl = "js/data/studentData.json";
        $scope.accordionOptions = [{ "title": "Invited Teachers", "val": "js/data/studentData.json" }, { "title": "Rejected Requests", "val": "js/data/myStudentData.json" }];
      
    });
app.service('dataService', function ($http) {
    this.getInformation = function (url) {
        return $http.get(url);
    }
});