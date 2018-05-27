const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const chalkAnimation = require('chalk-animation');

const { basicBoxOptions, basicCFontOptions, getTextColorBasedOnCurrentTime, consoleOutPut, clearScreenWrapper } = require('./console.utility');
const { defaultRoomId, getRoomById, roomsLookup, rooms, showCurrentRoomWrapper, showRoomsWrapper, showCurrentRoomContentsWrapper, getCurrentRoomWrapper, randomlyDistributeItemsToRoomsWrapper, randomlyDistributeEnemiesToRoomsWrapper, randomlyDistributeHealersToRoomsWrapper, showEnemyAttackMessageWrapper } = require('./room.utility');
const { getRandomArrayItem } = require('./general.utility');
const { didPlayerWinWrapper2ItemIdsToWin, didPlayerWinWrapperCraftAnItemToWin, didPlayerWinDeciderWrapper } = require('./winConditions.utility');
const { addSentenceToSpeechQueue, sampleVoicesWrapper } = require('./voices.utility');
const { getItemByIdWrapper, getEnemyByIdWrapper, getHealerByIdWrapper, showEnemyOrHealerWrapper, getCurrentRoomClueWrapper, getCurrentItemClueWrapper, giveItemClueWrapper, getRandomItemIdToWinWrapper, craftItemWrapper, spawnItemWrapper, getCurrentRecipeClueWrapper, getRandomRecipeIdToWinWrapper, getRandomRecipeIngredientWrapper } = require('./item.utility');
const { dealDamageIfNeededWrapper, healPlayerIfNeededWrapper, moveItemFromCurrentRoomToPlayerWrapper, moveItemWrapper, movePlayerToRoomWrapper, movePlayerToRandomRoomWrapper, hurtPlayerWrapper, healPlayerWrapper, moveItemFromPlayerToCurrentRoomWrapper, showPlayerStatusWrapper, showInventoryWrapper, consumeHealerWrapper, changeCurrentGoalIdWrapper, showCurrentGoalWrapper } = require('./player.utility');

//TODO: Find out to change the font/increase the size of the font
const recipesLookup = require('./data/recipes.json');
const itemsLookup = require('./data/items.json');
const commandLookup = require('./data/commands.json');
const enemiesLookup = require('./data/enemies.json');
const healersLookup = require('./data/healers.json');
const goalsLookup = require('./data/goals.json');

const commands = Object.values(commandLookup);
const recipes = Object.values(recipesLookup);
const items = Object.values(itemsLookup);
const enemies = Object.values(enemiesLookup);
const healers = Object.values(healersLookup);

const player = {
  currentGoalId: 0,
  health: 100,
  maxHealth: 100,
  currentRoomId: defaultRoomId,
  inventory: []
};
const trashCan = { //TODO: Remove this, and replace it with something else
  inventory: []
};

