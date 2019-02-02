const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const chalkAnimation = require('chalk-animation');

const { getSanitizedText } = require('./text.utility');
const { addSentenceToSpeechQueue } = require('./voices.utility');

const readline = require('readline');

const itemsLookup = require('./data/items.json');
const commandLookup = require('./data/commands.json');
const roomsLookup = require('./data/rooms.json');

const rooms = Object.values(roomsLookup);

const basicCFontOptions = {
  font: 'simple3d'
};

const basicBoxOptions = {
  padding: 1,
  borderStyle: {
    topLeft: '@',
    topRight: '@',
    bottomLeft: '@',
    bottomRight: '@',
    horizontal: '\\',
    vertical: '/'
  }
};

const flashScreenRed = (text) => { // TODO: Finish implementing this
  // TODO: Fix the fact that it's replacing the prompt
  // const pulseDelayInMilliseconds = 200;
  const animationDurationInMilliseconds = 800; // TODO: Figure out how to make the prompt come back right after this is done, instead of waiting
  const pulse = chalkAnimation.pulse(text);
  const stopAnimation = () => console.log('');
  setTimeout(stopAnimation, animationDurationInMilliseconds);
  // const stopPulsing = () => { pulse.stop(); };
  // const startPulsing = () => { pulse.start(); };
  //
  // const performFlashing = (countOfFlashes) => {
  //     const flash = (isStarted, currentFlashCount = 1) => setTimeout(() => {
  //         if (currentFlashCount > countOfFlashes) { return; }
  //         if (!isStarted) {
  //             pulse.start();
  //             flash(true, currentFlashCount);
  //             return;
  //         }
  //         pulse.stop();
  //         flash(false, currentFlashCount + 1);
  //     }, pulseDelayInMilliseconds);
  //     flash(false);
  // };
  // performFlashing(1);
};

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const processInput = (prompt, handler) => {
    lineReader.question(prompt, handler);
};

const getTextColorBasedOnCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const result = {
    color: 'green',
    bgColor: 'bgBlack',
    greeting: '',
  };
  switch (true) { //TODO: Add more holidays and think of color combos to go with them
    case ((currentMonth === 3) && (currentDay === 27)):
      result.color = 'yellow';
      result.greeting = 'Fijne koningsdag!';
      break;
    case (currentHour < 12):
      result.greeting = 'Good morning';
      break;
    case((currentHour >= 12) && (currentHour < 18)):
      result.color = 'cyan';
      result.greeting = 'Good Afternoon';
      break;
    case((currentHour >= 18) && (currentHour <= 24)):
      result.color = 'white';
      result.greeting = 'Good evening';
      break;
  }
  return result;
};

const consoleOutPut = ({text, color, chalkSetting = 'reset', boxenSettings, bgColor}) => {
  const colorToUse = color || getTextColorBasedOnCurrentTime().color;
  const bgColorToUse = bgColor || getTextColorBasedOnCurrentTime().bgColor;
  if (boxenSettings) {
     console.log(boxen(chalk[chalkSetting][colorToUse][bgColorToUse](text), boxenSettings)); ; //TODO: Fix the backgroundColor
     return;
  }
  console.log(chalk[chalkSetting][colorToUse][bgColorToUse](text));
};

const clearScreenWrapper = (game) => () => {
  game.consoleOutPut({ text: '\x1Bc' });
};

