# Hugo

A NodeJS CLI game project for learning **clean JS**.

# Requirements

 * **NodeJs** (v9.7 or later preffered): [https://nodejs.org/en/download/]

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

# Changing the game (data files)

   It's fun and easy to customize the game by editing the JSON files inside the `data` folder. Here is some info about each one:

  * **goals.json**: example:

  ```js
  {
    "craftItemGoal": {
      "id": 1, // Id's must be greater than 0
      "goalTypeId": "1", // The following goalTypeId's can be used:
      // 1: Craft an item to win
      // 2: Find an item to win
      // 3: Find multiple items to win
      "description": "Use the clues given to craft the correct item"
    },
    "findTheItemGoal": {
      "id": 2,
      "description": "Use the clues given to find the item to win"
   },
   "findMultipalItemsGoal": {
     "id": 3,
     "description": "Use the clues given to find the items to win"
   }
  }
  ```

# TODO:
  * Update the README file (Add the remaining JSON file examples) (Explain the following: items, player, etc.)
  * Finnish refactoring
  * Make win conditions more difficult (bringing item to room).
  * Make different game modes (Crafting game mode).
  * Add weapons to the game?
  * Make the backgroundColor change based on time of day
