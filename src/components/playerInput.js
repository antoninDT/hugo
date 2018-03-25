import React, { Component } from 'react';

// TODO: Update this component

class PlayerInput extends Component {
  constructor(props) { // TODO: Update this example constructor code
    super(props);
    this.state = {
      name: '',
    };
    this.submit = (data) => this.setState(state => ({name: data}));
    this.cancel = () => console.log('Form canceled');
  }
  render() {
    return (
      <form keys
            left="5%"
            top="5%"
            width="90%"
            height="90%"
            border={{type: 'line'}}
            style={{bg: 'cyan', border: {fg: 'blue'}}}
            onSubmit={this.submit}
            onReset={this.cancel}
      >
        <box width={6} height={3}>Name: </box>
        <textbox left={6}
                 height={3}
                 keys
                 mouse
                 inputOnFocus
                 onSubmit={this.submit}
        />
        <box top={3} height={3}>
          {`Result: ${this.state.name}`}
        </box>
      </form>
    );
  }
}

export default PlayerInput;
