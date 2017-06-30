app.directive(
    'myGrid',
    function (dataService, $compile) {
        return {
            templateUrl: 'template/grid.html',
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.approveRow = function (row) {
                    //todo
                }
                scope.denyRow = function (row) {
                    //todo
                }
                setTimeout(function () {
                    element.find('[title="Next Page"]').children().addClass('fa fa-angle-right');
                    element.find('[title="Previous Page"]').children().addClass('fa fa-angle-left');
                    element.find('[title="First Page"]').children().addClass('fa fa-angle-double-left');
                    element.find('[title="Last Page"]').children().addClass('fa fa-angle-double-right');
                }, 100);
                var footerTemp = element.find('.ngFooterPanel');
                var paginationDataTemp = '<span  class="txt_area">{{lowerLimit}}-{{upperLimit}} of {{totalServerItems}} users &nbsp;</span>';
                var compTemp = $compile(paginationDataTemp);
                var content = compTemp(scope);
                setTimeout(function () {
                    element.find('[title="First Page"]').before(content);
                })
                footerTemp.append(content);
                var currentPageTemp = element.find('.ngPagerCurrent');
                var pageNoTemplate = '<span class="txt_area"> &nbsp of {{totalPages2}}  pages  &nbsp</span>';
                var compCurrentPageTemp = $compile(pageNoTemplate);
                var currentPageContent = compCurrentPageTemp(scope);
                currentPageTemp.after(currentPageContent);

            },
            controller: function ($scope) {
                $scope.filterOptions = {
                    filterText: ""
                };
                $scope.totalServerItems = 0;
                $scope.pagingOptions = {
                    pageSizes: [5, 10],
                    pageSize: 5,
                    currentPage: 1
                };
                $scope.filterName = function () {
                    var filterText = $scope.nameFilter;
                    if (filterText) {
                        $scope.filterOptions.filterText = filterText;
                    } else {
                        $scope.filterOptions.filterText = '';
                    }
                };
                $scope.pageNo = $scope.pagingOptions.currentPage;
                $scope.selectedCols = [];
                $scope.gridOptions = {
                    data: 'myData',
                    enablePaging: true,
                    showFooter: true,
                    pagingOptions: $scope.pagingOptions,
                    filterOptions: $scope.filterOptions,
                    columnDefs: 'selectedCols'
                };

                var createColoumnDef = function (data) {
                    var coloumnDef = [],
                        arrayOfKey = Object.keys(data),
                        cellTemplate = '<div class="grid-action-cell"> ' + '<span class="fa fa-check-circle"></span>' +
                            '<a class="margin-right" ng-click="approveRow(row.entity);" >Approve</a>' + '<span class=" fa fa-times-circle"></span>' + '<a ng-click="denyRow(row.entity);" >Deny</a></div>';
                    verifyObj = {};
                    verifyObj.displayName = 'Verify';
                    verifyObj.cellTemplate = cellTemplate;
                    for (var i = 0; i < arrayOfKey.length; i++) {
                        var fieldObj = {};
                        fieldObj.field = arrayOfKey[i];
                        coloumnDef.push(fieldObj);
                    }
                    coloumnDef.push(verifyObj);
                    return coloumnDef;
                };
                $scope.setPagingData = function (data, page, pageSize) {
                    var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                    $scope.myData = pagedData;
                    $scope.totalServerItems = data.length;
                    $scope.totalPages2 = Math.ceil($scope.totalServerItems / 5);
                    myCurrPage = $scope.pagingOptions.currentPage;

                    $scope.upperLimit = 5 * myCurrPage;
                    if ($scope.totalServerItems < $scope.upperLimit) {
                        var newUpperLimit = $scope.upperLimit
                        $scope.upperLimit = $scope.totalServerItems;
                        $scope.lowerLimit = newUpperLimit - (pageSize - 1);
                    } else {
                        $scope.lowerLimit = $scope.upperLimit - (pageSize - 1);
                        myCurrPage = myCurrPage + 5;
                    }
                    $scope.totalPages = data.length;
                    $scope.pagingOptions.totalServerItems = $scope.totalServerItems;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };
                $scope.getPagedDataAsync = function (pageSize, page, searchText, url) {
                    setTimeout(function () {
                        var data;
                        if (searchText) {
                            var ft = searchText.toLowerCase();
                            dataService.getInformation(url).then(function (largeLoad) {
                                data = largeLoad.data.filter(function (item) {
                                    return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                                });
                                $scope.setPagingData(data, $scope.pagingOptions.currentPage, pageSize);
                            });
                        } else {
                            dataService.getInformation(url).then(function (largeLoad) {
                                $scope.setPagingData(largeLoad.data, page, pageSize);
                            });
                        }
                    }, 100);
                };

                $scope.$on('getData', function (event, url) {
                    dataService.getInformation(url).then(function (resp) {
                        $scope.setPagingData(resp.data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, );
                        $scope.coloumnStu = createColoumnDef(resp.data[0]);
                        $scope.selectedCols = $scope.coloumnStu;
                        $scope.dataUrl = url;
                    });

                })

                $scope.$broadcast('getData', $scope.defaultUrl);
                $scope.$watch('pagingOptions', function (newVal, oldVal) {
                    if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.dataUrl);
                    }
                }, true);
                $scope.$watch('filterOptions', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText, $scope.dataUrl);
                    }
                }, true);
            }
        };
    })