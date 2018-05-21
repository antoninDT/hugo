const chalk = require('chalk');

const { getRandomArrayItem } = require('./general.utility');
const { addSentenceToSpeechQueue, sayListWithAnd } = require('./voices.utility');

const roomsLookup = require('./data/rooms.json');

const rooms = Object.values(roomsLookup);
const defaultRoomId = roomsLookup.hall.id;

const getRoomById = (roomId) => rooms.find((room) => room.id === roomId);

const getCurrentRoomWrapper = (game) => () => {
  const result = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
  return result;
};

const showEnemyAttackMessageWrapper = (game) => (enemy) => {
  game.consoleOutPut({ text: `${enemy.attackMessage} and lost ${chalk.red(enemy.damage)} health "${chalk.bold.red(enemy.name)}" ` });
};

const showRoomsWrapper = (game) => (shouldSpeak = true) => {
    const getRoomName = (room) => room.name;
    const getConnectedRooms = (room) => room.connectedRooms;
    const currentRoom = game.getCurrentRoom();
    const roomContents = [...currentRoom.connectedRooms.map(getRoomById)];
    const nameOfRoomContents = [...roomContents.map(getRoomName)];
    const showRoomName = (roomName) => game.consoleOutPut({ text: `    * ${chalk.bold.greenBright(roomName)}` });
    const addRoomSentenceToSpeechQueue = (roomName) => {
        addSentenceToSpeechQueue({
          sentence: roomName,
          voice: 'princess',
        });
    };
    game.consoleOutPut({ text: 'Here are all the rooms:', color: 'yellowBright', chalkSetting: 'italic' });
    const allRoomNames = game.state.rooms.map(getRoomName);
    allRoomNames
      .forEach(showRoomName);
    if (shouldSpeak) {
      addSentenceToSpeechQueue({ sentence: 'Here are all the rooms:', voice: 'princess' });
      sayListWithAnd({ list: allRoomNames, voice: 'princess', doneSentence: '   ' });
     }
    game.consoleOutPut({ text: `Here are the rooms that are connected to your room: `, color: 'yellowBright', chalkSetting: 'italic' });
    nameOfRoomContents.forEach(showRoomName);
    if (shouldSpeak) {
      addSentenceToSpeechQueue({ sentence: 'Here are the rooms connected to your room:', voice: 'princess' });
      sayListWithAnd({ list: nameOfRoomContents, voice: 'princess', doneSentence: '    ' });
     }
};

const showCurrentRoomWrapper = (game) => (shouldSpeakCurrentRoom = true) => {
  const currentRoomName = game.getCurrentRoom().name
  game.consoleOutPut({
      text: `

          You are in the ${chalk.bold.greenBright(currentRoomName)}.

       `,
    });
  if (shouldSpeakCurrentRoom) { addSentenceToSpeechQueue({ sentence: `You are in the ${currentRoomName}`, voice: 'princess' }); }
};

