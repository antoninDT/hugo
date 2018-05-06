require('babel-register');
const chalk = require('chalk');
const say = require('say');

const readline = require('readline');

const { getNewGame } = require('./game.js');
const roomsLookup = require('./data/rooms.json'); // TODO REFACTOR: Move this into game.js
const itemsLookup = require('./data/items.json'); // TODO REFACTOR: Move this into game.js
const commandLookup = require('./data/commands.json'); // TODO REFACTOR: Move this to the same file as whomever uses it

const lineReader = readline.createInterface({ // TODO REFACTOR: Move this into the console.utility.js file (export it from there)
    input: process.stdin,
    output: process.stdout
});

const rooms = Object.values(roomsLookup); // TODO REFACTOR: Move this to whichever utility file is using it...
const game = getNewGame();

const processInput = (prompt, handler) => { // TODO REFACOR: Move this into console.utility
    lineReader.question(prompt, handler);
};

const getSanitizedText = (text) => { // TODO REFACTOR: this should be moved into some kind of text utility file
    const punctuationRegex = /[.,\/#!$%^&*;:{}=\-_`~()?@]/g;
    const result = text
        .toLowerCase()
        .replace(punctuationRegex, '')
        .replace(' the ', '')
        .trim();
    return result;
};

const promptForUserCommand = (game) => { // TODO REFACTOR: This should be in the console.utility.js file. WARNING: it may need some special massaging to make it work properly.
    const handleCommand = (result) => {
        const sanitizedInput = getSanitizedText(result);
        let itemParts;
        let itemName;
        let specificCommandUsed;
        const doesSanitizedInputStartWithCommand = (command) => sanitizedInput.startsWith(command);

        const handleGoToCommand = () => {
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
              return;
          }
          const roomId = foundRoom.id;
          game.movePlayerToRoom(roomId);
        };

        switch (true) { // TODO REFACTOR: Consider refactoring some of the larger (greater than 4 lines) cases into functions
            case (commandLookup.exit.commands.includes(sanitizedInput)):
                game.goodbye();
                return;
            case (commandLookup.goTo.commands.some(doesSanitizedInputStartWithCommand)):
                handleGoToCommand();
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
                game.moveItemFromCurrentRoomToPlayer(itemName, sanitizedInput);
                break;
            case (commandLookup.transferItemToRoomInventory.commands.some(doesSanitizedInputStartWithCommand)):
                specificCommandUsed = commandLookup.transferItemToRoomInventory.commands.find(doesSanitizedInputStartWithCommand);
                itemParts = sanitizedInput
                    .split(specificCommandUsed);
                itemName = getSanitizedText(itemParts[1]);
                game.moveItemFromPlayerToCurrentRoom(itemName);
                break;
            case (commandLookup.showClue.commands.includes(sanitizedInput)):
                game.giveItemClue();
                break;
            case (commandLookup.testVoices.commands.includes(sanitizedInput)):
                game.sampleVoices();
                break;
            case (commandLookup.showPlayerStatus.commands.includes(sanitizedInput)):
                game.showPlayerStatus(true,false);
                break;
             case (sanitizedInput === 'barf'): // TODO: This is "secret" it won't appear in help. Should disable this in the future
                 console.log(`

                 DEBUG:: BARFING


                 game.state: ${JSON.stringify(game.state)}


                 itemsLookup: ${JSON.stringify(itemsLookup)}


                 roomsLookup: ${JSON.stringify(roomsLookup)}

                 commandsLookup: ${JSON.stringify(commandLookup)}

                 `);
                 console.dir(game.state);
                 break;
             case (sanitizedInput === 'die'): // TODO: This is "secret" it won't appear in help. Should disable this in the future
                 game.hurtPlayer(100);
                 break;
             case (commandLookup.craftItem.commands.some(doesSanitizedInputStartWithCommand)): //Make sure that when no items are put after the word "craft" that the game says an error warning instead of crashing
                     specificCommandUsed = commandLookup.craftItem.commands.find(doesSanitizedInputStartWithCommand);
                     itemParts = sanitizedInput
                         .split(specificCommandUsed);
                     const seperatedItems = itemParts[1].split(' and ');
                     itemName1 = getSanitizedText(seperatedItems[0]);
                     itemName2 = getSanitizedText(seperatedItems[1]);
                     game.craftItem(itemName1, itemName2);
                     break;
            default:
                say.speak(`Oops please enter another command hoor. Type in "help" for a list of commands`, 'princess');
                game.consoleOutPut({
                  text: `

                      Oops please enter another command hoor. Type in "help" for a list of commands

                  `,
                });
        }
        promptForUserCommand(game);
    };
    processInput('Please enter a command:', handleCommand); //TODO: Add color to the prompt
};

const startGame = () => {
    game.movePlayerToRandomRoom();
    game.randomlyDistributeItemsToRooms();
    game.randomlyDistributeHealersToRooms();
    game.randomlyDistributeEnemiesToRooms();
    game.welcomeMessage();
    promptForUserCommand(game);
};
startGame();
