var app = angular.module('wavingHandsApp', [ ]);

app.controller('HandsController', ['$scope', function($scope){
    //$scope.action: bound to the action button at the bottom of the UI (which is linked to the commitTurn method). The buttonText attribute is displayed while the class attribute sets the class of the DOM element
    $scope.action = {
        buttonText: 'Commit',
        class: 'btn-success'
    };
    
    /* $scope.commandList: This is the user's command list. It is an array of commandSet arrays of objects structured as follows
    *        {
    *            gesture: [string],
    *            selected: [boolean],
    *            chain: [boolean],
    *            pair: [boolean: true if both objects in the commandSet have equivalent (==) gesture attribute strings]
    *        }
    *   commandSet[0] represents the left hand and commandSet[1] represents the right hand
    *   e.g. commandList[5][0] would access the 6th commandSet's left hand object. The attributes above would then be accessed through dot notation.
    */
    $scope.commandList = [];
    
    //$scope.cmdArray: This array contains the list of gestures, arranged in the same order as the buttons in the UI. This allows for easy assignment of gestures based on the index of the button pressed in the UI.
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
    
    //$scope.nextCmd: Stores the currently selected gesture values [0] being the left hand, [1] being the right hand.
    $scope.nextCmd = [' ', ' '];
    
    //$scope.persistList: Boolean value expressing whether to persist the current spell list or not
    $scope.persistList = false;
    
    //$scope.persistedHand: Stores information regarding the current turn and hand that has been selected to be persisted
    $scope.persistedHand = {
        index: null,
        hand: null
    }
    
    //$scope.beginningSequence: Built out in the $scope.hoverChain method. Stores the current beginning spell sequence for the gesture and chain selected
    $scope.beginningSequence = "";
    
    //$scope.buttonArray: Represents the state of the buttons for selecting the gestures for the current turn. This item contains two arrays that are both parallel with $scope.cmdArray.
    //The selected gesture is indicated in each array with a 1, and only a single array item in each array should contain a 1 value at any given time.
    $scope.initButtonArray = function() {
        $scope.buttonArray = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
    }
    $scope.initButtonArray();
    
    //Used for writing data to the console from the HTML
    $scope.debug = function(data) {
        console.log(data);
    }
    
    //$scope.setCmd: Manages the selection of gesture buttons in the UI. CLears button selections, then applies the correct selection based on the values passed.
    $scope.setCmd = function(hand, cmd) {
        //Set all buttons for the selected hand's buttonArray to zero (unselected)
        for(var i = 0; i < $scope.buttonArray[hand].length; i++) {
            $scope.buttonArray[hand][i] = 0;
        }
        
        //Clear the other hand's clap button IF the selected command is not clap (This prevents single-handed Clap gestures)
        if(cmd != 7){
            $scope.buttonArray[Math.abs(hand - 1)][7] = 0;
        }
        
        //Set the selected button to selected
        $scope.buttonArray[hand][cmd] = 1;
        
        //If this is a clap command, and the other hand does not have the clap command selected currently, set the other hand's clap button to selected as well
        if(cmd == 7 && !$scope.buttonArray[Math.abs(hand - 1)][cmd]) {
            $scope.setCmd(Math.abs(hand - 1), cmd);
        }
        
        //Update the temporary command set with the newly selected values
        $scope.updateCmdSet();
        
        //Updates the action button status
        $scope.updateActionButton();
    }
    
    //$scope.updateCmdSet: Scans both button arrays for their selected indexes (value of 1) and sets $scope.nextCmd left [0] and right [1] hand gestures to their correct characters based on the parallel $scope.cmdArray values
    $scope.updateCmdSet = function() {
        for (var i = 0; i < $scope.buttonArray[0].length; i++) {
            if ($scope.buttonArray[0][i]) {
                $scope.nextCmd[0] = $scope.cmdArray[i];
            }
        }
        for (var i = 0; i < $scope.buttonArray[1].length; i++) {
            if ($scope.buttonArray[1][i]) {
                $scope.nextCmd[1] = $scope.cmdArray[i];
            }
        }
    }
    
    //$scope.updateActionButton: Updates the action button with messages to the user depending on the commands they have selected
    $scope.updateActionButton = function() {
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
    
    //$scope.commitTurn: Creates a new command set from the $scope.nextCmd values and calls $scope.addCmdSet with the new command set as parameters. Clears any persising of spells and reinitializes the buttonArray to deselct all buttons
    $scope.commitTurn = function() {
        if($scope.persistList) {
            $scope.togglePersist($scope.persistedHand.index, $scope.persistedHand.hand);
            $scope.resetHover();
        }
        
        $scope.addCmdSet([
            {
                gesture: $scope.nextCmd[0],
                selected: false,
                chain: false,
                pair: $scope.nextCmd[1] == $scope.nextCmd[0] ? true : false
            },
            {
                gesture: $scope.nextCmd[1],
                selected: false,
                chain: false,
                pair: $scope.nextCmd[1] == $scope.nextCmd[0] ? true : false
            }
        ]);
        $scope.initButtonArray();
    }
    
    //$scope.addCmdSet: Adds the passed command set to the $scope.commandList array. This is inserted in the first position of the array
    $scope.addCmdSet = function(commandSet) {
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
    //$scope.togglePersist: Manages the toggling of the persistent spell list. Sets which turn and which hand is selected from the parameters
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
    
    //$scope.resetHover: Resets hover values to their default values to clear the CSS classes and coloring
    $scope.resetHover = function() {
        for(var i = 0; i < $scope.commandList.length; i++){
            $scope.commandList[i][0].chain = false;
            $scope.commandList[i][1].chain = false;
        }
        $scope.beginningSequence = "";
        $scope.matchingSpells = [];
    }
    
    //$scope.hoverChain: Based on the parameters of which hand and turn are being hovered over, sets all descending gestures' .chain values to 'true' to allow correct class assignment and coloring.
    //Also calculates the correct spell list based on the descending gestures' sequence (built into $scope.beginningSequence) and pushes each possible spell to $scope.matchingSpells
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
    
    //$scope.matchingSpells: Filled with values in the $scope.hoverChain method based on which $scope.spellList spells begin with the currently selected $scope.beginningSequence
    $scope.matchingSpells = [];
    
    //$scope.spellList: Filled with comprehensive information for each spell
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