const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const say = require('say');
const chalkAnimation = require('chalk-animation');

//TODO: Find out to change the font/increase the size of the font
const itemsLookup = require('./data/items.json');
const roomsLookup = require('./data/rooms.json');
const commandLookup = require('./data/commands.json');
const enemiesLookup = require('./data/enemies.json');
const healersLookup = require('./data/healers.json');

const commands = Object.values(commandLookup);
const items = Object.values(itemsLookup);
const rooms = Object.values(roomsLookup);
const enemies = Object.values(enemiesLookup);
const healers = Object.values(healersLookup);

const defaultRoomId = roomsLookup.hall.id;
const player = {
    health: 100,
    maxHealth: 100,
    currentRoomId: defaultRoomId,
    inventory: [],
};
const trashCan = { //TODO: Remove this, and replace it with something else
    inventory: [],
};

const getItemById = (itemId) => items.find((item) => item.id === itemId);
const getEnemyById = (enemyId) => enemies.find((enemy) => enemy.id === enemyId);
const getHealerById = (healersId) => healers.find((healers) => healers.id === healersId);
const getRoomById = (roomId) => rooms.find((room) => room.id === roomId);

const getRandomArrayItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const basicCFontOptions = {
    font: 'simple3d',
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

const game = {
    state: {
        player,
        trashCan,
        rooms,
        items,
        enemies,
        healers,
        itemIdsToWin: [
          items[Math.floor(Math.random() * items.length)].id,
          items[Math.floor(Math.random() * items.length)].id,
        ], // TODO: Add a check at the start of the game to make sure that each of these ids are different
    },
    actions: {
          hurtPlayer(amount, shouldSpeak = true) {
            if (!amount) { return; }
            game.state.player.health -= amount;
            if (game.state.player.health <= 0) {
                game.showLoseScreen();
                return;
            }
            if (shouldSpeak) { game.showPlayerStatus(); return;}
            game.showPlayerStatus(false,true);
        },
        healPlayer(amount) { // TODO: Use this function later
            if (!amount) { return; }
            game.state.player.health += amount;
            if (game.state.player.health > game.state.player.maxHealth) {
                game.state.player.health = game.state.player.maxHealth;
            }
            game.showPlayerStatus(false,false);
        },
        movePlayerToRandomRoom() {
            const randomRoom = getRandomArrayItem(game.state.rooms);
            this.movePlayerToRoom(randomRoom.id,false,false);
        },

        randomlyDistributeItemsToRooms() { // TODO: Need to randomly sort rooms
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
        },
        randomlyDistributeEnemiesToRooms() { // TODO: Need to randomly sort rooms
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
        },
        randomlyDistributeHealersToRooms() {
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
        },
        moveItem(itemIdToMove, source, destination) {
            const newSourceItems = source.inventory.filter((itemId) => itemId !== itemIdToMove);
            source.inventory = newSourceItems;
            destination.inventory.push(itemIdToMove);
        },
        movePlayerToRoom(roomId, shouldSpeakCurrentRoom = true, shouldCheckConnectedRooms = true) {
            const room = getRoomById(roomId);
            const currentRoom = game.getCurrentRoom();
            const roomName = room.name;
            if (!currentRoom.connectedRooms.includes(room.id) && shouldCheckConnectedRooms) { console.log(`${roomName} is not connected to the current room`); say.speak(`${roomName} is not connected to the current room`, 'princess'); return; } //TODO: Say which rooms are connected to the current room
            game.state.player.currentRoomId = roomId;
            if (shouldSpeakCurrentRoom) { game.showCurrentRoom(); return;}
            game.showCurrentRoom(false);
        },
        moveItemFromCurrentRoomToPlayer(itemName) {
            if (!itemName) {
                say.speak(`You forgot to put the name of the item to pick up hoor

                   try again!`, 'princess');
                console.log(chalk.white(`

                                    😂😂😂
                    You forgot to put the name of the item to pick up hoor... try again!
                                    😂😂😂

                `));
                return;
            }
            const room = game.state.rooms.find((room) => room.id === game.state.player.currentRoomId);
            if (!room.inventory || !room.inventory.length) {
                say.speak(`The room is empty`, 'princess');
                console.log(chalk.white(`

                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                    room is empty...
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️

                `));
                return;
            }
            const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
            const healer = healers.find((healer) => healer.name.toLowerCase() === itemName.toLowerCase()); //TODO: Make a use fuction to use the healers
            if (healer) { this.moveItem(healer.id, room, player); this.moveItem(healer.id, player, trashCan); console.log(chalk.white(`

                      You used "${healer.name}"

              `));
              game.healPlayerIfNeeded(healer);
              return;
             }
            if (!item || !room.inventory.includes(item.id)) {
                 say.speak(`The current room does not have "${itemName}"`, 'princess');
                console.log(chalk.white(`

                        The current room does not have "${chalk.bold.red(itemName)}"

                `));
                return;
            }
            this.moveItem(item.id, room, player);
            say.speak(`You have put "${item.name}" in your inventory`, 'princess');
            console.log(chalk.white(`

                    You have put "${chalk.bold.red(item.name)}" into your inventory

            `));
            game.dealDamageIfNeeded(item,false);
            if (game.didPlayerWin()) {
                game.showWinScreen();
            }
        },
        moveItemFromPlayerToCurrentRoom(itemName) {
            if (!itemName) {
              say.speak(`You forgot to put the name of the item to drop hoor

                 try again!`, 'princess');
                console.log(chalk.white(`

                                    😂😂😂
                    You forgot to put the name of the item to drop hoor... try again!
                                    😂😂😂

                `));
                return;
            }
            if (!game.state.player.inventory || !game.state.player.inventory.length) {
                say.speak(`There is nothing in your Inventory`, 'princess');
                console.log(chalk.white(`

                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️️
                    Inventory is empty...
                    🕸️🕸️🕸️🕸️🕸️🕸️🕸️🕸️

                `));
                return;
            }
            const item = items.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
            if (!item || !game.state.player.inventory.includes(item.id)) {
                say.speak(`"${itemName}" is not in your inventory`, 'princess');
                console.log(chalk.white(`

                         "${chalk.bold.red(itemName)}" is not in your inventory...

                `));
                return;
            }
            this.moveItem(item.id, game.state.player, game.getCurrentRoom());
            say.speak(`You have dropped "${item.name}"`, 'princess');
            console.log(chalk.white(`

                    You have dropped "${chalk.bold.red(item.name)}"

            `));
        },
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
            colors: ['blue', 'white'],
        };
        if (shouldSpeakClue) { say.speak('DOE DOEI', 'ellen', 0.5); }
        CFonts.say('DOE', goodbyeMessageOptions);
        CFonts.say('DOEI', goodbyeMessageOptions);
        CFonts.say('!!', goodbyeMessageOptions);
        process.exit();
    },
      // TODO: Make a high score screen
    showWinScreen() {
        say.speak(`Congratulations!

            You have found the hidden item!`, 'daniel',);
        console.log(chalk.magentaBright(`
            Congratulations! You have found the hidden Item!
        `));
        this.goodbye(false);
    },
    showLoseScreen() {
        say.speak(`Uh Oh it looks like you have die ie ied!
        `,'Bad News',);
        this.showPlayerStatus(false,false);
        const text = 'Uh Oh... It appears you died, try again next time!';

        console.log(chalk.redBright(`
            Uh Oh... It appears you died, try again next time!
        `, ));
        this.goodbye(false);
    },
    showRooms() { // TODO: Add voices to this
      const getRoomName = (room) => room.name;
      const getConnectedRooms = (room) => room.connectedRooms;
      const currentRoom = this.getCurrentRoom();
      const roomContents = [
        ...currentRoom.connectedRooms.map(getRoomById)
      ];
      const nameOfRoomContents = [
        ...roomContents.map(getRoomName)
      ];
      const showRoomName = (roomName) => console.log(chalk.white(`    * ${chalk.bold.greenBright(roomName)}`));
        console.log(`${chalk.italic.yellow('Here are the all rooms:')}`);
        this.state.rooms
            .map(getRoomName)
            .forEach(showRoomName);
        console.log(`${chalk.italic.yellow(`Here are the rooms that are connected to your room: `)}`);  //Get this working          
        nameOfRoomContents
            .forEach(showRoomName);
    },
    getCurrentRoom() {
        const result = this.state.rooms.find((room) => room.id === this.state.player.currentRoomId);
        return result;
    },
    showEnemyOrHealer(showEnemyOrHealer) {
      if (showEnemyOrHealer.isItem) {
        const chalkFormat1 = chalk.bold.blue;
          console.log(chalk.white(chalk.white(`
                  * (${chalkFormat1(showEnemyOrHealer.name)})
        `)));
       return;
       }
      const chalkFormat2 = (showEnemyOrHealer.isEnemy) ? chalk.bold.red : chalk.bold.greenBright;
        console.log(chalk.white(chalk.white(`
                  * (${chalkFormat2(showEnemyOrHealer.name)})
          `)));
    },
    showEnemyAttackMessage(enemy) {
      console.log(chalk.white(`${enemy.attackMessage} and lost ${chalk.red(enemy.damage)} health "${chalk.bold.red(enemy.name)}" `));
    },
    dealDamageIfNeeded(showEnemyOrHealer, shouldSpeak = true) {
        if (showEnemyOrHealer.isEnemy) { game.actions.hurtPlayer(showEnemyOrHealer.damage, false); return; } // TODO: Fix the flashing of the text
        if (!showEnemyOrHealer.damage) { return; }
        if (showEnemyOrHealer.isItem && (this.state.itemIdsToWin.includes(showEnemyOrHealer.id))) { return; }
        if (shouldSpeak) { game.actions.hurtPlayer(showEnemyOrHealer.damage); }
        game.actions.hurtPlayer(showEnemyOrHealer.damage, false);
    },
    healPlayerIfNeeded(showEnemyOrHealer) {
        if (!showEnemyOrHealer.healingAmount) { return; }
        if (showEnemyOrHealer.isItem && showEnemyOrHealer === this.state.itemIdsToWin) { return; }
        game.actions.healPlayer(showEnemyOrHealer.healingAmount);
        //TODO: Make this work
        // TODO: Add a voice when gained healh

    },
    flashScreenRed(text) { // TODO: Finish implementing this
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
    },
    showPlayerStatus(shouldSpeak = true, shouldFlash = true) {
        const text = `You have ${this.state.player.health} health out of ${this.state.player.maxHealth}`;
        if (shouldFlash) { this.flashScreenRed(text); return; }
        if (shouldSpeak) { say.speak(`You have ${this.state.player.health} health out of ${this.state.player.maxHealth}`, 'princess'); }
        console.log(`
               You have ${this.state.player.health} health out of ${this.state.player.maxHealth}
        `)
    },
    showCurrentRoomContents(shouldSpeak = true) {
        const currentRoom = this.getCurrentRoom();
        const currentRoomContentsVoice = 'princess';
        const roomContents = [
          ...currentRoom.inventory.map(getItemById),
          ...currentRoom.enemies.map(getEnemyById),
          ...currentRoom.healers.map(getHealerById),
        ];
        const roomEnemies = [
          ...currentRoom.enemies.map(getEnemyById)
        ];
        const roomHealers = [
          ...currentRoom.healers.map(getHealerById)
        ];
        if (!(roomContents.length)) {
            if (shouldSpeak) { say.speak('You look around and notice that the room is empty', 'princess'); }
            console.log(chalk.white(`

            You look around and notice that the room is empty...
            💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩

        `));
            return;
        }
        if (currentRoom.enemies.length) { // TODO: Make the voice say that you have been harmed by an enemy, then say the list of items...
          roomEnemies
              .forEach(this.showEnemyAttackMessage);
          roomEnemies
              .forEach(this.dealDamageIfNeeded);
          this.showPlayerStatus(false,false);
          // return; // TODO: Make the health flash and then show the items in the room
         }
        console.log(chalk.yellow(`

            You look around and notice the following things:

        `));
        roomContents
            .forEach(this.showEnemyOrHealer);
        if (shouldSpeak) {
          const continueSpeakingItems = () => {
              const speakItem = (index = 0) => {
                  const item = roomContents[index];
                  if (!item) { return; }
                  const isLastItemInInventory = (index >= (roomContents.length - 1));
                  const conditionalAnd = (index) ? `, and , `: '';
                  const itemSentence = `${conditionalAnd} ${item.name}`;
                  say.speak(itemSentence, currentRoomContentsVoice, null, () => speakItem(index + 1));
              };
              speakItem();
          };
          say.speak('You look around and notice the following things: ', currentRoomContentsVoice, null, continueSpeakingItems);
        }
    },
    showInventory() {
        const inventoryVoice = 'princess';
        if (!this.state.player.inventory.length) {
            say.speak('There is nothing in your Inventory', inventoryVoice);
            console.log(chalk.white(`

                There is nothing in your Inventory...

                          😐😐😐

            `));
            return;
        }
        console.log(chalk.yellow(`

            You have the following items:

        `));
        this.state.player.inventory
            .map(getItemById)
            .forEach(this.showEnemyOrHealer);
        const continueSpeakingItems = () => {
            const speakItem = (index = 0) => {
                const itemId = this.state.player.inventory[index];
                if (!itemId) { return; }
                const item = getItemById(itemId);
                if (!item) { return; }
                const isLastItemInInventory = (index >= (this.state.player.inventory.length - 1));
                const conditionalAnd = (index) ? `, and , `: '';
                const conditionalThatsAll = (isLastItemInInventory) ? `.

                  That's all! Nothing else? no more!

                ` : '';
                const itemSentence = `${conditionalAnd} ${item.name}${conditionalThatsAll}`; // TODO: Add an item description here and in the items.js file
                say.speak(itemSentence, inventoryVoice, null, () => speakItem(index + 1));
            };
            speakItem();
        };
        say.speak('You have the following items in your inventory: ', inventoryVoice, null, continueSpeakingItems);
    },
    // TODO: Add a "show status" function and then use it.
    clearScreen() {
        console.log('\x1Bc');
    },
    sampleVoices() {
        const voices = [
            'Agnes',
            'Albert',
            'Alex',
            'Alice',
            'Alva',
            'Amelie',
            'Anna',
            'Bad News',
            'Bahh',
            'Bells',
            'Boing',
            'Bruce',
            'Bubbles',
            'Carmit',
            'Cellos',
            'Damayanti',
            'Daniel',
            'Deranged',
            'Diego',
            'Ellen',
            'Fiona',
            'Fred',
            'Good news',
            'Hysterical',
            'Ioana',
            'Joana',
            'Jorge',
            'Juan',
            'Kanya',
            'Karen',
            'Kate',
            'Kathy',
            'Kyoko',
            'Laura',
            'Lee',
            'Lekha',
            'Luca',
            'Luciana',
            'Maged',
            'Mariska',
            'Mei-Jia',
            'Melina',
            'Milena',
            'Moira',
            'Monica',
            'Nora',
            'Oliver',
            'Paulina',
            'Pipe Organ',
            'Princess',
            'Ralph',
            'Samantha',
            'Sara',
            'Satu',
            'Serena',
            'Sin-ji',
            'Tessa',
            'Thomas',
            'Ting-Ting',
            'Trinoids',
            'Veena',
            'Vicki',
            'Victoria',
            'Whisper',
            'Xander',
            'Yelda',
            'Yuna',
            'Yuri',
            'Zarvox',
            'Zosia',
            'Zuzana',
        ];

        const sampleVoice = (index = 0) => {
            const voice = voices[index];
            if (!voice) { return; }
            console.log(`DEBUG: sampleVoice() voice: ${voice}`); // TODO Kill this line
            const speakSampleSentence2 = (voice) => {
                const sampleSentence2 = 'Airam and her boyfriends, including Isreal and Connor';
                say.speak(sampleSentence2,voice, 1, () => sampleVoice(index +1));
            };
            const speakSampleSentence1 = (voice) => {
                const sampleSentence = `This is a sample sentence for the game. La la la la! Ma ma ma ma! Ra ra Ba ba pa pa, fa fa fa fa fa

                These three skis through the trees to my knees but without all those tricky tricky stinky slinky bees. Who? Why? What! OK! whatever

                `;
                say.speak(sampleSentence, voice, 1, () => sampleVoice(index + 1));
            };
            const speakSampleSentenceForVoice = () => { speakSampleSentence2(voice); };
            const speakAnnouncement = () => { say.speak(`Sample voice for: ${voice}`, 'Samantha', 1, speakSampleSentenceForVoice); };
            speakAnnouncement();
        };
        const speakGreeting = () => { say.speak(`OK, now I'm going to list all of the possible voices for you: `, 'Samantha', 1, () => sampleVoice()); };
        speakGreeting();
    },
    welcomeMessage() { // TODO: Add promises so that voice can work
        const welcomeMessageOptions = {
            ...basicCFontOptions,
            font: 'block',
            colors: ['candy', 'candy'],
        };
        this.clearScreen();
        CFonts.say('Welkom|bij|Hugo|Hulp', welcomeMessageOptions);
        say.speak('Welkom bij Hugo Hulp', 'ellen', 0.5);
        console.log();
        console.log(`${chalk.bold.magenta('Can you find the hidden item??')}`);
        console.log();
        this.showRooms();
        this.showPlayerStatus(false,false);
        this.showCurrentRoom(false);
        this.giveItemClue(false);
    },
    getRandomItemIdToWin() {
      let itemId = getRandomArrayItem(this.state.itemIdsToWin);
      while (this.state.player.inventory.includes(itemId)) {
        itemId = getRandomArrayItem(this.state.itemIdsToWin)
      }
      return itemId;
    },
    getCurrentItemClue(randomItemIdToWin) {
        const itemToWin = items.find((item) => item.id === randomItemIdToWin);
        const randomItemClue = getRandomArrayItem(itemToWin.clues);
        return randomItemClue;
    },
    getCurrentRoomClue(randomItemIdToWin) {

        const roomContainingTheItem = rooms.find((room) => room.inventory.includes(randomItemIdToWin));
        const randomClueForRoom = getRandomArrayItem(roomContainingTheItem.clues);
        return randomClueForRoom;
    },
    giveItemClue(shouldSpeakClue = true) {
        const randomItemIdToWin = this.getRandomItemIdToWin();
        const roomClue = this.getCurrentRoomClue(randomItemIdToWin);
        const itemClue = this.getCurrentItemClue(randomItemIdToWin);
        if (shouldSpeakClue) { say.speak(`

        Here is you clue: ${itemClue}

        and. ${roomClue}

        `, 'Princess',); }
        console.log(chalk.yellow('Here is your clue:'));
        console.log(chalk.white(`

            ${chalk.bold.red(itemClue)} and ${chalk.bold.red(roomClue)}

        `));
    },
    showCurrentRoom(shouldSpeakCurrentRoom = true) {
        const currentRoomName = this.getCurrentRoom().name;
        console.log(chalk.white(`

            You are in the ${chalk.bold.greenBright(currentRoomName)}.

        `));
        if (shouldSpeakCurrentRoom) { say.speak(`You are in the ${currentRoomName}`, 'princess'); }
    },
    showHelp() {
        const commandBoxOptions = {
            ...basicBoxOptions,
            borderColor: 'green',
            backgroundColor: 'blue',
            borderStyle: {
                topLeft: 'ᒥ',
                topRight: 'ᒣ',
                bottomLeft: 'ᒪ',
                bottomRight: 'ᒧ',
                horizontal: '-',
                vertical: '|'
            }
        };
        console.log(boxen(chalk.yellow('List of commands'), commandBoxOptions));
        commands.forEach((command) => {
            console.log(chalk.white(`  * ${chalk.bold.red(command.commands[0])}: ${chalk.white(command.description)}`));
        });
        console.log(chalk.bold.magenta(`The goal of this game is to find the hidden item. To do this you have to use the clues given to guess what it is.

              Clues: ${chalk.white(`The first clue that is on the left side of the screen is the Item clue, and the clue on the right side is the Room clue.`)}

              Rooms: ${chalk.white(`In order to move to another room you first need to check if it's connected to the current room your in.`)}

              Health: ${chalk.white(`You may have noticed that you have health in this game you lose health everytime you pick up an item thats incorrect.`)}

              Color of the text (${chalk.white(`for the look around command`)}): ${chalk.white(`The objects with the color ${chalk.bold.red(`red`)} are enemies,

                                                                the color ${chalk.bold.blue(`blue`)} are items,

                                                                and the color ${chalk.bold.green(`green`)} are healers [heals you].`)}

          `));
    },
};

const getNewGame = () => {
    const result = {
        ...game,
    };
    return result;
};


const api = {
    getNewGame,
};

module.exports = api;
