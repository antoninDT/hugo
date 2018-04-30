const chalk = require('chalk');
const say = require('say');

const { getRandomArrayItem } = require('./general.utility');

const getItemByIdWrapper = (game) => (itemId) => game.state.items.find((item) => item.id === itemId);
const getEnemyByIdWrapper = (game) => (enemyId) => game.state.enemies.find((enemy) => enemy.id === enemyId);
const getHealerByIdWrapper = (game) => (healersId) => game.state.healers.find((healers) => healers.id === healersId);

const showEnemyOrHealerWrapper = (game) => (showEnemyOrHealer) => {
  if (showEnemyOrHealer.isItem) {
    const chalkFormat1 = chalk.bold.blue;
    game.consoleOutPut({
        text: `
                * (${chalkFormat1(showEnemyOrHealer.name)})
       `,
    });
    return;
  }
  const chalkFormat2 = (showEnemyOrHealer.isEnemy)
    ? chalk.bold.red
    : chalk.bold.greenBright;
    game.consoleOutPut({
        text: `
                * (${chalkFormat2(showEnemyOrHealer.name)})
         `,
    });
};

const getCurrentRoomClueWrapper = (game) => (randomItemIdToWin) => {
  const roomContainingTheItem = game.state.rooms.find((room) => room.inventory.includes(randomItemIdToWin));
  const randomClueForRoom = getRandomArrayItem(roomContainingTheItem.clues);
  return randomClueForRoom;
};

const getCurrentItemClueWrapper = (game) => (randomItemIdToWin) => {
  const itemToWin = game.state.items.find((item) => item.id === randomItemIdToWin);
  const randomItemClue = getRandomArrayItem(itemToWin.clues);
  return randomItemClue;
};

const giveItemClueWrapper = (game) => (shouldSpeakClue = true) => {
  const randomItemIdToWin = game.getRandomItemIdToWin();
  const roomClue = game.getCurrentRoomClue(randomItemIdToWin);
  const itemClue = game.getCurrentItemClue(randomItemIdToWin);
  if (shouldSpeakClue) {
    say.speak(`

      Here is you clue: ${itemClue}

      and. ${roomClue}

      `, 'Princess',);
  }
  game.consoleOutPut({ text: 'Here is your clue:', color: 'yellowBright' });
  game.consoleOutPut({
      text: `

          ${chalk.bold.red(itemClue)} and ${chalk.bold.red(roomClue)}

       `,
    });
};

const api = {
  giveItemClueWrapper,
  getCurrentItemClueWrapper,
  getCurrentRoomClueWrapper,
  showEnemyOrHealerWrapper,
  getHealerByIdWrapper,
  getEnemyByIdWrapper,
  getItemByIdWrapper,
};
module.exports = api;
