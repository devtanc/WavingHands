var app = angular.module('wavingHandsApp', [ ]);

app.controller('HandsController', ['$scope', function($scope){
    $scope.commandList = [];
    $scope.rightHandCmd = '-';
    $scope.leftHandCmd = '-';
    
    $scope.setRightHandCmd = function(val) {
        if($scope.leftHandCmd == '>' && val == '>') {
            $scope.leftHandCmd = '-';
            $scope.rightHandCmd = '>';
        } else if ($scope.leftHandCmd == 'P' && val == 'P') {
            $scope.leftHandCmd = 'surrender';
            $scope.rightHandCmd = 'surrender';
        } else {
            $scope.rightHandCmd = val;
        }
    }
    
    $scope.setLeftHandCmd = function(val) {
        if($scope.rightHandCmd == '>' && val == '>') {
            $scope.rightHandCmd = '-';
            $scope.leftHandCmd = '>';
        } else if ($scope.rightHandCmd == 'P' && val == 'P') {
            $scope.rightHandCmd = 'surrender';
            $scope.leftHandCmd = 'surrender';
        } else {
            $scope.leftHandCmd = val;
        }
    }
    
    $scope.commitTurn = function() {
        $scope.addCommandSet({
            rightCmd:$scope.rightHandCmd,
            leftCmd:$scope.leftHandCmd
        });
    }
    
    $scope.addCommandSet = function(commandSet) {
        $scope.commandList.splice(0,0, commandSet);
    }
}]);

app.directive('radio', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                if(element.hasClass('active')) {
                    element.parent().children().removeClass('active');
                } else {
                    element.parent().children().removeClass('active');
                    element.addClass('active');
                }
            });
        },
    }
});