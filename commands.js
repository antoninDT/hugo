const commandLookup = {
    exit: {
        command: 'exit',
        description: 'Type this in to exit the game',
    },
    goTo: {
        command: 'go to',
        description: 'Type this in to go to another room',
    },
    help: {
        command: 'help',
        description: 'Type this in to give a list of all possible commands (duh)',
    },
    showRooms: {
        command: 'show rooms',
        description: 'Type this in to give a list of all the rooms',
    },
    lookAround: {
        command: 'look around',
        description: 'Describes the contents of a room',
    },
    whereAmI: {
        command: 'where am i',
        description: 'Tells you which room you are in',
    },
    clear: {
        command: 'clear',
        description: 'Clears the screen (duh)',
    },
    showInventory: {
        command: 'show inventory',
        description: 'Shows the items in your inventory',
    },
    transferItemToPlayerInventory: {
        command: 'pick up',
        description: 'Picks up an item',
    },
    transferItemToRoomInventory: {
        command: 'drop',
        description: 'Drops an item (Obviously)'
    },
    showClue: {
        command: 'give me a clue',
        description: 'gives a clue about the item you are looking for',
    },
};


module.exports = commandLookup;
