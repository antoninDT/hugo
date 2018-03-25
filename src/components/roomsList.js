import React, { Component } from 'react';

// TODO: Update this component and try to convert all classes to simple React class-less component

class RoomsList extends Component {
  constructor(props) {
    super(props);
    this.rooms = props.rooms;
  }
  render() {
    return (
      <element>
      Rooms:
        {
          this.rooms.map((room, index) => (
            <box top={index} height={3} key={room.id}>
              {`Room: ${room.name}`}
            </box>
          ))
        }
      </element>
    );
  }
}

export default RoomsList;
