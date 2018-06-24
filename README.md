# Hugo

A NodeJS CLI game project for learning **clean JS**.

# Requirements

 * **NodeJs** (v9.7 or later preferred): [https://nodejs.org/en/download/]

# Setup

  * Clone this repo or download it as a .zip file and extract it somewhere.
  * Open a terminal in the extracted directory/repo
  * **Install NPM dependencies (need to do this at least once)**: Run `npm i`

# How to start the game


  * Run `node hugo.js`


By Antonin Dujardin-Terry

AKA: Tonysacs(TM)

# About the game

  **Goals**: In Hugo Hulp you do not start off with a goal. This means that you must choose the goal your self. In order to see which goals are available just type in `help` and a list of goals will appear along with their Id's.

  **Player**: In Hugo Hulp the `player` has several different properties: example:

  ```js
  const player = {
    currentGoalId: 0, // The id of the current goal
    health: 100, // The health the player starts of with
    maxHealth: 100, // The max amount of health the player can have
    currentRoomId: defaultRoomId, // The id of the room the player is current in
    inventory: [] // The inventory of the player
  };
  ```
  **Items**: In Hugo Hulp their are a item's the player must collect to win the game. If the player picks up the WRONG item the player will take DAMAGE.

  **Rooms**: In Hugo Hulp the player must check which room has the item or item's that the player wishes to find. Keep in mind that in order to move from room to room you must make sure it is CONNECTED first.

# Changing the game (data files)

   It's fun and easy to customize the game by editing the JSON files inside the `data` folder. Here is some info about each one:

  * **goals.json**: example:

  ```js
  {
    "craftItemGoal": {
      "id": 1, // Id's must be greater than 0
      "goalTypeId": 1, // The following goalTypeId's can be used:
      // 1: Craft an item to win
      // 2: Find an item to win
      // 3: Find multiple items to win
      "numberOfItemsToWin": 1, // With this you can change how many items you need to craft or find before winning
      "description": "Use the clues given to craft the correct item"
  }
}
  ```

  * **commands.json**: example:

  ```js
  {
    "exit": {
      "commands": ["exit", "bye", "doei", "doe doei"], // These are the names of the commands, make sure that they don't        conflict with other commands
      "description": "Type this in to exit the game"
   }
  }
```

* **enemies.json**: example:

```js
{
  "slowWifi": {
    "id": 0,
    "isEnemy": true, // This must stay true
    "name": "Slow Wifi", // The name of the enemy
    "attackMessage": "You have lost health from the slow Wifi in this room...", // The message that is shown when attacked
    "damage": 10 // The amount of damage dealt to player to the player (keep in mind that 100 means instant death as the player has a max of 100 health)
  }
}
```

* **healers.json**: example:

```js
{
  "healthPotion": {
    "id": 800, // Id's must have two 00's at the end, like 800 or 100
    "isHealer": true, // This must stay true
    "name": "Health Potion", // The name of the healer
    "healingAmount": 20 // The amount health the player the gains (keep in mind that the player has a max of 100 health)
  }
}
```

* **items.json**: example:

```js
{
  "pen": {
    "id": 0,
    "isItem": true, // This must stay true
    "name": "Pen", // The name of the item
    "damage": 20, // The amount of damage the item will deal to the player (keep in mind that the player has a max of 100 health)
    "clues": ["You can use this to write things...", "Has ink inside of it...", "Cats love to play with them..."] // The clues for the item
  }
}
```

* **recipes.json**: example:

```js
{
  "chewedUpPen": {
      "ingredients": [0, 10], // The id's of the items necessary to craft this item  
      "result": {
        "id": 9001, // The id of the crafted item or the end result (the id has to have 4 digits)
        "isItem": true, // This must stay true
        "name": "Chewed up pen", // The name of the crafted item
        "clues": ["One of the many side effects of owning a cat...", "This used to be a perfectly good pen, but a certain beast came and ruined it"] // The clues for the crafted item
      }
   }
}

```

* **rooms.json**: example:

```js
{
  "hall": {
    "id": 0, // The id of the room
    "name": "Hall", // The name of the room
    "connectedRooms": [1,2,5], // The id's of the rooms connected to this room
    "inventory": [], // Leave it empty to let the game add item's to it randomly otherwise if you wanna do it manually then put the id's of the items
    "enemies": [], // Same idea as the inventory but for enemies
    "healers": [], // Same idea as the inventory but for healers
    "clues": ["it is in a long passage way", "it is in a place that is a bridge to the other rooms", "it is in that corridor never seems to end..."] // The clue for the room
  }
}

```

# TODO:
  * Finnish refactoring
  * Make win conditions more difficult (bringing item to room).
  * Add weapons to the game?
  * Make the backgroundColor change based on time of day
