const itemsLookup = require('./items.js');

const roomsLookup = {
    hall: {
        id: 0,
        name: 'Hall',
        inventory: [],
    },
    cafeteria: {
        id: 1,
        name: 'Cafeteria',
        inventory: [
            itemsLookup.djKhaled.id,
            itemsLookup.bambu.id,
            itemsLookup.bitconnectpamphlet.id,
        ],
    },
    lounge: {
        id: 2,
        name: 'Lounge',
        inventory: [
            itemsLookup.bonebreakingmup.id,
            itemsLookup.car.id,
            itemsLookup.cdoflatesteurvisionsingles.id,
        ],
    },
    office: {
        id: 3,
        name: 'Office',
        inventory: [
            itemsLookup.cigerettejuice.id,
            itemsLookup.cincoPhone.id,
            itemsLookup.computer.id,
        ],
    },
    garage: {
        id: 4,
        name: 'Garage',
        inventory: [
            itemsLookup.ducklorange.id,
            itemsLookup.meyerscannedhorseinacan.id,
            itemsLookup.pen.id,
        ],
    },
};

module.exports = roomsLookup;
