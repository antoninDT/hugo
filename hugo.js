require('babel-register');
const chalk = require('chalk');

const { promptForUserCommandWrapper } = require('./console.utility');
const { addSentenceToSpeechQueue } = require('./voices.utility');

const { getNewGame } = require('./game.js');

const game = getNewGame();

promptForUserCommand = promptForUserCommandWrapper(game);

const startGame = () => {
    game.movePlayerToRandomRoom();
    game.welcomeMessage();
    promptForUserCommand();
};
startGame();
