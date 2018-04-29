const chalk = require('chalk');
const say = require('say');

const { getRandomArrayItem } = require('./general.utility');

const roomsLookup = require('./data/rooms.json');

const rooms = Object.values(roomsLookup);
const defaultRoomId = roomsLookup.hall.id;

const getRoomById = (roomId) => rooms.find((room) => room.id === roomId);

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

const getCurrentRoomClueWrapper = (game) => (randomItemIdToWin) => { // TODO: Refactor this to room.utility
  const roomContainingTheItem = rooms.find((room) => room.inventory.includes(randomItemIdToWin));
  const randomClueForRoom = getRandomArrayItem(roomContainingTheItem.clues);
  return randomClueForRoom;
};

const api = {
  defaultRoomId,
  getRoomById,
  roomsLookup,
  rooms,
  showCurrentRoomWrapper,
  showRoomsWrapper,
  getCurrentRoomClueWrapper,
};
module.exports = api;
