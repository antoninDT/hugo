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

const getSanitizedText = (text) => {
    const punctuationRegex = /[.,\/#!$%^&*;:{}=\-_`~()?@]/g;
    const result = text
        .toLowerCase()
        .replace(punctuationRegex, '')
        .replace(' the ', '')
        .trim();
    return result;
};

const promptForUserCommand = () => {
    const handleCommand = (result) => {
        const sanitizedInput = getSanitizedText(result);
        let itemParts;
        let itemName;
        let specificCommandUsed;
        const doesSanitizedInputStartWithCommand = (command) => sanitizedInput.startsWith(command);
         switch (true) {
            case (commandLookup.exit.commands.includes(sanitizedInput)):
                game.goodbye();
                return;
            case (commandLookup.goTo.commands.some(doesSanitizedInputStartWithCommand)):
                specificCommandUsed = commandLookup.goTo.commands.find(doesSanitizedInputStartWithCommand);
                const roomParts = sanitizedInput
                    .split(specificCommandUsed);
                const roomNameAsInput = roomParts[1];
                const roomName = getSanitizedText(roomNameAsInput);
                const foundRoom = rooms
                    .find((room) => getSanitizedText(room.name) === roomName);
                if (!foundRoom) {
                    console.log(chalk.yellow(`
                    
                        Oops this room does not exist: ${chalk.bold.red(roomNameAsInput)}
                    
                    `));
                    break;
                }
                const roomId = foundRoom.id;
                game.actions.movePlayerToRoom(roomId);
                break;
            case (commandLookup.help.commands.includes(sanitizedInput)):
                game.showHelp();
                break;
            case (commandLookup.showRooms.commands.includes(sanitizedInput)):
                game.showRooms();
                break;
            case (commandLookup.whereAmI.commands.includes(sanitizedInput)):
                game.showCurrentRoom();
                break;
            case (!sanitizedInput): {
                break;
            }
            case (commandLookup.clear.commands.includes(sanitizedInput)):
                game.clearScreen();
                break;
            case (commandLookup.lookAround.commands.includes(sanitizedInput)):
                game.showCurrentRoomContents();
                break;
             case (commandLookup.showInventory.commands.includes(sanitizedInput)):
                game.showInventory();
                break;
            case (commandLookup.transferItemToPlayerInventory.commands.some(doesSanitizedInputStartWithCommand)):
                specificCommandUsed = commandLookup.transferItemToPlayerInventory.commands.find(doesSanitizedInputStartWithCommand);
                itemParts = sanitizedInput
                    .split(specificCommandUsed);
                itemName = getSanitizedText(itemParts[1]);
                game.actions.moveItemFromCurrentRoomToPlayer(itemName, sanitizedInput);
                break;
            case (commandLookup.transferItemToRoomInventory.commands.some(doesSanitizedInputStartWithCommand)):
                specificCommandUsed = commandLookup.transferItemToRoomInventory.commands.find(doesSanitizedInputStartWithCommand);
                itemParts = sanitizedInput
                    .split(specificCommandUsed);
                itemName = getSanitizedText(itemParts[1]);
                game.actions.moveItemFromPlayerToCurrentRoom(itemName);
                break;
            case (commandLookup.showClue.commands.includes(sanitizedInput)):
                game.giveItemClue();
                break;
            case (commandLookup.testVoices.commands.includes(sanitizedInput)):
                game.sampleVoices();
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
