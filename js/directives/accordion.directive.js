app.directive('custAccordion', function ($timeout) {
    return {
        templateUrl: 'template/accordionTemplate.html',
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attrs) {
            var redrawGrid = function () {
                $timeout(function () {
                    $(window).resize();
                    $(window).resize();
                }, 10);
            };
            scope.populateData = function (event, url) {
                if (angular.element(event.target).parents('.panel').find('.in').length <= 0) {
                redrawGrid();
                scope.$broadcast('getData', url);
                }
            }
            scope.dataValues = scope.accordionOptions;
        }
    };
});