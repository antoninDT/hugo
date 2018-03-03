const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const say = require('say');

//TODO: Find out to change the font/increase the size of the font
const itemsLookup = require('./items.js');
const roomsLookup = require('./rooms.js');
const commandLookup = require('./commands.js');

const commands = Object.values(commandLookup);
const items = Object.values(itemsLookup);
const rooms = Object.values(roomsLookup);

const defaultRoomId = roomsLookup.hall.id;
const player = {
    health: 100,
    maxHealth: 100,
    currentRoomId: defaultRoomId,
    inventory: [],
};

const getItemById = (itemId) => items.find((item) => item.id === itemId);

const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const basicCFontOptions = {
    font: 'simple3d',
};

const basicBoxOptions = {
    padding: 1,
    borderStyle: {
        topLeft: '@',
        topRight: '@',
        bottomLeft: '@',
        bottomRight: '@',
        horizontal: '\\',
        vertical: '/'
    }
};

const game = {
    state: {
        player,
        rooms,
        items,
        itemIdToWin: items[Math.floor(Math.random() * items.length)].id,
    },
    actions: {
        hurtPlayer(amount) {
            if (!amount) { return; }
            game.state.player.health -= amount;
            game.showPlayerStatus();
            // TODO: Check if the player died and show the "lose" screen for it
            // TODO: If the player is not dead, then show the current health of the player
            // TODO: Use this function later
        },
        healPlayer(amount) { // TODO: Use this function later
            if (!amount) { return; }
            game.state.player.health += amount;
            if (game.state.player.health > game.state.player.maxHealth) {
                game.state.player.health = game.state.player.maxHealth;
            }
            game.showPlayerStatus();
        },
        movePlayerToRandomRoom() {
            const randomRoom = getRandomArrayItem(game.state.rooms);
            this.movePlayerToRoom(randomRoom.id);
        },
        randomlyDistributeItemsToRooms() {
            let availableItems = [...game.state.items];
            const dealRandomItemToRoom = (room) => {
                if (!availableItems.length) { return; }
                const itemToDealOut = getRandomArrayItem(availableItems);
                room.inventory.push(itemToDealOut.id);
                availableItems = availableItems.filter((item) => item.id !== itemToDealOut.id);
            };
            while (availableItems.length) {
                rooms.forEach(dealRandomItemToRoom);
            }
        },
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
                console.log(chalk.white(`
        
                                    😂😂😂
                    You forgot to put the name of the item to pick up hoor... try again! 
                                    😂😂😂
        
                `));
                return;
            }
            const room = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
            if (!room.inventory || !room.inventory.length) {
                console.log(chalk.white(`
        
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                    room is empty... 
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️
        
                `));
                return;
            }
            const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
            if (!item || !room.inventory.includes(item.id)) {
                console.log(chalk.white(`
        
                        The current room does not have "${chalk.bold.red(itemName)}"
        
                `));
                return;
            }
            this.moveItem(item.id, room, player);
            console.log(chalk.white(`
    
                    You have put "${chalk.bold.red(item.name)}" into your inventory
    
            `));
            if (game.didPlayerWin()) {
                game.showWinScreen();
            }
        },
        moveItemFromPlayerToCurrentRoom(itemName) {
            if (!itemName) {
                console.log(chalk.white(`
        
                                    😂😂😂
                    You forgot to put the name of the item to drop up hoor... try again! 
                                    😂😂😂
        
                `));
                return;
            }
            if (!game.state.player.inventory || !game.state.player.inventory.length) {
                console.log(chalk.white(`
        
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                    Inventory is empty... 
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️
        
                `));
                return;
            }
            const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
            if (!item || !game.state.player.inventory.includes(item.id)) {
                console.log(chalk.white(`
        
                         "${chalk.bold.red(itemName)}" is not in your inventory...
        
                `));
                return;
            }
            this.moveItem(item.id, game.state.player, game.getCurrentRoom());
            console.log(chalk.white(`
    
                    You have dropped "${chalk.bold.red(item.name)}" 
    
            `));
        },
    },
    didPlayerWin() {
        return (this.state.player.inventory.includes(this.state.itemIdToWin));
    },
    goodbye() {
        const goodbyeMessageOptions = {
            ...basicCFontOptions,
            font: '3d',
            space: false,
            letterSpacing: 8,
            colors: ['blue', 'white'],
        };
        say.speak('DOE DOEI', 'ellen', 0.5);
        CFonts.say('DOE', goodbyeMessageOptions);
        CFonts.say('DOEI', goodbyeMessageOptions);
        CFonts.say('!!', goodbyeMessageOptions);
        process.exit();
    },
    showWinScreen() {
        console.log(chalk.magentaBright(`
            Congratulations! You have found the hidden Item!
        `));
        this.goodbye();
    },
    showRooms() {
        console.log(`${chalk.italic.yellow('Here are the rooms:')}`);
        const getRoomName = (room) => room.name;
        const showRoomName = (roomName) => console.log(chalk.white(`    * ${chalk.bold.greenBright(roomName)}`));
        this.state.rooms
            .map(getRoomName)
            .forEach(showRoomName);
    },
    getCurrentRoom() {
        const result = this.state.rooms.find((room) => room.id === this.state.player.currentRoomId);
        return result;
    },
    showItem(item) {
        console.log(chalk.white(chalk.white(`
                * (${chalk.bold.blue(item.name)}) 
        `)));
    },
    showPlayerStatus() {
        console.log(`
               You have ${this.state.player.health} health out of ${this.state.player.maxHealth}
        `);
    },
    showCurrentRoomContents() {
        const currentRoom = this.getCurrentRoom();
        if (!(currentRoom.inventory && currentRoom.inventory.length)) {
            console.log(chalk.white(`
    
            You look around and notice that the room is empty...
            💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩 
    
        `));
            return;
        }
        console.log(chalk.yellow(`
    
            You look around and notice the following items: 
    
        `));
        currentRoom.inventory
            .map(getItemById)
            .forEach(this.showItem);
    },
    showInventory() {
        if (!this.state.player.inventory.length) {
            console.log(chalk.white(`
    
                There is nothing in your Inventory... 
            
                          😐😐😐
    
            `));
            return;
        }
        console.log(chalk.yellow(`
    
            You have the following items: 
    
        `));
        this.state.player.inventory
            .map(getItemById)
            .forEach(this.showItem);
    },
    // TODO: Add a "show status" function and then use it.
    clearScreen() {
        console.log('\x1Bc');
    },
    sampleVoices() {
        const voices = [
            'Alex',
            'Alice',
            'Alva',
            'Amelie',
            'Anna',
            'Carmit',
            'Damayanti',
            'Daniel',
            'Diego',
            'Ellen',
            'Fiona',
            'Fred',
            'Ioana',
            'Joana',
            'Jorge',
            'Juan',
            'Kanya',
            'Karen',
            'Kyoko',
            'Laura',
            'Lekha',
            'Luca',
            'Luciana',
            'Maged',
            'Mariska',
            'Mei-Jia',
            'Melina',
            'Milena',
            'Moira',
            'Monica',
            'Nora',
            'Paulina',
            'Samantha',
            'Sara',
            'Satu',
            'Sin-ji',
            'Tessa',
            'Thomas',
            'Ting-Ting',
            'Veena',
            'Victoria',
            'Xander',
            'Yelda',
            'Yuna',
            'Yuri',
            'Zosia',
            'Zuzana',
        ];

        const sampleVoice = (index = 0) => {
            const voice = voices[index];
            if (!voice) { return; }
            console.log(`DEBUG: sampleVoice() voice: ${voice}`); // TODO Kill this line
            const speakSampleSentence = (voice) => {
                const sampleSentence = 'This is a sample sentence for the game. La la la la!';
                say.speak(sampleSentence, voice, 1, () => sampleVoice(index + 1));
            };
            const speakSampleSentenceForVoice = () => { speakSampleSentence(voice); };
            const speakAnnouncement = () => { say.speak(`Sample voice for: ${voice}`, 'Samantha', 1, speakSampleSentenceForVoice); };
            speakAnnouncement();
        };
        sampleVoice();
    },
    welcomeMessage() { // TODO: Add promises so that voice can work
        const welcomeMessageOptions = {
            ...basicCFontOptions,
            font: 'block',
            colors: ['candy', 'candy'],
        };
        this.clearScreen();
        CFonts.say('Welkom|bij|Hugo|Hulp', welcomeMessageOptions);
        say.speak('Welkom bij Hugo Hulp', 'ellen', 0.5);
        console.log();
        console.log(`${chalk.bold.magenta('Can you find the hidden item??')}`);
        console.log();
        this.showRooms();
        this.showPlayerStatus();
        this.showCurrentRoom();
        this.giveItemClue();
    },
    getCurrentItemClue() {
        const itemToWin = items.find((item) => item.id === this.state.itemIdToWin);
        const randomItemClue = getRandomArrayItem(itemToWin.clues);
        return randomItemClue;
    },

    getCurrentRoomClue() {
        const roomContainingTheItem = rooms.find((room) => room.inventory.includes(this.state.itemIdToWin));
        const randomClueForRoom = getRandomArrayItem(roomContainingTheItem.clues);
        return randomClueForRoom;
    },

    giveItemClue() {
        console.log(chalk.yellow('Here is your clue:'));
        console.log(chalk.white(`
                                 
            ${chalk.bold.red(this.getCurrentItemClue())} and ${chalk.bold.red(this.getCurrentRoomClue())}
            
        `));
    },
    showCurrentRoom() {
        const currentRoomName = this.getCurrentRoom().name;
        console.log(chalk.white(`
     
            You are in the ${chalk.bold.greenBright(currentRoomName)}.
     
        `));
    },
    showHelp() {
        const commandBoxOptions = {
            ...basicBoxOptions,
            borderColor: 'green',
            backgroundColor: 'blue',
            borderStyle: {
                topLeft: 'ᒥ',
                topRight: 'ᒣ',
                bottomLeft: 'ᒪ',
                bottomRight: 'ᒧ',
                horizontal: '-',
                vertical: '|'
            }
        };
        console.log(boxen(chalk.yellow('List of commands'), commandBoxOptions));
        commands.forEach((command) => {
            console.log(chalk.white(`  * ${chalk.bold.red(command.commands[0])}: ${chalk.white(command.description)}`));
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
