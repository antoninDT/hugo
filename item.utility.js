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

const getRandomItemIdToWinWrapper = (game) => () => {
  let itemId = getRandomArrayItem(game.state.itemIdsToWin);
  while (game.state.player.inventory.includes(itemId)) {
    itemId = getRandomArrayItem(game.state.itemIdsToWin)
  }
  return itemId;
};

const craftItemWrapper = (game) => (itemName1, itemName2) => { //TODO: Make a different game mode where you have to craft the item
  const item1 = game.state.items.find((item) => item.name.toLowerCase() === itemName1.toLowerCase()); //TODO: Replace all the console.log with consoleOutPut
  const item2 = game.state.items.find((item) => item.name.toLowerCase() === itemName2.toLowerCase());
  if (!(itemName1 && itemName2)) {
    game.consoleOutPut({ text: 'Oops, you forgot to put the name of the items to craft' });
    return;
   }
  if (!(item1 && item2)) {
    game.consoleOutPut({ text: 'Missing or unknown item' });
    return;
  }
  const recipe = game.state.recipes.find((recipe) => recipe.ingredients.includes(item1.id) && recipe.ingredients.includes(item2.id));
  if (!recipe) {
    game.consoleOutPut({ text: `${item1.name} can not be crafted with ${item2.name}` });
    return;
  }
  if (!(game.state.player.inventory.includes(item1.id) && game.state.player.inventory.includes(item2.id))) {
    game.consoleOutPut({ text: `You do not have the items that you wish to craft with, make sure these items are in your inventory first...` });
    return;
  }
  game.spawnItem(recipe.result.id, game.state.player);
  game.moveItem(item1.id, game.state.player, game.state.trashCan);
  game.moveItem(item2.id, game.state.player, game.state.trashCan);
  game.consoleOutPut({ text: `${chalk.bold.green(recipe.result.name)} has been added to your inventory` })
};

const spawnItemWrapper = (game) => (itemIdToSpawn, destination) => {
   destination.inventory.push(itemIdToSpawn);
};

const api = {
  spawnItemWrapper,
  craftItemWrapper,
  getRandomItemIdToWinWrapper,
  giveItemClueWrapper,
  getCurrentItemClueWrapper,
  getCurrentRoomClueWrapper,
  showEnemyOrHealerWrapper,
  getHealerByIdWrapper,
  getEnemyByIdWrapper,
  getItemByIdWrapper,
};
module.exports = api;
