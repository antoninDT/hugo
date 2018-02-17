const itemsLookup = require('./items.js');
const roomsLookup = require('./rooms.js');
const commandLookup = require('./commands.js');

const commands = Object.values(commandLookup);
const items = Object.values(itemsLookup);
const rooms = Object.values(roomsLookup);

const defaultRoomId = roomsLookup.hall.id;
const player = {
    currentRoomId: defaultRoomId,
    inventory: [],
};

const getItemById = (itemId) => items.find((item) => item.id === itemId);

const game = {
    state: {
        player,
        rooms,
        itemIdToWin: items[Math.floor(Math.random() * items.length)].id,
    },
    actions: {
        moveItem(itemIdToMove, source, destination) {
            const newSourceItems = source.inventory.filter((itemId) => itemId !== itemIdToMove);
            source.inventory = newSourceItems;
            destination.inventory.push(itemIdToMove);
        },
        movePlayerToRoom(roomId = defaultRoomId) {
            game.state.player.currentRoomId =  roomId;
            game.showCurrentRoom();
        },
        moveItemFromCurrentRoomToPlayer(itemName) {
            if (!itemName) {
                console.log(`
        
                                    😂😂😂
                    You forgot to put the name of the item to pick up hoor... try again! 
                                    😂😂😂
        
                `);
                return;
            }
            const room = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
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
            this.moveItem(item.id, room, player);
            console.log(`
    
                    You have put "${item.name}" into your inventory
    
            `);
            if (game.didPlayerWin()) {
                game.showWinScreen();
            }
        },
    },
    didPlayerWin() {
        return (this.state.player.inventory.includes(this.state.itemIdToWin));
    },
    goodbye() {
        console.log(`
    
    
            @@@@@@@@@@@@@@@@@@@@@
                DOE DOEI!!!!!!
            @@@@@@@@@@@@@@@@@@@@@
    
    
        `);
        process.exit();
    },
    showWinScreen() {
        console.log(`

            Congratulations! You have found the hidden Item!

        `);
        this.goodbye();
    },
    showRooms() {
        console.log('Here are the rooms:');
        const getRoomName = (room) => room.name;
        const showRoomName = (roomName) => console.log(`    * ${roomName}`);
        this.state.rooms
            .map(getRoomName)
            .forEach(showRoomName);
    },
    getCurrentRoom() {
        const result = this.state.rooms.find((room) => room.id === this.state.player.currentRoomId);
        return result;
    },
    showItem(item) {
        console.log(`
                * (${item.name}) ${item.description || ''}
        `);
    },
    showCurrentRoomContents() {
        const currentRoom = this.getCurrentRoom();
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
            .forEach(this.showItem);
    },
    showInventory() {
        if (!this.state.player.inventory.length) {
            console.log(`
    
                There is nothing in your Inventory... 
            
                          😐😐😐
    
            `);
            return;
        }
        console.log(`
    
            You have the following items: 
    
        `);
        this.state.player.inventory
            .map(getItemById)
            .forEach(this.showItem);
    },
    // TODO: Add a "show status" function and then use it.
    clearScreen() {
        const numberOfLines = 100;
        for (let i = 0; i < numberOfLines; i++) {
            console.log();
        }
    },
    welcomeMessage() {
        console.log();
        console.log(' ######### Welkom bij Hugo Hulp ######### ');
        console.log();
        console.log('Can you find the hidden item??');
        this.showRooms();
        this.showCurrentRoom();
    },
    showCurrentRoom() {
        const currentRoomName = this.getCurrentRoom().name;
        console.log(`
     
            You are in the ${currentRoomName}.
     
        `);
    },
    showHelp() {
        console.log(' ===== List of commands =====');
        commands.forEach((command) => {
            console.log(`  * ${command.command}: ${command.description}`);
        });
    },
};

const getNewGame = () => {
    const result = {
        ...game,
    };
    return result;
};

const api = {
    getNewGame,
};

module.exports = api;
