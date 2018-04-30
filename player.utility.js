
const dealDamageIfNeededWrapper = (game) => (showEnemyOrHealer, shouldSpeak = true) => {
  if (showEnemyOrHealer.isEnemy) {
    game.actions.hurtPlayer(showEnemyOrHealer.damage, false);
    return;
  } // TODO: Fix the flashing of the text
  if (!showEnemyOrHealer.damage) { return; }
  if (showEnemyOrHealer.isItem && (game.state.itemIdsToWin.includes(showEnemyOrHealer.id))) { return; }
  if (shouldSpeak) { game.actions.hurtPlayer(showEnemyOrHealer.damage); }
  game.actions.hurtPlayer(showEnemyOrHealer.damage, false);
};

const api = {
  dealDamageIfNeededWrapper,
};
module.exports = api;