const promptForUserCommandWrapper = (game) => () => {
    const handleCommand = (result) => {
        const sanitizedInput = getSanitizedText(result);
        let itemParts;
        let itemName;
        let specificCommandUsed;
        const doesSanitizedInputStartWithCommand = (command) => sanitizedInput.startsWith(command);

        const handleGoToCommand = () => {
          specificCommandUsed = commandLookup.goTo.commands.find(doesSanitizedInputStartWithCommand);
          const roomParts = sanitizedInput
              .split(specificCommandUsed);
          const roomNameAsInput = roomParts[1];
          const roomName = getSanitizedText(roomNameAsInput);
          const foundRoom = rooms
              .find((room) => getSanitizedText(room.name) === roomName);
          if (!foundRoom) {
              console.log(chalk.yellow(`

                  Oops this room does not exist: ${chalk.bold.red(roomNameAsInput)}

              `));
              return;
          }
          const roomId = foundRoom.id;
          game.movePlayerToRoom(roomId);
        };

        const getItemNameFromInput = (commandName) => {
          specificCommandUsed = commandLookup[commandName].commands.find(doesSanitizedInputStartWithCommand);
          itemParts = sanitizedInput
              .split(specificCommandUsed);
          itemName = getSanitizedText(itemParts[1]);
          return itemName;
        };

        switch (true) {
            case (commandLookup.exit.commands.includes(sanitizedInput)):
                game.goodbye();
                return;
            case (commandLookup.goTo.commands.some(doesSanitizedInputStartWithCommand)):
                handleGoToCommand();
                break;
            case (commandLookup.help.commands.includes(sanitizedInput)):
                game.showHelp();
                break;
            case (commandLookup.showRooms.commands.includes(sanitizedInput)):
                game.showRooms();
                break;
            case (commandLookup.whereAmI.commands.includes(sanitizedInput)):
                game.showCurrentRoom();
                break;
            case (!sanitizedInput): {
                break;
            }
            case (commandLookup.clear.commands.includes(sanitizedInput)):
                game.clearScreen();
                break;
            case (commandLookup.lookAround.commands.includes(sanitizedInput)):
                game.showCurrentRoomContents();
                break;
             case (commandLookup.showInventory.commands.includes(sanitizedInput)):
                game.showInventory();
                break;
            case (commandLookup.transferItemToPlayerInventory.commands.some(doesSanitizedInputStartWithCommand)):
                itemName = getItemNameFromInput('transferItemToPlayerInventory');
                game.moveItemFromCurrentRoomToPlayer(itemName, sanitizedInput);
                break;
            case (commandLookup.transferItemToRoomInventory.commands.some(doesSanitizedInputStartWithCommand)):
                itemName = getItemNameFromInput('transferItemToRoomInventory');
                game.moveItemFromPlayerToCurrentRoom(itemName);
                break;
            case (commandLookup.showClue.commands.includes(sanitizedInput)):
                game.giveItemClue();
                break;
            case (commandLookup.testVoices.commands.includes(sanitizedInput)):
                game.sampleVoices();
                break;
            case (commandLookup.showPlayerStatus.commands.includes(sanitizedInput)):
                game.showPlayerStatus(true,false);
                break;
            case (commandLookup.showCurrentGoal.commands.includes(sanitizedInput)):
                game.showCurrentGoal();
                break;
             case (sanitizedInput === 'barf'): // TODO: This is "secret" it won't appear in help. Should disable this in the future
                 console.log(`

                 DEBUG:: BARFING


                 game.state: ${JSON.stringify(game.state)}


                 itemsLookup: ${JSON.stringify(itemsLookup)}


                 roomsLookup: ${JSON.stringify(roomsLookup)}

                 commandsLookup: ${JSON.stringify(commandLookup)}

                 `);
                 console.dir(game.state);
                 break;
             case (sanitizedInput === 'die'): // TODO: This is "secret" it won't appear in help. Should disable this in the future
                 game.hurtPlayer(100);
                 break;
             case (commandLookup.craftItem.commands.some(doesSanitizedInputStartWithCommand)): // TODO: Make sure that when no items are put after the word "craft" that the game says an error warning instead of crashing
                     specificCommandUsed = commandLookup.craftItem.commands.find(doesSanitizedInputStartWithCommand);
                     itemParts = sanitizedInput
                         .split(specificCommandUsed);
                     const seperatedItems = itemParts[1].split(' and ');
                     itemName1 = getSanitizedText(seperatedItems[0]);
                     itemName2 = getSanitizedText(seperatedItems[1]);
                     game.craftItem(itemName1, itemName2);
                     break;
             case (commandLookup.setGoal.commands.some(doesSanitizedInputStartWithCommand)): // TODO: Make sure this works
                     itemName = getItemNameFromInput('setGoal');
                     game.changeCurrentGoalId(itemName);
                     break;
            default:
                addSentenceToSpeechQueue({ sentence: `Oops please enter another command hoor. Type in "help" for a list of commands`, voice: 'princess', groupId: 2 });
                game.consoleOutPut({
                  text: `

                      Oops please enter another command hoor. Type in "help" for a list of commands

                  `,
                });
        }
        promptForUserCommand(game);
    };
    processInput('Please enter a command:', handleCommand); //TODO: Add color to the prompt
};

const api = {
  promptForUserCommandWrapper,
  flashScreenRed,
  clearScreenWrapper,
  basicBoxOptions,
  basicCFontOptions,
  consoleOutPut,
  getTextColorBasedOnCurrentTime,
};
module.exports = api;
