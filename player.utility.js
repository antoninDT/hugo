
const chalk = require('chalk');

const { getRoomById } = require('./room.utility');
const { flashScreenRed } = require('./console.utility');
const { getRandomArrayItem } = require('./general.utility');
const { addSentenceToSpeechQueue, sayListWithAnd } = require('./voices.utility');

const dealDamageIfNeededWrapper = (game) => (showEnemyOrHealer, shouldSpeak = true) => {
  if (showEnemyOrHealer.isEnemy) {
    return;
  } // TODO: Fix the flashing of the text
  if (!showEnemyOrHealer.damage) { return; }
  if (showEnemyOrHealer.isItem && (game.state.itemIdsToWin.includes(showEnemyOrHealer.id))) { return; }
  if (shouldSpeak) { game.actions.hurtPlayer(showEnemyOrHealer.damage); }
  game.hurtPlayer(showEnemyOrHealer.damage, false);
};

const healPlayerIfNeededWrapper = (game) => (showEnemyOrHealer) => { //TODO: Make this work
  if (!showEnemyOrHealer.healingAmount) { return; }
  if (showEnemyOrHealer.isItem && showEnemyOrHealer === game.state.itemIdsToWin) { return; }
  game.healPlayer(showEnemyOrHealer.healingAmount);  // TODO: Add a voice when gained healh
};

const moveItemFromPlayerToCurrentRoomWrapper = (game) => (itemName) => {
  if (!itemName) {
    addSentenceToSpeechQueue({ sentence: `You forgot to put the name of the item to drop hoor             try again!`, voice: 'princess' });
    game.consoleOutPut({
      text: `

                                😂😂😂
                You forgot to put the name of the item to drop hoor... try again!
                                😂😂😂

           `,
        });
    return;
  }
  if (!game.state.player.inventory || !game.state.player.inventory.length) {
    addSentenceToSpeechQueue({ sentence: `There is nothing in your Inventory`, voice: 'princess' });
    game.consoleOutPut({
      text: `

                🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                Inventory is empty...
                🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️

           `,
        });
    return;
  }
  const item = game.state.items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
  if (!item || !game.state.player.inventory.includes(item.id)) {
    addSentenceToSpeechQueue({ sentence: `"${itemName}" is not in your inventory`, voice: 'princess' });
    game.consoleOutPut({
      text: `

                     "${chalk.bold.red(itemName)}" is not in your inventory...

           `,
        });
    return;
  }
  game.moveItem(item.id, game.state.player, game.getCurrentRoom());
  addSentenceToSpeechQueue({ sentence: `You have dropped "${item.name}"`, voice: 'princess' });
  game.consoleOutPut({
    text: `

                You have dropped "${chalk.bold.red(item.name)}"

       `,
    });
};

const moveItemFromCurrentRoomToPlayerWrapper = (game) => (itemName) => {
  if (!itemName) {
    addSentenceToSpeechQueue({ sentence: `You forgot to put the name of the item to pick up hoor        try again!`, voice: 'princess' });
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
    addSentenceToSpeechQueue({ sentence: `The room is empty`, voice: 'princess' });
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
    game.moveItem(healer.id, game.state.player, game.state.trashCan);
    game.consoleOutPut({
      text: `

                  You used "${healer.name}"

        `,
      });
    game.healPlayerIfNeeded(healer);
    return;
  }
  if (!item || !room.inventory.includes(item.id)) {
    addSentenceToSpeechQueue({ sentence: `The current room does not have "${itemName}"`, voice: 'princess' });
    game.consoleOutPut({
      text: `

                     The current room does not have "${chalk.bold.red(itemName)}"

         `,
      });
    return;
  }
  game.moveItem(item.id, room, game.state.player);
  addSentenceToSpeechQueue({ sentence: `You have put "${item.name}" in your inventory`, voice: 'princess' });
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
    addSentenceToSpeechQueue({ sentence: `${roomName} is not connected to the current room`, voice: 'princess' });
    return;
  } //TODO: Say which rooms are connected to the current room
  game.state.player.currentRoomId = roomId;
  if (shouldSpeakCurrentRoom) {
    game.showCurrentRoom();
    return;
  }
  game.showCurrentRoom(false);
};

const movePlayerToRandomRoomWrapper = (game) => () => {
  const randomRoom = getRandomArrayItem(game.state.rooms);
  game.movePlayerToRoom(randomRoom.id, false, false);
};

const hurtPlayerWrapper = (game) => (amount, shouldSpeak = true) => {
  if (!amount) { return; }
  game.state.player.health -= amount;
  if (game.state.player.health <= 0) {
    game.showLoseScreen();
    return;
  }
  if (shouldSpeak) {
    game.showPlayerStatus();
    return;
  }
  game.showPlayerStatus(false, true);
};

const healPlayerWrapper = (game) => (amount) => { // TODO: Use this function later
  if (!amount) { return; }
  game.state.player.health += amount;
  if (game.state.player.health > game.state.player.maxHealth) {
    game.state.player.health = game.state.player.maxHealth;
  }
  game.showPlayerStatus(false, false);
};

const showPlayerStatusWrapper = (game) => (shouldSpeak = true, shouldFlash = true) => {
  const text = `You have ${game.state.player.health} health out of ${game.state.player.maxHealth}`;
  if (shouldFlash) {
    flashScreenRed(text);
    return;
  }
  if (shouldSpeak) {
    addSentenceToSpeechQueue({ sentence: `You have ${game.state.player.health} health out of ${game.state.player.maxHealth}`, voice: 'princess' });
  }
  game.consoleOutPut({
    text: `
           You have ${game.state.player.health} health out of ${game.state.player.maxHealth}
    `,
  });
};

const showInventoryWrapper = (game) => () => {
  const inventoryVoice = 'princess';
  if (!game.state.player.inventory.length) {
    addSentenceToSpeechQueue({ sentence: 'There is nothing in your Inventory', voice: inventoryVoice });
    game.consoleOutPut({
        text: `

              There is nothing in your Inventory...

                        😐😐😐
           `,
        });
    return;
  }
  game.consoleOutPut({
      color: 'yellowBright',
      text: `

          You have the following items:
        `,
  });

  const allItems = game.state.player.inventory
      .map(game.getItemById);
  allItems
      .forEach(game.showEnemyOrHealer);
  addSentenceToSpeechQueue({ sentence: 'You have the following items in your inventory: ', voice: inventoryVoice });
  const getItemName = (item) => item.name;
  const allItemNames = allItems.map(getItemName);
  sayListWithAnd({ list: allItemNames, voice: 'princess' }); //TODO: Fix the speed of which the items in the inventory are said
};

const api = {
  showInventoryWrapper,
  showPlayerStatusWrapper,
  moveItemFromPlayerToCurrentRoomWrapper,
  healPlayerWrapper,
  hurtPlayerWrapper,
  movePlayerToRandomRoomWrapper,
  movePlayerToRoomWrapper,
  moveItemWrapper,
  moveItemFromCurrentRoomToPlayerWrapper,
  healPlayerIfNeededWrapper,
  dealDamageIfNeededWrapper,
};
module.exports = api;
