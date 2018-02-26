const itemsLookup = require('./items.js');

const roomsLookup = {
    hall: {
        id: 0,
        name: 'Hall',
        inventory: [],
        clues: [
            'You might wanna look where you first started...',
            'It was empty when you first looked but you have a feeling that it is no longer empty...',
            'The corridor never seems to end...',
        ],
    },
    cafeteria: {
        id: 1,
        name: 'Cafeteria',
        inventory: [
            itemsLookup.djKhaled.id,
            itemsLookup.bambu.id,
            itemsLookup.bitconnectpamphlet.id,
        ],
        clues: [
            'You smell the faint scent of food and have a feeling that what you are looking for may be in that very room...',
            '"FOOD FIGHT!!!"',
            'The daily specials today are mystery meat with a side of hard tack and something that looks like it was a desert at some point...',
        ],
    },
    lounge: {
        id: 2,
        name: 'Lounge',
        inventory: [
            itemsLookup.boneBreakingMup.id,
            itemsLookup.car.id,
            itemsLookup.cdOfLatestEurovisionSingles.id,
        ],
        clues: [
            'A place that you go to when you need to relax after a long day',
            '*Elevator Music*',
            'This place is known for having the most outdated magazines...',
        ],
    },
    office: {
        id: 3,
        name: 'Office',
        inventory: [
            itemsLookup.aka.id,
            itemsLookup.rum.id,
            itemsLookup.computer.id,
        ],
        clues: [
            'You hear the noise of someone typing on a keyboard',
            'The whirring and humming of machines lures you to a certain room...',
            'You have a feeling that the item might be used with computers',
        ],
    },
    garage: {
        id: 4,
        name: 'Garage',
        inventory: [
            itemsLookup.canOfOnoHehe.id,
            itemsLookup.munsterCheese.id,
            itemsLookup.pen.id,
        ],
        clues: [
            'You smell the fumes of gasoline coming from this room',
            'You almost never go to this room, as it usually has a spider waiting for you somewhere...',
            'You remember that there was a room that was usually used to park cars...',
        ],
    },
};

module.exports = roomsLookup;
