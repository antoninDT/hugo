const readline = require('readline');

const itemsLookup = require('./items.js');
const roomsLookup = require('./rooms.js');

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const items = Object.values(itemsLookup);
const rooms = Object.values(roomsLookup);
const defaultRoomId = roomsLookup.hall.id;

const player = {
    currentRoomId: defaultRoomId,
    inventory: [],
};

const goodbye = () => {
    console.log(`
    
    
    @@@@@@@@@@@@@@@@@@@@@
        DOE DOEI!!!!!!
    @@@@@@@@@@@@@@@@@@@@@
    
    
    `);
    process.exit();
};

const didPlayerWin = () => {
    return (player.inventory.includes(itemIdToWin));
};

const showWinScreen = () => {
    console.log(`

        Congratulations! You have found the hidden Item!

    `);
    goodbye();
};

const moveItem = (itemIdToMove, source, destination) => {
    const newSourceItems = source.inventory.filter((itemId) => itemId !== itemIdToMove);
    source.inventory = newSourceItems;
    destination.inventory.push(itemIdToMove);
};

const moveItemFromCurrentRoomToPlayer = (itemName) => {
    if (!itemName) {
        console.log(`
        
                                    😂😂😂
        You forgot to put the name of the item to pick up stupid... try again! 
                                    😂😂😂
        
        `);
        return;
    }
    const room = rooms.find((room) => room.id === player.currentRoomId);
    if (!room.inventory || !room.inventory.length) {
        console.log(`
        
        🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
        room is empty... 
        🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️
        
        `);
        return;
    }
    const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
    if (!item || !room.inventory.includes(item.id)) {
        console.log(`
        
            The current room does not have "${itemName}"
        
        `);
        return;
    }
    moveItem(item.id, room, player);
    console.log(`
    
        You have put "${item.name}" into your inventory
    
    `);
    if (didPlayerWin()) {
        showWinScreen();
    }
};


const commandLookup = { // TODO: Refactor this to its own file
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
    tranferItemToRoomInventory: {}, // TODO: Add this command
};

const commands = Object.values(commandLookup);

const itemIdToWin = itemsLookup.djKhaled.id; // TODO: make this random

const showRooms = () => {
    console.log('Here are the rooms:');
    const getRoomName = (room) => room.name;
    const showRoomName = (roomName) => console.log(`    * ${roomName}`);
    rooms
        .map(getRoomName)
        .forEach(showRoomName);
};

const getCurrentRoom = () => {
    const result = rooms.find((room) => room.id === player.currentRoomId);
    return result;
};

const getItemById = (itemId) => items.find((item) => item.id === itemId);

const showItem = (item) => {
    console.log(`
                * (${item.name}) ${item.description || ''}
        `);
};

const showCurrentRoomContents = () => {
    const currentRoom = getCurrentRoom();
    if (!(currentRoom.inventory && currentRoom.inventory.length)) {
        console.log(`
    
            You look around and notice that the room is empty...
            💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩 
    
        `);
        return;
    }
    console.log(`
    
        You look around and notice the following items: 
    
    `);
    currentRoom.inventory
        .map(getItemById)
        .forEach(showItem);
};

const showInventory = () => {
    if (!player.inventory.length) {
        console.log(`
    
            There is nothing in your Inventory... 
            
                          😐😐😐
    
        `);
        return;
    }
    console.log(`
    
        You have the following items: 
    
    `);
    player.inventory
        .map(getItemById)
        .forEach(showItem);
};

const clearScreen = () => {
    const numberOfLines = 100;
    for (let i = 0; i < numberOfLines; i++) {
        console.log();
    }
};

// TODO: Add a "show status" function and then use it.

const welcomeMessage = () => {
    console.log();
    console.log(' ######### Welkom bij Hugo Hulp ######### ');
    console.log();
    console.log('Can you find the hidden item??');
    showRooms();
    showCurrentRoom();
};

const showCurrentRoom = () => {
    const currentRoomName = getCurrentRoom().name;
    console.log(`
     
     You are in the ${currentRoomName}.
     
     `);
};

const showHelp = () => {
    console.log(' ===== List of commands =====');
    commands.forEach((command) => {
        console.log(`  * ${command.command}: ${command.description}`);
    });
};

const movePlayerToRoom = (roomId = defaultRoomId) => {
    player.currentRoomId = roomId;
    showCurrentRoom();
};

const processInput = (prompt, handler) => {
    lineReader.question(prompt, handler);
};

const promptForUserCommand = () => {
    const handleCommand = (result) => {
        const sanitizedInput = result
            .toLowerCase()
            .trim();
        switch (true) {
            case (sanitizedInput.startsWith(commandLookup.exit.command)):
                goodbye();
                return;
            case (sanitizedInput.startsWith(commandLookup.goTo.command)):
                const roomParts = sanitizedInput
                    .split(commandLookup.goTo.command);
                const roomName = roomParts[1]
                    .toLowerCase()
                    .replace('the', '')
                    .trim();
                const foundRoom = rooms.find((room) => room.name.toLowerCase() === roomName);
                if (!foundRoom) {
                    console.log(`
                    
                        Oops this room does not exist: ${roomName}
                    
                    `);
                    break;
                };
                const roomId = foundRoom.id;
                movePlayerToRoom(roomId);
                break;
            case (sanitizedInput.startsWith(commandLookup.help.command)):
                showHelp();
                break;
            case (sanitizedInput.startsWith(commandLookup.showRooms.command)):
                showRooms();
                break;
            case (sanitizedInput.startsWith(commandLookup.whereAmI.command)):
                showCurrentRoom();
                break;
            case (!sanitizedInput): {
                break;
            }
            case (sanitizedInput.startsWith(commandLookup.clear.command)):
                clearScreen();
                break;
            case (sanitizedInput.startsWith(commandLookup.lookAround.command)):
                showCurrentRoomContents();
                break;
            case (sanitizedInput.startsWith(commandLookup.showInventory.command)):
                showInventory();
                break;
            case (sanitizedInput.startsWith(commandLookup.transferItemToPlayerInventory.command)):
                const itemParts = sanitizedInput
                    .split(commandLookup.transferItemToPlayerInventory.command);
                const itemName = itemParts[1]
                    .toLowerCase()
                    .replace('the', '')
                    .trim();
                moveItemFromCurrentRoomToPlayer(itemName);
                break;
            default:
                console.log(`
                
                    Oops please enter another command hoor. Type in "help" for a list of commands
                    
                `);
        }
        promptForUserCommand();
    };
    processInput('Please enter a command:', handleCommand);
};

welcomeMessage();
promptForUserCommand();
