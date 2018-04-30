const chalk = require('chalk');
const say = require('say');

const { getRandomArrayItem } = require('./general.utility');

const roomsLookup = require('./data/rooms.json');

const rooms = Object.values(roomsLookup);
const defaultRoomId = roomsLookup.hall.id;

const getRoomById = (roomId) => rooms.find((room) => room.id === roomId);

const getCurrentRoomWrapper = (game) => () => {
  const result = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
  return result;
};

const showRoomsWrapper = (game) => () => { // TODO: Add voices to this
    const getRoomName = (room) => room.name;
    const getConnectedRooms = (room) => room.connectedRooms;
    const currentRoom = game.getCurrentRoom();
    const roomContents = [...currentRoom.connectedRooms.map(getRoomById)];
    const nameOfRoomContents = [...roomContents.map(getRoomName)];
    const showRoomName = (roomName) => game.consoleOutPut({ text: `    * ${chalk.bold.greenBright(roomName)}` });
    game.consoleOutPut({ text: 'Here are the all rooms:', color: 'yellowBright', chalkSetting: 'italic' });
    game.state.rooms.map(getRoomName).forEach(showRoomName);
    game.consoleOutPut({ text: `Here are the rooms that are connected to your room: `, color: 'yellowBright', chalkSetting: 'italic' });
    nameOfRoomContents.forEach(showRoomName);
};

const showCurrentRoomWrapper = (game) => (shouldSpeakCurrentRoom = true) => {
  const currentRoomName = game.getCurrentRoom().name
  game.consoleOutPut({
      text: `

          You are in the ${chalk.bold.greenBright(currentRoomName)}.

       `,
    });
  if (shouldSpeakCurrentRoom) { say.speak(`You are in the ${currentRoomName}`, 'princess'); }
};

const getCurrentRoomClueWrapper = (game) => (randomItemIdToWin) => {
  const roomContainingTheItem = rooms.find((room) => room.inventory.includes(randomItemIdToWin));
  const randomClueForRoom = getRandomArrayItem(roomContainingTheItem.clues);
  return randomClueForRoom;
};

const showCurrentRoomContentsWrapper = (game) => (shouldSpeak = true) => { //TODO: Refactor this into room.utility
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
      say.speak('You look around and notice that the room is empty', 'princess');
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
    // return;  TODO: Make the health flash and then show the items in the room
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
        say.speak(itemSentence, currentRoomContentsVoice, null, () => speakItem(index + 1));
      };
      speakItem();
    };
    say.speak('You look around and notice the following things: ', currentRoomContentsVoice, null, continueSpeakingItems);
  }
};

const api = {
  getCurrentRoomWrapper,
  showCurrentRoomContentsWrapper,
  defaultRoomId,
  getRoomById,
  roomsLookup,
  rooms,
  showCurrentRoomWrapper,
  showRoomsWrapper,
  getCurrentRoomClueWrapper,
};
module.exports = api;
