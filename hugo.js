require('babel-register');
const chalk = require('chalk');
const say = require('say');

const { promptForUserCommandWrapper } = require('./console.utility');

const { getNewGame } = require('./game.js');

const game = getNewGame();

promptForUserCommand = promptForUserCommandWrapper(game);

promptForUserCommand();

const startGame = () => {
    game.movePlayerToRandomRoom();
    game.randomlyDistributeItemsToRooms();
    game.randomlyDistributeHealersToRooms();
    game.randomlyDistributeEnemiesToRooms();
    game.welcomeMessage();
    promptForUserCommand(game);
};
startGame();
