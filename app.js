var app = angular.module('wavingHandsApp', [ ]);

app.controller('HandsController', ['$scope', function($scope){
    $scope.action = {
        buttonText: 'Commit',
        class: 'btn-success'
    };
    $scope.commandList = [];
    $scope.persistList = false;
    $scope.cmdArray = [
        'F',
        'P',
        'S',
        'W',
        'D',
        '>',
        '-',
        'C'
    ];
    $scope.rightHandCmd = ' ';
    $scope.leftHandCmd = ' ';
//    $scope.startGesture = {
//        index: 0,
//        hand: "right"
//    };
    $scope.beginningSequence = "";
    
    $scope.initButtonArray = function() {
        $scope.buttonArray = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
    }
    
    $scope.initButtonArray();
    
    $scope.setCmd = function(hand, cmd) {
        for(var i = 0; i < $scope.buttonArray[hand].length; i++) {
            $scope.buttonArray[hand][i] = 0;
        }
        $scope.buttonArray[hand][cmd] = 1;
        
        $scope.updateCmdSet();
    }
    
    $scope.updateCmdSet = function() {
        for (var i = 0; i < $scope.buttonArray[0].length; i++) {
            if ($scope.buttonArray[0][i]) {
                $scope.leftHandCmd = $scope.cmdArray[i];
            }
        }
        for (var i = 0; i < $scope.buttonArray[1].length; i++) {
            if ($scope.buttonArray[1][i]) {
                $scope.rightHandCmd = $scope.cmdArray[i];
            }
        }
        //console.log($scope.buttonArray);
        if($scope.buttonArray[0][1] && $scope.buttonArray[1][1]){
            $scope.action.buttonText = "Surrender?";
            $scope.action.class = "btn-warning";
        } else if ($scope.buttonArray[0][5] && $scope.buttonArray[1][5]){
            $scope.action.buttonText = "You only have one knife...";
            $scope.action.class = "btn-danger";
        } else {
            $scope.action.buttonText = "Commit";
            $scope.action.class = "btn-success";
        }
    }
    
    $scope.commitTurn = function() {
        $scope.persistList = false;
        $scope.addCommandSet([
            {
                gesture: $scope.leftHandCmd,
                selected: false,
                chain: false,
                pair: $scope.rightHandCmd == $scope.leftHandCmd ? true : false
            },
            {
                gesture: $scope.rightHandCmd,
                selected: false,
                chain: false,
                pair: $scope.rightHandCmd == $scope.leftHandCmd ? true : false
            }
        ]);
        $scope.initButtonArray();
    }
    
    $scope.addCommandSet = function(commandSet) {
        $scope.commandList.splice(0,0, commandSet);
        console.log($scope.commandList);
    }
    
    $scope.togglePersist = function(index, hand) {
        if (!$scope.persistList) {
            $scope.persistList = true;
            $scope.commandList[index][hand].selected = true;
        } else {
            if ($scope.commandList[index][hand].selected) {
                $scope.commandList[index][hand].selected = false;
                $scope.persistList = false;
            }
        }
    }
    
    $scope.resetHover = function() {
        for(var i = 0; i < $scope.commandList.length; i++){
            $scope.commandList[i][0].chain = false;
            $scope.commandList[i][1].chain = false;
        }
        $scope.beginningSequence = "";
        $scope.matchingSpells = [];
        console.log("Hover reset");
    }
    
    $scope.hoverChain = function(index, hand) {
        $scope.matchingSpells = [];
        for(var i = index; i >= 0; i--){
            $scope.commandList[i][hand].chain = true;
            $scope.beginningSequence += $scope.commandList[i][hand].gesture;
        }
        for (var i = 0; i < $scope.spellList.length; i++){
            if ($scope.spellList[i].sequence.indexOf($scope.beginningSequence) == 0) {
                $scope.matchingSpells.push($scope.spellList[i]);
            }
        }
    }
    
    $scope.matchingSpells = [];
    $scope.spellList = [
        {
            name: "Dispel Magic",
            sequence: "CDPW"
        },
        {
            name: "Summon Elemental",
            sequence: "CSWWS"
        },
        {
            name: "Magic Mirror",
            sequence: "C(W)"
        },
        {
            name: "Lightning Bolt",
            sequence: "DFFDD"
        },
        {
            name: "Cure Heavy Wounds",
            sequence: "DFPW"
        },
        {
            name: "Cure Light Wounds",
            sequence: "DFW"
        },
        {
            name: "Amnesia",
            sequence: "DPP"
        },
        {
            name: "Charm Person",
            sequence: "PSDF"
        },
        {
            name: "Summon Ogre",
            sequence: "PSFW"
        },
        {
            name: "Summon Goblin",
            sequence: "SFW"
        },
        {
            name: "Cause Light Wounds",
            sequence: "WFP"
        }
    ]
}]);