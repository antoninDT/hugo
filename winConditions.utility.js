
const didPlayerWinWrapper = (game) => () => {
  return game.state.itemIdsToWin.every((itemIdToWin) => game.state.player.inventory.includes(itemIdToWin))
};

const api = {
  didPlayerWinWrapper,
};
module.exports = api;
