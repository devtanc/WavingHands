var app = angular.module('wavingHandsApp', [ ]);

app.controller('HandsController', ['$scope', function($scope){
    //$scope.action: bound to the action button at the bottom of the UI (which is linked to the commitTurn method). The buttonText attribute is displayed while the class attribute sets the class of the DOM element
    
    $scope.action = {
        buttonText: 'Commit',
        class: 'btn-success'
    };
    
    /*  $scope.commandList: This is the user's command list. It is an array of commandSet arrays of objects structured as follows
    *        {
    *            gesture: [string],
    *            selected: [boolean],
    *            chain: [boolean],
    *            pair: [boolean: true if both objects in the commandSet have equivalent (==) gesture attribute strings]
    *        }
    *   commandSet[0] represents the left hand and commandSet[1] represents the right hand
    *   e.g. commandList[5][0] would access the 6th commandSet, left hand object
    */
    $scope.commandList = [];
    
    //
    $scope.persistList = false;
    $scope.highlightSpell = false;
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
    $scope.persistedHand = {
        index: null,
        hand: null
    }
//    $scope.startGesture = {
//        index: 0,
//        hand: "right"
//    };
    $scope.beginningSequence = "";
    
    //$scope.buttonArray: Represents the state of the buttons for selecting the gestures for the current turn. This item contains two arrays that are both parallel with $scope.cmdArray.
    //The selected gesture is indicated in each array with a 1, and only one array item should contain a 1 value at any given time.
    $scope.initButtonArray = function() {
        $scope.buttonArray = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
    }
    $scope.initButtonArray();
    
    $scope.debug = function(data) {
        console.log(data);
    }
    
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
        if($scope.persistList) {
            $scope.togglePersist($scope.persistedHand.index, $scope.persistedHand.hand);
            $scope.resetHover();
        }
        
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
//        console.log($scope.rightHandCmd == $scope.leftHandCmd ? true : false);
        $scope.initButtonArray();
    }
    
    $scope.addCommandSet = function(commandSet) {
        $scope.commandList.splice(0,0, commandSet);
//        console.log($scope.commandList);
    }
    
/* toggle Persist process
    -Click gesture
        Select gesture
        Highlight descendents
        Persist spell list

    -Click new gesture
        Clear current selection
        Select gesture
        Highlight descendents
        Persist spell list

    -Click current gesture
        Clear current selection
*/
    $scope.togglePersist = function(index, hand) {
        if (!$scope.persistList) {
            $scope.persistList = true;
            $scope.commandList[index][hand].selected = true;
            $scope.persistedHand.index = index;
            $scope.persistedHand.hand = hand;
        } else {
            if ($scope.commandList[index][hand].selected) {
                $scope.commandList[index][hand].selected = false;
                $scope.persistList = false;
                $scope.persistedHand.index = null;
                $scope.persistedHand.hand = null;
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
//        console.log("Hover reset");
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