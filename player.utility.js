const say = require('say');
const chalk = require('chalk');

const { getRoomById } = require('./room.utility');

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

const healPlayerIfNeededWrapper = (game) => (showEnemyOrHealer) => { //TODO: Make this work
  if (!showEnemyOrHealer.healingAmount) { return; }
  if (showEnemyOrHealer.isItem && showEnemyOrHealer === game.state.itemIdsToWin) { return; }
  game.actions.healPlayer(showEnemyOrHealer.healingAmount);  // TODO: Add a voice when gained healh
};

const moveItemFromCurrentRoomToPlayerWrapper = (game) => (itemName) => {
  if (!itemName) {
    say.speak(`You forgot to put the name of the item to pick up hoor


               try again!`, 'princess');
    game.consoleOutPut({
      text: `

                               😂😂😂
               You forgot to put the name of the item to pick up hoor... try again!
                               😂😂😂

      `,
   });
   return;
  }
  const room = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
  if (!room.inventory || !room.inventory.length) {
    say.speak(`The room is empty`, 'princess');
    game.consoleOutPut({
      text: `

                🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                room is empty...
                🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️

      `,
    });
    return;
  }
  const item = game.state.items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
  const healer = game.state.healers.find((healer) => healer.name.toLowerCase() === itemName.toLowerCase()); // TODO: Remove the healer once it has been picked up once by the player
  if (healer) {
    game.moveItem(healer.id, room, game.state.player);
    game.moveItem(healer.id, player, trashCan);
    game.consoleOutPut({
      text: `

                  You used "${healer.name}"

        `,
      });
    game.healPlayerIfNeeded(healer);
    return;
  }
  if (!item || !room.inventory.includes(item.id)) {
    say.speak(`The current room does not have "${itemName}"`, 'princess');
    game.consoleOutPut({
      text: `

                     The current room does not have "${chalk.bold.red(itemName)}"

         `,
      });
    return;
  }
  game.moveItem(item.id, room, game.state.player);
  say.speak(`You have put "${item.name}" in your inventory`, 'princess');
  game.consoleOutPut({
    text: `

                You have put "${chalk.bold.red(item.name)}" into your inventory

       `,
    });
  game.dealDamageIfNeeded(item, false);
  if (game.didPlayerWin()) {
    game.showWinScreen();
  }
};

const moveItemWrapper = (game) => (itemIdToMove, source, destination) => {
  const newSourceItems = source.inventory.filter((itemId) => itemId !== itemIdToMove);
  source.inventory = newSourceItems;
  destination.inventory.push(itemIdToMove);
};

const movePlayerToRoomWrapper = (game) => (roomId, shouldSpeakCurrentRoom = true, shouldCheckConnectedRooms = true) => {
  const room = getRoomById(roomId);
  const currentRoom = game.getCurrentRoom();
  const roomName = room.name;
  if (!currentRoom.connectedRooms.includes(room.id) && shouldCheckConnectedRooms) {
    game.consoleOutPut({
      text: `
        ${roomName} is not connected to the current room
      `,
    });
    say.speak(`${roomName} is not connected to the current room`, 'princess');
    return;
  } //TODO: Say which rooms are connected to the current room
  game.state.player.currentRoomId = roomId;
  if (shouldSpeakCurrentRoom) {
    game.showCurrentRoom();
    return;
  }
  game.showCurrentRoom(false);
};

const api = {
  movePlayerToRoomWrapper,
  moveItemWrapper,
  moveItemFromCurrentRoomToPlayerWrapper,
  healPlayerIfNeededWrapper,
  dealDamageIfNeededWrapper,
};
module.exports = api;
