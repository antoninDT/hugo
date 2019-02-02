
const recipesLookup = require('./data/recipes.json');
const itemsLookup = require('./data/items.json');

const recipes = Object.values(recipesLookup);
const items = Object.values(itemsLookup);

const winningFactors = {
  itemIdsToWin: [],
  craftItemIdToWin: []
};

const gameTypeIds = { // TODO: Eventually update the goals.json schema to allow editors to specify how many items to craft/find (wouldn't need typeId 3 anymore)
  craftItems: 1,
  findItems: 2,
  findMultipleItems: 3,
};

const giveCurrentGoalWrapper = (game) => () => {
  const currentGoal = game.state.goals.find((goal) => goal.id === game.state.player.currentGoalId);
  return { currentGoal }; // TODO: Simplify this function and its return value
};

const getNumberOfItemsToWinForCurrentGoalWrapper = (currentGoal) => () => {
  const currentGoal = game.giveCurrentGoal();
  const numberOfItemsToWinForCurrentGoal = currentGoal.numberOfItemsToWin;
  return { numberOfItemsToWinForCurrentGoal };
};

const didPlayerWinWrapperItemIdsToWin = (game) => () => {
  return game.state.winningFactors.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const didPlayerWinWrapperCraftAnItemToWin = (game) => () => { // TODO: Complete this later
  return game.state.winningFactors.craftItemIdToWin.every((craftItemIdToWin) => game.state.player.inventory.includes(craftItemIdToWin));
};

const didPlayerWinDeciderWrapper = (game) => () => {
  let winCondition;
      switch (game.state.player.currentGoalId) {
        case (gameTypeIds.craftItems): {
          winCondition = game.didPlayerWinCraftAnItemToWin();
          break;
        }
        case (gameTypeIds.findMultipleItems):
        case (gameTypeIds.findItems): {
          winCondition = game.didPlayerWinItemIdsToWin();
          break;
        }
        default:
          game.consoleOutPut({
            text: `ERROR: There is no win condition for this goal`
          });
          break;
        }
   return winCondition;
};

const updateWinConditionsWrapper = (game) => () => { // TODO: Finish refactoring this
  const numberOfItemsToWinForCurrentGoal = game.getNumberOfItemsToWinForCurrentGoal();
  const getNewRandomItemIdToWin = () => items[Math.floor(Math.random() * items.length)].id;
  const getNewRandomRecipeIdToWin = () => recipes[Math.floor(Math.random() * recipes.length)].result.id;
  switch (game.state.player.currentGoalId) {
    case (gameTypeIds.craftItems): {
      game.state.winningFactors.craftItemIdToWin = [];
      for (let i = 0; i < numberOfItemsToWinForCurrentGoal; i++ ) {
        game.state.winningFactors.craftItemIdToWin = [
          ...game.state.winningFactors.craftItemIdToWin,
          getNewRandomRecipeIdToWin(),
        ];
      }
      break;
    }
    case (gameTypeIds.findMultipleItems): // TODO: Add the findMultipleItems back but connect it to the find items case
    case (gameTypeIds.findItems): { // TODO: Eventually git rid of all functions using findMultipleItems and remove the findMultipleItems goal
      game.state.winningFactors.itemIdsToWin = [];
      for (let i = 0; i < numberOfItemsToWinForCurrentGoal; i++ ) {
        game.state.winningFactors.itemIdsToWin = [
          ...game.state.winningFactors.itemIdsToWin,
          getNewRandomItemIdToWin(),
        ];
      }
      break;
    }
    default:
       game.consoleOutPut({
         text: `ERROR: The current goal id does not exist`
       });
      break;
  }
};

const api = {
  getNumberOfItemsToWinForCurrentGoalWrapper,
  giveCurrentGoalWrapper,
  winningFactors,
  updateWinConditionsWrapper,
  gameTypeIds,
  didPlayerWinDeciderWrapper,
  didPlayerWinWrapperItemIdsToWin,
  didPlayerWinWrapperCraftAnItemToWin,
};
module.exports = api;
