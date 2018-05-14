require('babel-register');
const chalk = require('chalk');

const { promptForUserCommandWrapper } = require('./console.utility');
const { addSentenceToSpeechQueue } = require('./voices.utility');

const { getNewGame } = require('./game.js');

const game = getNewGame();

promptForUserCommand = promptForUserCommandWrapper(game);

const startGame = () => {
    game.movePlayerToRandomRoom();
    game.randomlyDistributeItemsToRooms();
    game.randomlyDistributeHealersToRooms();
    game.randomlyDistributeEnemiesToRooms();
    game.welcomeMessage();
    promptForUserCommand();
};
startGame();

// TODO: Make another promptForUserCommand but maybe for a "Choose gamemode" screen
