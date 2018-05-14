
const didPlayerWinWrapper2ItemIdsToWin = (game) => () => {
  return game.state.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const didPlayerWinWrapperCraftAnItemToWin = (game) => () => { // TODO: Complete this later
  return game.state.craftItemIdToWin.every((craftItemIdToWin) => game.state.player.inventory.includes(itemIdToMove));
};

const api = {
  didPlayerWinWrapper2ItemIdsToWin,
  didPlayerWinWrapperCraftAnItemToWin,
};
module.exports = api;

//TODO: Make a different game mode where you have to craft the item
