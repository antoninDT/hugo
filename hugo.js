require('babel-register');
const chalk = require('chalk');


const readline = require('readline');

const { getNewGame } = require('./game.js');
const roomsLookup = require('./rooms.js');
const commandLookup = require('./commands.js');

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const rooms = Object.values(roomsLookup);
const game = getNewGame();

const processInput = (prompt, handler) => {
    lineReader.question(prompt, handler);
};

const promptForUserCommand = () => {
    const handleCommand = (result) => {
        const sanitizedInput = result
            .toLowerCase()
            .trim();
        let itemParts;
        let itemName;
        switch (true) {
            case (sanitizedInput.startsWith(commandLookup.exit.command)):
                game.goodbye();
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
                    console.log(chalk.yellow(`
                    
                        Oops this room does not exist: ${chalk.bold.red(roomName)}
                    
                    `));
                    break;
                }
                const roomId = foundRoom.id;
                game.actions.movePlayerToRoom(roomId);
                break;
            case (sanitizedInput.startsWith(commandLookup.help.command)):
                game.showHelp();
                break;
            case (sanitizedInput.startsWith(commandLookup.showRooms.command)):
                game.showRooms();
                break;
            case (sanitizedInput.startsWith(commandLookup.whereAmI.command)):
                game.showCurrentRoom();
                break;
            case (!sanitizedInput): {
                break;
            }
            case (sanitizedInput.startsWith(commandLookup.clear.command)):
                game.clearScreen();
                break;
            case (sanitizedInput.startsWith(commandLookup.lookAround.command)):
                game.showCurrentRoomContents();
                break;
            case (sanitizedInput.startsWith(commandLookup.showInventory.command)):
                game.showInventory();
                break;
            case (sanitizedInput.startsWith(commandLookup.transferItemToPlayerInventory.command)):
                itemParts = sanitizedInput
                    .split(commandLookup.transferItemToPlayerInventory.command);
                itemName = itemParts[1]
                    .toLowerCase()
                    .replace('the', '')
                    .trim();
                game.actions.moveItemFromCurrentRoomToPlayer(itemName, sanitizedInput);
                break;
            case (sanitizedInput.startsWith(commandLookup.transferItemToRoomInventory.command)):
                itemParts = sanitizedInput
                    .split(commandLookup.transferItemToRoomInventory.command);
                itemName = itemParts[1]
                    .toLowerCase()
                    .replace('the', '')
                    .trim();
                game.actions.moveItemFromPlayerToCurrentRoom(itemName);
                break;
            case (sanitizedInput.startsWith(commandLookup.showClue.command)):
                game.giveItemClue();
                break;
            default:
                console.log(chalk.white(`
                
                    Oops please enter another command hoor. Type in "help" for a list of commands
                    
                `));
        }
        promptForUserCommand();
    };
    processInput('Please enter a command:', handleCommand); //TODO: Add color to the prompt
};

const startGame = () => {
    game.actions.movePlayerToRandomRoom();
    game.actions.randomlyDistributeItemsToRooms();
    game.welcomeMessage();
    promptForUserCommand();
};
startGame();
