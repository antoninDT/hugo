import React, { Component } from 'react';

// TODO: Update this component
const stylesheet = {
  playerStatusBox: {
    top: '85%',
    left: 'left',
    width: '100%',
    height: '15%',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    }
  }
};

class PlayerStatusBox extends Component {
  constructor(props) {
    super(props);
    this.playerState = props.playerState;
  }
  render() {
    const playerState = this.playerState;
    return (
      <box class={stylesheet.playerStatusBox}
           label="PLAYER STATUS"
     >
        {`* Health: ${playerState.health} of ${playerState.maxHealth}`}
      </box>
    );
  }
}

export default PlayerStatusBox;
