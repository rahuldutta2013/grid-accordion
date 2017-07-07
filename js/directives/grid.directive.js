app.directive(
    'myGrid',
    function (dataService, $compile, $timeout) {
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
                scope.cancelInvite = function (row) {
                    //todo
                }
                scope.resendInvite = function (row) {
                    //todo
                }
                $timeout(function () {
                    element.find('[title="Next Page"]').children().addClass('fa fa-angle-right');
                    element.find('[title="Previous Page"]').children().addClass('fa fa-angle-left');
                    element.find('[title="First Page"]').children().addClass('fa fa-angle-double-left');
                    element.find('[title="Last Page"]').children().addClass('fa fa-angle-double-right');
                }, 100);
                var footerTemp = element.find('.ngFooterPanel');
                var paginationDataTemp = '<span  class="txt_area">{{lowerLimit}}-{{upperLimit}} of {{totalServerItems}} users &nbsp;</span>';
                var compTemp = $compile(paginationDataTemp);
                var content = compTemp(scope);
                $timeout(function () {
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
                $scope.custColDef = [];
                $scope.gridOptions = {
                    data: 'gridData',
                    enablePaging: true,
                    showFooter: true,
                    pagingOptions: $scope.pagingOptions,
                    filterOptions: $scope.filterOptions,
                    columnDefs: 'custColDef'
                };

                var createColoumnDef = function (data, accordionIndex) {
                    var cellTemplate;
                    switch (accordionIndex) {
                        case 0:
                            cellTemplate = '<div class="grid-action-cell"> ' + '<span class="fa fa-check-circle"></span>' +
                                '<a class="margin-right" ng-click="approveRow(row.entity);" >Approve</a>' + '<span class=" fa fa-times-circle"></span>' + '<a ng-click="denyRow(row.entity);" >Deny</a></div>';
                            break;
                        case 1:
                            cellTemplate = '<div class="grid-action-cell"> ' + '<span class="fa fa-check-circle"></span>' +
                                '<a class="margin-right" ng-click="cancelInvite(row.entity);" >Cancel Invite</a>' + '<span class=" fa fa-times-circle"></span>' + '<a ng-click="resendInvite(row.entity);" >Resend Invite</a></div>';
                            break;
                        case 2:
                            break;
                        default:
                            cellTemplate = '<div class="grid-action-cell"> ' + '<span class="fa fa-check-circle"></span>' +
                                '<a class="margin-right" ng-click="approveRow(row.entity);" >Cancel Invite</a>' + '<span class=" fa fa-times-circle"></span>' + '<a ng-click="denyRow(row.entity);" >Resend Invite</a></div>';
                    }
                    var coloumnDef = [],
                        arrayOfKey = Object.keys(data),
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
                    $scope.gridData = pagedData;
                    $scope.totalServerItems = data.length;
                    $scope.totalPages2 = Math.ceil($scope.totalServerItems / $scope.pagingOptions.pageSize);
                    myCurrPage = $scope.pagingOptions.currentPage;
                    $scope.upperLimit = $scope.pagingOptions.pageSize * myCurrPage;
                    if ($scope.totalServerItems < $scope.upperLimit) {
                        var newUpperLimit = $scope.upperLimit
                        $scope.upperLimit = $scope.totalServerItems;
                        $scope.lowerLimit = newUpperLimit - (pageSize - 1);
                    } else {
                        $scope.lowerLimit = $scope.upperLimit - (pageSize - 1);
                        myCurrPage = myCurrPage + $scope.pagingOptions.pageSize;
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
                            data = $scope.totalGridData.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, $scope.pagingOptions.currentPage, pageSize);
                        } else {
                            dataService.getInformation(url).then(function (resp) {
                                $scope.setPagingData(resp.data, page, pageSize);
                            });
                        }
                    }, 100);
                };

                $scope.$on('getData', function (event, url, accordionIndex) {
                    dataService.getInformation(url).then(function (resp) {
                        $scope.totalGridData = resp.data;
                        $scope.setPagingData(resp.data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize, );
                        $scope.custColDef = createColoumnDef(resp.data[0], accordionIndex);
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