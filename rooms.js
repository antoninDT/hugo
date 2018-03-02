const itemsLookup = require('./items.js');

const roomsLookup = {
    hall: {
        id: 0,
        name: 'Hall',
        inventory: [],
        clues: [
            'Its in a long passage way',
            'This place is a bridge to the other rooms',
            'The corridor never seems to end...',
        ],
    },
    cafeteria: {
        id: 1,
        name: 'Cafeteria',
        inventory: [],
        clues: [
            'You smell the faint scent of food and have a feeling that what you are looking for may be in that very room...',
            '"FOOD FIGHT!!!"',
            'The daily specials today are mystery meat with a side of hard tack and something that looks like it was a desert at some point...',
        ],
    },
    lounge: {
        id: 2,
        name: 'Lounge',
        inventory: [],
        clues: [
            'A place that you go to when you need to relax after a long day',
            '*Elevator Music*',
            'This place is known for having the most outdated magazines...',
        ],
    },
    office: {
        id: 3,
        name: 'Office',
        inventory: [],
        clues: [
            'You hear the noise of someone typing on a keyboard',
            'The whirring and humming of machines lures you to a certain room...',
            'You have a feeling that the item might be used with computers',
        ],
    },
    garage: {
        id: 4,
        name: 'Garage',
        inventory: [],
        clues: [
            'You smell the fumes of gasoline coming from this room',
            'You almost never go to this room, as it usually has a spider waiting for you somewhere...',
            'You remember that there was a room that was usually used to park cars...',
        ],
    },
    library: {
        id: 5,
        name: 'Library',
        inventory: [],
        clues: [
            '"SSHHHH! quiet!"',
            'This room smells like the pages of old books',
            'This place is all about reading',
        ],
    },
};

module.exports = roomsLookup;
