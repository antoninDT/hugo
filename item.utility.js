const chalk = require('chalk');

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

const api = {
  showEnemyOrHealerWrapper,
  getHealerByIdWrapper,
  getEnemyByIdWrapper,
  getItemByIdWrapper,
};
module.exports = api;
