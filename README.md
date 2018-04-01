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

# TODO:

  * Make some items heal the player when picked up
  * (DO THIS IN A SEPARATE BRANCH!)Add "connected room IDs" property to each room (will need to change show rooms command to show only the rooms connected and go to (is room connected))

  * Make win conditions more difficult (2 items?) or (bringing item to room).
  * Have logic check the time of day and change the colors based on that info (Good evening? (based on time))
      ```js

      const now = new Date();
      const currentHour = now.getHours();
      switch(true) {
        case (currentHour < 12): {
          // This is the morning, TODO: do something
          break;
        }
        case ((currentHour >= 12) && (currentHour < 18)): {
          // This is the afternoon, TODO: do something
          break;
        }
        case ((currentHour >= 18) && (currentHour <= 24)): {
          // This is the night, TODO: do something
          break;
        }
      }

      ```

  * crafting system (combining items)
