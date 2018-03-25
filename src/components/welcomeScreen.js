import React, { Component } from 'react';

// TODO: Update this for Hugo

class WelcomeScreen extends Component { // Rendering a simple centered box
  render() {
    return (
      <box top="center"
           left="center"
           width="50%"
           height="50%"
           border={{type: 'line'}}
           style={{border: {fg: 'blue'}}}
           label="Welkom"
     >
        Hugo
      </box>
    );
  }
}

export default WelcomeScreen;
