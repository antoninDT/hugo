require('babel-register');
const chalk = require('chalk');

const { promptForUserCommandWrapper, initialStartUpPromptWrapper } = require('./console.utility');
const { addSentenceToSpeechQueue } = require('./voices.utility');

const { getNewGame } = require('./game.js');

const game = getNewGame();

promptForUserCommand = promptForUserCommandWrapper(game);
initialStartUpPrompt = initialStartUpPromptWrapper(game);

const startGame = (shouldShowStartMenu = true) => { // TODO: Make sure that the initialStartUpPrompt has time to Implement its own commands before starting up the game
   // if (shouldShowStartMenu) { // TODO: Implement this
   //   initialStartUpPrompt();
   //   startGame(false);
   // }
    game.movePlayerToRandomRoom();
    game.randomlyDistributeItemsToRooms();
    game.randomlyDistributeHealersToRooms();
    game.randomlyDistributeEnemiesToRooms();
    game.welcomeMessage();
    promptForUserCommand();
};
startGame();

// TODO: Make another promptForUserCommand but maybe for a "Choose gamemode" screen
