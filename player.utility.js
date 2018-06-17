
const chalk = require('chalk');

const { getRoomById } = require('./room.utility');
const { flashScreenRed } = require('./console.utility');
const { getRandomArrayItem } = require('./general.utility');
const { addSentenceToSpeechQueue, sayListWithAnd } = require('./voices.utility');
const { changeCurrentGoalIdWrapper } = require('./winConditions.utility');

const dealDamageIfNeededWrapper = (game) => (showEnemyOrHealer, shouldSpeak = true) => {  // TODO: Fix the flashing of the text
  const currentGoal = game.getCurrentGoal();
  const currentGoalId = currentGoal.id;
  if (!showEnemyOrHealer.damage) { return; }
  if (showEnemyOrHealer.isItem && (game.state.winningFactors.itemIdsToWin.includes(showEnemyOrHealer.id))) { return; }
  if (currentGoalId == 1) { // TODO: Fix the arugements in this if statement. It should only check the following if the currentGoalId is 1
    const recipeToWin = game.getRandomRecipeIdToWin();
    const recipeToWinDetails = game.state.recipes.find((recipe) => recipe.result.id === recipeToWin);
    const ingredientsOfRecipeToWin = recipeToWinDetails.ingredients;
    if (showEnemyOrHealer.isItem) {
      if (ingredientsOfRecipeToWin.includes(showEnemyOrHealer.id)) {
        return;
      }
    }
  }
  if (shouldSpeak) { game.actions.hurtPlayer(showEnemyOrHealer.damage); }
  game.hurtPlayer(showEnemyOrHealer.damage, false);
};

const healPlayerIfNeededWrapper = (game) => (showEnemyOrHealer) => {
  if (!showEnemyOrHealer.healingAmount) { return; }
  if (showEnemyOrHealer.isItem && showEnemyOrHealer === game.state.winningFactors.itemIdsToWin) { return; }
  game.healPlayer(showEnemyOrHealer.healingAmount);  // TODO: Add a voice when gained healh
};

const moveItemFromPlayerToCurrentRoomWrapper = (game) => (itemName) => { // TODO: Implement arguments (Look further down for more info)
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
  game.moveItem({
    itemIdToMove: item.id,
    source: game.state.player,
    destination: game.getCurrentRoom(),
  });
  addSentenceToSpeechQueue({ sentence: `You have dropped "${item.name}"`, voice: 'princess' });
  game.consoleOutPut({
    text: `

                You have dropped "${chalk.bold.red(item.name)}"

       `,
    });
};

const moveItemFromCurrentRoomToPlayerWrapper = (game) => (itemName) => { // TODO: Make it so if the item Id is one of the ingredients of a recipe that you don't take damage
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
  const healer = game.state.healers.find((healer) => healer.name.toLowerCase() === itemName.toLowerCase());
  if (healer) { //TODO: Modify this later
    game.consumeHealer({ healer: healer, source: room });
    game.consoleOutPut({
      text: `

                  You used "${healer.name}"

        `,
      });
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
  game.moveItem({
    itemIdToMove: item.id,
    source: room,
    destination: game.state.player,
  });
  addSentenceToSpeechQueue({ sentence: `You have put "${item.name}" in your inventory`, voice: 'princess' });
  game.consoleOutPut({
    text: `

                You have put "${chalk.bold.red(item.name)}" into your inventory

       `,
    });
  game.dealDamageIfNeeded(item, false);
  if (game.didPlayerWinDecider()) { //TODO: Create an argument to state which gamemode is currently being used, therefore changing the way the player would win
    game.showWinScreen();
  }
};

const moveItemWrapper = (game) => ({ itemIdToMove, source, destination }) => {
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
  }
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

const healPlayerWrapper = (game) => (amount) => {
  if (!amount) { return; }
  game.state.player.health += amount;
  if (game.state.player.health > game.state.player.maxHealth) {
    game.state.player.health = game.state.player.maxHealth;
  }
  game.showPlayerStatus(false, false);
};

const consumeHealerWrapper = (game) => ({ healer, source}) => {
   const healerId = healer.id;
   const newSourceInventory = source.healers.filter((id) => id !== healerId);
   source.healers = newSourceInventory;
   game.healPlayerIfNeeded(healer);
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
  sayListWithAnd({ list: allItemNames, voice: 'princess' });
};

const api = {
  changeCurrentGoalIdWrapper,
  consumeHealerWrapper,
  dealDamageIfNeededWrapper,
  healPlayerIfNeededWrapper,
  healPlayerWrapper,
  hurtPlayerWrapper,
  moveItemFromCurrentRoomToPlayerWrapper,
  moveItemFromPlayerToCurrentRoomWrapper,
  moveItemWrapper,
  movePlayerToRandomRoomWrapper,
  movePlayerToRoomWrapper,
  showInventoryWrapper,
  showPlayerStatusWrapper,
};
module.exports = api;