const game = {
  state: {
    player,
    trashCan,
    rooms,
    recipes,
    items,
    enemies,
    healers,
    itemIdsToWin: [ // TODO: Replace these with a winCondition factor or something like it
      // items[Math.floor(Math.random() * items.length)].id,
      // items[Math.floor(Math.random() * items.length)].id
    ],
    craftItemIdToWin: [
      // recipes[Math.floor(Math.random() * recipes.length)].result.id
    ]
  },
  updateWinConditions() {
    const gameTypeIds = { // TODO: refactor this to some other shared file.
      craftOneItem: 1,
      findOneItem: 2,
      findTwoItems: 3, // TODO: Eventually update the goals.json schema to allow editors to specify how many items to craft/find (wouldn't need typeId 3 anymore)
    };
    switch (this.state.player.currentGoalId) {
      case (gameTypeIds.craftOneItem): {
        this.state.craftItemIdToWin = [
          recipes[Math.floor(Math.random() * recipes.length)].result.id
        ];
        break;
      }
      case (gameTypeIds.findOneItem): {
        this.state.itemIdsToWin = [
          items[Math.floor(Math.random() * items.length)].id
        ];
        break;
      }
      case (gameTypeIds.findTwoItems): {
        this.state.itemIdsToWin = [ // TODO: Eventually refactor this to some helper function to create and return an array of n (n being how many random items) random items
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
  },
  goodbye(shouldSpeakClue = true) {
    const goodbyeMessageOptions = {
      ...basicCFontOptions,
      font: '3d',
      space: false,
      letterSpacing: 8,
      colors: ['blue', 'white']
    };
    if (shouldSpeakClue) { //TODO: Remove all usages of shouldSpeak?
      addSentenceToSpeechQueue({ sentence: 'DOE DOEI', voice: 'ellen', voiceSpeed: 0.5});
    }
    CFonts.say('DOE', goodbyeMessageOptions);
    CFonts.say('DOEI', goodbyeMessageOptions);
    CFonts.say('!!', goodbyeMessageOptions);
    const endGame = () => process.exit();
    setTimeout(endGame, 1000);
  },
  // TODO: Make a high score screen
  showWinScreen() {
    addSentenceToSpeechQueue({ sentence: `Congratulations!      You have found the hidden item!`, voice: 'daniel' });
    game.consoleOutPut({
        color: 'magentaBright',
        text: `
            Congratulations! You have found the hidden Item!
         `,
      });
    this.goodbye(false);
  },
  showLoseScreen() {
    addSentenceToSpeechQueue({ sentence: `Uh Oh it looks like you have die ie ied!`, voice: 'Bad News' });
    this.showPlayerStatus(false, false);
    // const text = 'Uh Oh... It appears you died, try again next time!'; TODO: Make this a "flashScreenRed"function
    game.consoleOutPut({
        color: 'redBright',
        text: `
            Uh Oh... It appears you died, try again next time!
        `,
      });
    this.goodbye(false);
  },
  getTextColorBasedOnCurrentTime,
  consoleOutPut,
  welcomeMessage() { // TODO: Make the layout of the welcome screen a lot more "duidelijk"
    const welcomeMessageOptions = {
      ...basicCFontOptions,
      font: 'block',
      colors: ['candy', 'candy']
    };
    this.clearScreen();
    CFonts.say('Welkom|bij|Hugo|Hulp', welcomeMessageOptions);
    addSentenceToSpeechQueue({ sentence: 'Welkom bij Hugo Hulp', voice: 'ellen', voiceSpeed: 0.5});
    console.log();
    game.consoleOutPut({
      text: `${new Date} ${chalk[this.getTextColorBasedOnCurrentTime().color].bold(this.getTextColorBasedOnCurrentTime().greeting)}`
    }); //TODO: Add a voice to say the greeting
    console.log();
    this.showRooms(false);
    this.showPlayerStatus(false, false);
    this.showCurrentRoom(false);
    // this.giveItemClue(false); // TODO: Kill this line
  },
  showHelp() { // TODO: Change this function (Update the goal to win) (Show all the goals)
    const commandBoxOptions = {
      ...basicBoxOptions,
      borderColor: this.getTextColorBasedOnCurrentTime().color,
      backgroundColor: 'blue',
      borderStyle: {
        topLeft: 'ᒥ',
        topRight: 'ᒣ',
        bottomLeft: 'ᒪ',
        bottomRight: 'ᒧ',
        horizontal: '-',
        vertical: '|',
      },
    };
    const colorHelp = chalk[this.getTextColorBasedOnCurrentTime().color](`The objects with the color ${chalk.bold.italic.red('red')} are enemies,

                                                      the color ${chalk.bold.italic.blue('blue')} are items,

                                                      and the color ${chalk.bold.italic.greenBright('green')} are healers [heals you].
    `);
    game.consoleOutPut({
      text: 'List of commands',
      color: 'yellowBright',
      boxenSettings: commandBoxOptions,
      chalkSetting: 'italic',
    });
    commands.forEach((command) => game.consoleOutPut({
      text: `  * ${chalk.bold.red(command.commands[0])}: ${command.description} `,
    }));
    commands.forEach((command) => addSentenceToSpeechQueue({
      sentence: ` ${(command.commands[0])}

            ${command.description} `,
      voice: 'princess',
      voiceSpeed: 1.5,
    }));
    console.log();
    game.consoleOutPut({
      text: `The goal of this game is to find the hidden item. To do this you have to use the clues given to guess what it is.`,
      color: 'magenta',
      chalkSetting: 'italic',
    });
    addSentenceToSpeechQueue({
      sentence: 'The goal of this game is to find the hidden item. To do this you have to use the clues given to guess what it is.',
      voice: 'princess',
    });
    game.consoleOutPut({
      text: `
                Clues: ${chalk[this.getTextColorBasedOnCurrentTime().color]('The first clue that is on the left side of the screen is the Item clue, and the clue on the right side is the Room clue.')}

                Rooms: ${chalk[this.getTextColorBasedOnCurrentTime().color]('In order to move to another room you first need to check if it\'s connected to the current room your in.')}

                Health: ${chalk[this.getTextColorBasedOnCurrentTime().color]('You may have noticed that you have health in this game you lose health everytime you pick up an item thats incorrect.')}

                Color of the text (${chalk[this.getTextColorBasedOnCurrentTime().color]('for the look around command')}): ${colorHelp}

            `,
      color: 'red',
      chalkSetting: 'bold',
    });
    addSentenceToSpeechQueue({
      sentence: `
                Clues: The first clue that is on the left side of the screen is the Item clue, and the clue on the right side is the Room clue.

                Rooms: In order to move to another room you first need to check if it\'s connected to the current room your in.

                Health: You may have noticed that you have health in this game you lose health everytime you pick up an item thats incorrect.

                Color of the text (for the look around command): The objects with the color red are enemies, the color blue are items, and the color green are healers [heals you].
            `,
      voice: 'princess',
    });
  }
};

const wireUpImportedGameFunctions = () => {
  game.getRandomRecipeIngredient = getRandomRecipeIngredientWrapper(game);
  game.didPlayerWinDecider = didPlayerWinDeciderWrapper(game);
  game.getRandomRecipeIdToWin = getRandomRecipeIdToWinWrapper(game);
  game.getCurrentRecipeClue = getCurrentRecipeClueWrapper(game);
  game.showCurrentGoal = showCurrentGoalWrapper(game);
  game.changeCurrentGoalId = changeCurrentGoalIdWrapper(game);
  game.didPlayerWinCraftAnItemToWin = didPlayerWinWrapperCraftAnItemToWin(game);
  game.consumeHealer = consumeHealerWrapper(game);
  game.didPlayerWin2ItemIdsToWin = didPlayerWinWrapper2ItemIdsToWin(game);
  game.sampleVoices = sampleVoicesWrapper(game);
  game.showInventory = showInventoryWrapper(game);
  game.showPlayerStatus = showPlayerStatusWrapper(game);
  game.moveItemFromPlayerToCurrentRoom = moveItemFromPlayerToCurrentRoomWrapper(game);
  game.spawnItem = spawnItemWrapper(game);
  game.craftItem = craftItemWrapper(game);
  game.healPlayer = healPlayerWrapper(game);
  game.hurtPlayer = hurtPlayerWrapper(game);
  game.movePlayerToRandomRoom = movePlayerToRandomRoomWrapper(game);
  game.movePlayerToRoom = movePlayerToRoomWrapper(game);
  game.moveItem = moveItemWrapper(game);
  game.moveItemFromCurrentRoomToPlayer = moveItemFromCurrentRoomToPlayerWrapper(game);
  game.healPlayerIfNeeded = healPlayerIfNeededWrapper(game);
  game.dealDamageIfNeeded = dealDamageIfNeededWrapper(game);
  game.getRandomItemIdToWin = getRandomItemIdToWinWrapper(game);
  game.giveItemClue = giveItemClueWrapper(game);
  game.getCurrentItemClue = getCurrentItemClueWrapper(game);
  game.clearScreen = clearScreenWrapper(game);
  game.showEnemyAttackMessage = showEnemyAttackMessageWrapper(game);
  game.showEnemyOrHealer = showEnemyOrHealerWrapper(game);
  game.randomlyDistributeHealersToRooms = randomlyDistributeHealersToRoomsWrapper(game);
  game.randomlyDistributeEnemiesToRooms = randomlyDistributeEnemiesToRoomsWrapper(game);
  game.randomlyDistributeItemsToRooms = randomlyDistributeItemsToRoomsWrapper(game);
  game.getHealerById = getHealerByIdWrapper(game);
  game.getEnemyById = getEnemyByIdWrapper(game);
  game.getItemById = getItemByIdWrapper(game);
  game.getCurrentRoom = getCurrentRoomWrapper(game);
  game.showCurrentRoomContents = showCurrentRoomContentsWrapper(game);
  game.getCurrentRoomClue = getCurrentRoomClueWrapper(game);
  game.showRooms = showRoomsWrapper(game);
  game.showCurrentRoom = showCurrentRoomWrapper(game);
};
wireUpImportedGameFunctions();

// const actions = { // TODO REFACTOR: Kill this for now (we can decide later whether to bring it back)
//
// };
// game.actions = actions;

const getNewGame = () => { // TODO REFACTOR: Kill this for now (we can decide later whether to bring it back)
  const result = {
    ...game
  };
  return result;
};

const api = {
  getNewGame
};

module.exports = api;
