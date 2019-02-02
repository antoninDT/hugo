
const { addSentenceToSpeechQueue, sayListWithAnd } = require('./voices.utility');

const goalsLookup = require('./data/goals.json');

const goals = Object.values(goalsLookup);

const getCurrentGoalDescriptionWrapper = (game) => () => { // TODO: Make this work
  const currentGoalId = game.state.player.currentGoalId;
  let currentGoalDescription;
  if (currentGoalId == 0) {
     currentGoalDescription = 'There is currently no goal, please choose a goal from the available options';
     return currentGoalDescription;
   }
  const currentGoal = game.giveCurrentGoal().currentGoal;
  currentGoalDescription = currentGoal.description;
  console.log(`DEBUG: currentGoalDescription:  `); //TODO: Kill this line
  console.dir(currentGoalDescription); //TODO: Kill this line
  return currentGoalDescription;
};

const showCurrentGoalWrapper = (game) => () => { // TODO: Show the id's of the goals and input the goal id to change it
  const currentGoal = game.giveCurrentGoal().currentGoal;
  if (!currentGoal) {
    game.consoleOutPut({
       text: `

       No goal has been chosen. Please choose a goal

       `,
     });
    return;
  }
  game.consoleOutPut({
    text: `

    ${currentGoal.description}

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
