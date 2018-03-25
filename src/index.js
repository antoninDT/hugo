import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import { getNewGame } from './game.js';
import WelcomeScreen from './components/welcomeScreen';
import PlayerStatusBox from './components/playerStatusBox'; // TODO: Update the logic so that this doesn't show until after the welcome screen is dismssed
import PlayerInput from './components/playerInput';
import RoomsList from './components/roomsList';

// <PlayerInput /> // TODO: Add this to under the PlayerStatusBox, once we're ready to use it
// TODO: Create a component called itemsList, then create a component called roomContents (using items contents)

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Hugo Hulp'
});

const game = getNewGame();

const startGame = () => {
    game.actions.movePlayerToRandomRoom();
    game.actions.randomlyDistributeItemsToRooms();
    game.actions.randomlyDistributeEnemiesToRooms();
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game,
    };
    const keysToListenToForDismissingTheWelcomeScreen = [ // TODO: Make sure to unbind this handler in dismissWelcomeScreen
      'a',
      'return',
      'space',
    ];
    screen.key(keysToListenToForDismissingTheWelcomeScreen, (ch, key) => this.dismissWelcomeScreen(ch, key)); // TODO: Try with `null`instead of an array to see if it catches all keys
  }
  dismissWelcomeScreen() {
    if (!this.state.game.state.isWelcomeScreenShowing) { return; }
    this.setState({
      game: {
        ...this.state.game,
        state: {
          ...this.state.game.state,
          isWelcomeScreenShowing: false,
        },
      },
    });
    this.forceUpdate();
  }
  getMainContent() {
    if (this.state.game.state.isWelcomeScreenShowing) {
      return (
          <WelcomeScreen />
      );
    }
    return (
      <element>
        <RoomsList rooms={this.state.game.state.rooms} />
        <PlayerStatusBox playerState={this.state.game.state.player}/>
      </element>
    );
  }
  render() {
    const getMainContent = () => this.getMainContent();
    return getMainContent();
  }
}

screen.key(['escape', 'C-c'], () => { // Adding a way to quit the program
  return process.exit(0);
});

const component = render(<App />, screen); // Rendering the React app using our screen
