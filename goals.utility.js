
const chalk = require('chalk');

const { addSentenceToSpeechQueue, sayListWithAnd } = require('./voices.utility');

const goalsLookup = require('./data/goals.json');

const goals = Object.values(goalsLookup);

const getCurrentGoalDescriptionWrapper = (game) => () => {
  const currentGoal = game.giveCurrentGoal();
  const currentGoalId = currentGoal.id;
  const currentGoalDescription = currentGoal.description;
  return currentGoalDescription;
};

const showCurrentGoalWrapper = (game) => (shouldSpeak = true) => {
  const currentGoal = game.giveCurrentGoal();
  const currentGoalId = currentGoal.id;
  const currentGoalDescription = game.getCurrentGoalDescription();
  if (currentGoalId == 0) {
    game.consoleOutPut({
       text: `

       ${currentGoalDescription}:

       `,
       color: 'magentaBright'
     });
     goals.forEach((goal) => { // TODO: Refactor this into its own function
      const goalIdWithBullet = `  * ${chalk.bold.red(goal.id)} :`;
      const header = '##';
      const formattedGoalId = `${(goal.id && goalIdWithBullet) || header}`;
       game.consoleOutPut({
         text: `${formattedGoalId} ${goal.description} `,
       });
   });
    return;
  }
  game.consoleOutPut({
    text: `

    ${currentGoalDescription}

    `,
    color: 'magentaBright'
  });
};

const changeCurrentGoalIdWrapper = (game) => (goalId) => { // TODO: Add error message if the goal does not exist
  if (game.state.player.currentGoalId) {
    game.consoleOutPut({
      text: `

      You cannot change the goal once it has been set

      `,
    });
    return;
   }
  if (!goalId) {
    game.consoleOutPut({
      text: `

      Oops! You seem to have forgotten to add the id of the goal

      `,
    });
    return;
   }
  const getGoalById = (goalId) => goals.find((goal) => goal.id == goalId);
  const goalDetails = getGoalById(goalId);
  if (!goalDetails) {
      game.consoleOutPut({
        text: `

        The goal id you entered does not exist

        `,
      });
      return;
   }
  game.state.player.currentGoalId = goalDetails.id;
  game.showCurrentGoal();
  const setupGameForChosenGoal = () => {
    game.updateWinConditions();
    game.randomlyDistributeItemsToRooms();
    game.randomlyDistributeHealersToRooms();
    game.randomlyDistributeEnemiesToRooms();
  };
  setupGameForChosenGoal(); // TODO: Refactor this function into game.js and then just invoke it from here
};

// TODO: Add voices to this utility file

const api = {
  getCurrentGoalDescriptionWrapper,
  showCurrentGoalWrapper,
  changeCurrentGoalIdWrapper,
};
module.exports = api;
