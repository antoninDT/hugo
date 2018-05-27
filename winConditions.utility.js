
const didPlayerWinWrapper2ItemIdsToWin = (game) => () => {
  return game.state.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const didPlayerWinWrapperCraftAnItemToWin = (game) => () => { // TODO: Complete this later
  return game.state.craftItemIdToWin.every((craftItemIdToWin) => game.state.player.inventory.includes(craftItemIdToWin));
};

const didPlayerWinDeciderWrapper = (game) => () => {
  let winCondition;
    const gameTypeIds = { // TODO: refactor this to some other shared file.
      craftOneItem: 1,
      findOneItem: 2,
      findTwoItems: 3, // TODO: Eventually update the goals.json schema to allow editors to specify how many items to craft/find (wouldn't need typeId 3 anymore)
    };
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

const api = {
  didPlayerWinDeciderWrapper,
  didPlayerWinWrapper2ItemIdsToWin,
  didPlayerWinWrapperCraftAnItemToWin,
};
module.exports = api;

//TODO: Make a different game mode where you have to craft the item
