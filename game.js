const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const chalkAnimation = require('chalk-animation');

const { basicBoxOptions, basicCFontOptions, getTextColorBasedOnCurrentTime, consoleOutPut, clearScreenWrapper, } = require('./console.utility');
const { defaultRoomId, getRoomById, roomsLookup, rooms, showCurrentRoomWrapper, showRoomsWrapper, showCurrentRoomContentsWrapper, getCurrentRoomWrapper, randomlyDistributeItemsToRoomsWrapper, randomlyDistributeEnemiesToRoomsWrapper, randomlyDistributeHealersToRoomsWrapper, showEnemyAttackMessageWrapper } = require('./room.utility');
const { getRandomArrayItem } = require('./general.utility');
const { addSentenceToSpeechQueue, sampleVoicesWrapper } = require('./voices.utility');
const { getItemByIdWrapper, getEnemyByIdWrapper, getHealerByIdWrapper, showEnemyOrHealerWrapper, getCurrentRoomClueWrapper, getCurrentItemClueWrapper, giveItemClueWrapper, getRandomItemIdToWinWrapper, craftItemWrapper, spawnItemWrapper } = require('./item.utility');
const { dealDamageIfNeededWrapper, healPlayerIfNeededWrapper, moveItemFromCurrentRoomToPlayerWrapper, moveItemWrapper, movePlayerToRoomWrapper, movePlayerToRandomRoomWrapper, hurtPlayerWrapper, healPlayerWrapper, moveItemFromPlayerToCurrentRoomWrapper, showPlayerStatusWrapper, showInventoryWrapper } = require('./player.utility');

//TODO: Find out to change the font/increase the size of the font
const recipesLookup = require('./data/recipes.json');
const itemsLookup = require('./data/items.json');
const commandLookup = require('./data/commands.json');
const enemiesLookup = require('./data/enemies.json');
const healersLookup = require('./data/healers.json');

const commands = Object.values(commandLookup);
const recipes = Object.values(recipesLookup);
const items = Object.values(itemsLookup);
const enemies = Object.values(enemiesLookup);
const healers = Object.values(healersLookup);

const player = {
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
    itemIdsToWin: [
      items[Math.floor(Math.random() * items.length)].id,
      items[Math.floor(Math.random() * items.length)].id
    ]
  },
  didPlayerWin() {
    return this.state.itemIdsToWin.every((itemIdToWin) => this.state.player.inventory.includes(itemIdToWin))
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
  welcomeMessage() { // TODO: Add promises so that voice can work
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
      chalkSetting: 'bold',
      color: 'magenta',
      text: 'Can you find the hidden item??',
    });
    console.log();
    game.consoleOutPut({
      text: `${new Date} ${chalk[this.getTextColorBasedOnCurrentTime().color].bold(this.getTextColorBasedOnCurrentTime().greeting)}`
    }); //TODO: Add a voice to say the greeting
    console.log();
    this.showRooms(false);
    this.showPlayerStatus(false, false);
    this.showCurrentRoom(false);
    this.giveItemClue(false);
  },
  showHelp() { //TODO: Add speech to this function
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
    console.log();
    game.consoleOutPut({
      text: `The goal of this game is to find the hidden item. To do this you have to use the clues given to guess what it is.`,
      color: 'magenta',
      chalkSetting: 'italic',
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
  }
};

const wireUpImportedGameFunctions = () => {
  game.sampleVoices = sampleVoicesWrapper(game);
  game.showInventory = showInventoryWrapper(game);
  game.showPlayerStatus = showPlayerStatusWrapper(game);
  game.moveItemFromPlayerToCurrentRoom = moveItemFromPlayerToCurrentRoomWrapper(game); //TODO: Does this need to be in action?
  game.spawnItem = spawnItemWrapper(game); //TODO: Does this need to be in action?
  game.craftItem = craftItemWrapper(game); //TODO: Does this need to be in action?
  game.healPlayer = healPlayerWrapper(game); //TODO: Does this need to be in action?
  game.hurtPlayer = hurtPlayerWrapper(game); //TODO: Does this need to be in action?
  game.movePlayerToRandomRoom = movePlayerToRandomRoomWrapper(game); //TODO: Does this need to be in action?
  game.movePlayerToRoom = movePlayerToRoomWrapper(game); //TODO: Does this need to be in action?
  game.moveItem = moveItemWrapper(game); //TODO: Does this need to be in action?
  game.moveItemFromCurrentRoomToPlayer = moveItemFromCurrentRoomToPlayerWrapper(game); //TODO: Does this need to be in action?
  game.healPlayerIfNeeded = healPlayerIfNeededWrapper(game);
  game.dealDamageIfNeeded = dealDamageIfNeededWrapper(game);
  game.getRandomItemIdToWin = getRandomItemIdToWinWrapper(game);
  game.giveItemClue = giveItemClueWrapper(game);
  game.getCurrentItemClue = getCurrentItemClueWrapper(game);
  game.clearScreen = clearScreenWrapper(game);
  game.showEnemyAttackMessage = showEnemyAttackMessageWrapper(game);
  game.showEnemyOrHealer = showEnemyOrHealerWrapper(game);
  game.randomlyDistributeHealersToRooms = randomlyDistributeHealersToRoomsWrapper(game); //TODO: Does this need to be in action?
  game.randomlyDistributeEnemiesToRooms = randomlyDistributeEnemiesToRoomsWrapper(game); //TODO: Does this need to be in action?
  game.randomlyDistributeItemsToRooms = randomlyDistributeItemsToRoomsWrapper(game); //TODO: Does this need to be in action?
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

const actions = { // TODO REFACTOR: Kill this for now (we can decide later whether to bring it back)

};
game.actions = actions;

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
