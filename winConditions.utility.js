
const didPlayerWinWrapper = (game) => () => {
  return game.state.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const api = {
  didPlayerWinWrapper,
};
module.exports = api;

//TODO: Make a different game mode where you have to craft the item