const showCurrentRoomContentsWrapper = (game) => (shouldSpeak = true) => {
  const currentRoom = game.getCurrentRoom(); //Fix this
  const currentRoomContentsVoice = 'princess';
  const roomContents = [
    ...currentRoom.inventory.map(game.getItemById),
    ...currentRoom.enemies.map(game.getEnemyById),
    ...currentRoom.healers.map(game.getHealerById)
  ];
  const roomEnemies = [...currentRoom.enemies.map(game.getEnemyById)];
  const roomHealers = [...currentRoom.healers.map(game.getHealerById)];
  if (!(roomContents.length)) {
    if (shouldSpeak) {
      addSentenceToSpeechQueue({ sentence: 'You look around and notice that the room is empty', voice: 'princess' });
    }
    game.consoleOutPut(`

          You look around and notice that the room is empty...
          💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩

      `, 'white');
    return;
  }
  if (currentRoom.enemies.length) { // TODO: Make the voice say that you have been harmed by an enemy, then say the list of items...
    roomEnemies.forEach(game.showEnemyAttackMessage);
    roomEnemies.forEach(game.dealDamageIfNeeded);
    game.showPlayerStatus(false, false);
  //  TODO: Make the health flash and then show the items in the room
  }
  game.consoleOutPut({
      color: 'yellowBright',
      text: `

          You look around and notice the following things:

       `,
    });
  roomContents.forEach(game.showEnemyOrHealer);
  if (shouldSpeak) {
    const continueSpeakingItems = () => {
     addSentenceToSpeechQueue({ sentence: 'You look around and notice the following things: ', voice: currentRoomContentsVoice});
      const speakItem = (index = 0) => {
        const item = roomContents[index];
        if (!item) {
          return;
        }
        const isLastItemInInventory = (index >= (roomContents.length - 1));
        const conditionalAnd = (index)
          ? `, and , `
          : '';
        const itemSentence = `${conditionalAnd} ${item.name}`;
        addSentenceToSpeechQueue({ sentence: itemSentence, voice: currentRoomContentsVoice });
        speakItem(index + 1)
      };
      speakItem();
    };
    continueSpeakingItems();
  }
};

const randomlyDistributeItemsToRoomsWrapper = (game) => () => { // TODO: Need to randomly sort rooms
  let availableItems = [...game.state.items];
  const dealRandomItemToRoom = (room) => {
    if (!availableItems.length) { return; }
    const itemToDealOut = getRandomArrayItem(availableItems);
    room.inventory.push(itemToDealOut.id);
    availableItems = availableItems.filter((item) => item.id !== itemToDealOut.id);
  };
  while (availableItems.length) {
    rooms.forEach(dealRandomItemToRoom);
  }
  const areThereDuplicates = () => {
    const countOfDedupedItemIdsToWin = new Set(game.state.itemIdsToWin).size;
    const result = (game.state.itemIdsToWin.length !== countOfDedupedItemIdsToWin);
    return result;
  };
  while (areThereDuplicates()) {
    game.state.itemIdsToWin = [ //TODO: Update this to work better with goals
      game.state.items[Math.floor(Math.random() * game.state.items.length)].id,
      game.state.items[Math.floor(Math.random() * game.state.items.length)].id
    ]
  }
  const recipeItems = game.state.recipes.map((recipe) => recipe.result);
  recipeItems.forEach((item) => game.state.items.push(item));
};

const randomlyDistributeEnemiesToRoomsWrapper = (game) => () => { // TODO: Need to randomly sort rooms
  let availableEnemies = [...game.state.enemies];
  const dealRandomEnemyToRoom = (room) => {
    if (!availableEnemies.length) { return; }
    const enemyToDealOut = getRandomArrayItem(availableEnemies);
    room.enemies.push(enemyToDealOut.id);
    availableEnemies = availableEnemies.filter((enemy) => enemy.id !== enemyToDealOut.id);
  };
  while (availableEnemies.length) {
    rooms.forEach(dealRandomEnemyToRoom);
  }
};

const randomlyDistributeHealersToRoomsWrapper = (game) => () => {
  let availableHealers = [...game.state.healers];
  const dealRandomHealerToRoom = (room) => {
    if (!availableHealers.length) { return; }
    const healerToDealOut = getRandomArrayItem(availableHealers);
    room.healers.push(healerToDealOut.id);
    availableHealers = availableHealers.filter((healer) => healer.id !== healerToDealOut.id);
  };
  while (availableHealers.length) {
    rooms.forEach(dealRandomHealerToRoom);
  }
};

const api = {
  showEnemyAttackMessageWrapper,
  randomlyDistributeHealersToRoomsWrapper,
  randomlyDistributeEnemiesToRoomsWrapper,
  randomlyDistributeItemsToRoomsWrapper,
  getCurrentRoomWrapper,
  showCurrentRoomContentsWrapper,
  defaultRoomId,
  getRoomById,
  roomsLookup,
  rooms,
  showCurrentRoomWrapper,
  showRoomsWrapper,
};
module.exports = api;
