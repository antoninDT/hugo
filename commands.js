const commandLookup = {
    exit: {
        commands: [
            'exit',
            'bye',
            'doei',
            'doe doei',
        ],
        description: 'Type this in to exit the game',
    },
    goTo: {
        commands: [
            'go to',
            'ga naar',
        ],
        description: 'Type this in to go to another room',
    },
    help: {
        commands: [
            'help',
            'list of commands',
        ],
        description: 'Type this in to give a list of all possible commands (duh)',
    },
    showRooms: {
        commands: [
            'show rooms',
        ],
        description: 'Type this in to give a list of all the rooms',
    },
    lookAround: {
        commands: [
            'look around',
            'kijk',
            'ls',
        ],
        description: 'Describes the contents of a room',
    },
    whereAmI: {
        commands: [
            'where am i',
            'pwd',
        ],
        description: 'Tells you which room you are in',
    },
    clear: {
        commands: [
            'clear',
        ],
        description: 'Clears the screen (duh)',
    },
    showInventory: {
        commands: [
            'show inventory',
            'inventory',
            'what do i have',
        ],
        description: 'Shows the items in your inventory',
    },
    transferItemToPlayerInventory: {
        commands: [
            'pick up',
            'grab',
            'get',
        ],
        description: 'Picks up an item',
    },
    transferItemToRoomInventory: {
        commands: [
            'drop',
            'ditch',
        ],
        description: 'Drops an item (Obviously)'
    },
    showClue: {
        commands: [
            'give me a clue',
            'show me a clue',
            'clue'
        ],
        description: 'gives a clue about the item you are looking for',
    },
    testVoices: {
        commands: [
            'test voices',
            'say something',
        ],
        description: 'Plays all the different voices',
    },
};


module.exports = commandLookup;
