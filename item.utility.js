const chalk = require('chalk');

const { getRandomArrayItem } = require('./general.utility');
const { addSentenceToSpeechQueue } = require('./voices.utility');

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

const getRandomRecipeIngredientWrapper = (game) => (recipe) => {
  let randomIngredientOfRecipe = getRandomArrayItem(recipe.ingredients);
  while (game.state.player.inventory.includes(randomIngredientOfRecipe)) {
    randomIngredientOfRecipe = getRandomArrayItem(recipe.ingredients)
  }
  return randomIngredientOfRecipe;
};

const getCurrentRecipeClueWrapper = (game) => (randomRecipeIdToWin) => {
   const recipeToWin = game.state.recipes.find((recipe) => recipe.result.id === randomRecipeIdToWin);
   const randomRecipeClue = getRandomArrayItem(recipeToWin.result.clues);
   const randomIngredientOfRecipeToWin = game.getRandomRecipeIngredient(recipeToWin);
   const randomIngredientOfRecipeToWinItem = game.getItemById(randomIngredientOfRecipeToWin);
   const randomIngredientRoomClue = game.getCurrentRoomClue(randomIngredientOfRecipeToWinItem.id);
   return { randomRecipeClue, randomIngredientRoomClue };
};

const getCurrentItemClueWrapper = (game) => (randomItemIdToWin) => {
  const itemToWin = game.state.items.find((item) => item.id === randomItemIdToWin);
  const randomItemClue = getRandomArrayItem(itemToWin.clues);
  return randomItemClue;
};

const giveItemClueWrapper = (game) => (shouldSpeakClue = true) => {
  const goalType = game.state.player.currentGoalId;
  const gameTypeIds = { // TODO: refactor this to some other shared file.
    craftOneItem: 1,
    findOneItem: 2,
    findTwoItems: 3, // TODO: Eventually update the goals.json schema to allow editors to specify how many items to craft/find (wouldn't need typeId 3 anymore)
  };
  switch (game.state.player.currentGoalId) {
    case (gameTypeIds.craftOneItem): {
      const randomRecipeIdToWin = game.getRandomRecipeIdToWin();
        const recipeClue = game.getCurrentRecipeClue(randomRecipeIdToWin).randomRecipeClue;
        const ingredientRoomClue = game.getCurrentRecipeClue(randomRecipeIdToWin).randomIngredientRoomClue;
        if (shouldSpeakClue) {
        addSentenceToSpeechQueue({ sentence: `Here is you clue: ${recipeClue}        and. ${ingredientRoomClue}`, voice: 'Princess' });
      }
      game.consoleOutPut({ text: 'Here is your clue:', color: 'yellowBright' });
      game.consoleOutPut({
          text: `

              ${chalk.bold.red(recipeClue)} and ${chalk.bold.red(ingredientRoomClue)}

           `,
      });
      break;
    }
    case (gameTypeIds.findOneItem):
    case (gameTypeIds.findTwoItems): {
      const randomItemIdToWin = game.getRandomItemIdToWin();
        const roomClue = game.getCurrentRoomClue(randomItemIdToWin);
        const itemClue = game.getCurrentItemClue(randomItemIdToWin);
        if (shouldSpeakClue) {
          addSentenceToSpeechQueue({ sentence: `Here is you clue: ${itemClue}       and. ${roomClue}`, voice: 'Princess' });
        }
        game.consoleOutPut({ text: 'Here is your clue:', color: 'yellowBright' });
        game.consoleOutPut({
          text: `

              ${chalk.bold.red(itemClue)} and ${chalk.bold.red(roomClue)}

           `,
        });
      break;
    }
    default:
       game.consoleOutPut({
         text: `ERROR: There are no clues for this goal type`
       });
      break;
  }
};

const getRandomRecipeIdToWinWrapper = (game) => () => {
  let resultId = getRandomArrayItem(game.state.craftItemIdToWin);
  while (game.state.player.inventory.includes(resultId)) {
    resultId = getRandomArrayItem(game.state.craftItemIdToWin)
  }
  return resultId;
};

const getRandomItemIdToWinWrapper = (game) => () => {
  let itemId = getRandomArrayItem(game.state.itemIdsToWin);
  while (game.state.player.inventory.includes(itemId)) {
    itemId = getRandomArrayItem(game.state.itemIdsToWin)
  }
  return itemId;
};

const craftItemWrapper = (game) => (itemName1, itemName2) => {
  const item1 = game.state.items.find((item) => item.name.toLowerCase() === itemName1.toLowerCase());
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
  game.moveItem({
    itemIdToMove: item1.id,
    source: game.state.player,
    destination: game.state.trashCan,
  });
  game.moveItem({
    itemIdToMove: item2.id,
    source: game.state.player,
    destination: game.state.trashCan,
  });
  game.consoleOutPut({ text: `${chalk.bold.green(recipe.result.name)} has been added to your inventory` })
  if (game.didPlayerWinDecider()) {
    game.showWinScreen();
  }
};

const spawnItemWrapper = (game) => (itemIdToSpawn, destination) => {
   destination.inventory.push(itemIdToSpawn);
};

const api = {
  getRandomRecipeIngredientWrapper,
  getRandomRecipeIdToWinWrapper,
  getCurrentRecipeClueWrapper,
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
