
const recipesLookup = require('./data/recipes.json');
const itemsLookup = require('./data/items.json');

const recipes = Object.values(recipesLookup);
const items = Object.values(itemsLookup);

const winningFactors = {
  itemIdsToWin: [],
  craftItemIdToWin: []
};

const gameTypeIds = { // TODO: Eventually update the goals.json schema to allow editors to specify how many items to craft/find (wouldn't need typeId 3 anymore)
  craftOneItem: 1,
  findOneItem: 2,
  findTwoItems: 3,
};

const didPlayerWinWrapper2ItemIdsToWin = (game) => () => {
  return game.state.winningFactors.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const didPlayerWinWrapperCraftAnItemToWin = (game) => () => { // TODO: Complete this later
  return game.state.winningFactors.craftItemIdToWin.every((craftItemIdToWin) => game.state.player.inventory.includes(craftItemIdToWin));
};

const didPlayerWinDeciderWrapper = (game) => () => {
  let winCondition;
      switch (game.state.player.currentGoalId) {
        case (gameTypeIds.craftOneItem): {
          winCondition = game.didPlayerWinCraftAnItemToWin();
          break;
        }
        case (gameTypeIds.findOneItem):
        case (gameTypeIds.findTwoItems): {
          winCondition = game.didPlayerWin2ItemIdsToWin();
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
  switch (game.state.player.currentGoalId) {
    case (gameTypeIds.craftOneItem): {
      game.state.winningFactors.craftItemIdToWin = [
        recipes[Math.floor(Math.random() * recipes.length)].result.id
      ];
      break;
    }
    case (gameTypeIds.findOneItem): {
      game.state.winningFactors.itemIdsToWin = [
        items[Math.floor(Math.random() * items.length)].id
      ];
      break;
    }
    case (gameTypeIds.findTwoItems): {
      game.state.winningFactors.itemIdsToWin = [ // TODO: Eventually refactor this to some helper function to create and return an array of n (n being how many random items) random items
        items[Math.floor(Math.random() * items.length)].id,
        items[Math.floor(Math.random() * items.length)].id
      ];
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
  winningFactors,
  updateWinConditionsWrapper,
  gameTypeIds,
  didPlayerWinDeciderWrapper,
  didPlayerWinWrapper2ItemIdsToWin,
  didPlayerWinWrapperCraftAnItemToWin,
};
module.exports = api;
