
// TODO: Add enemies to the game or make a separate folder for items that hurt you

const itemsLookup = {
    pen: {
        id: 0,
        name: 'Pen',
        damage: 20,
        clues: [
            'You can use this to write things...',
            'Has ink inside of it...',
            'Cats love to play with them...',
        ],
    },
    computer: {
        id: 1,
        name: 'Computer',
        damage: 20,
        clues: [
            'This item is made by many companies like Microsoft or Apple...',
            '[ENTER PASSWORD]...',
            'You use it to "Hack into the system..."',
        ],
    },
    djKhaled: {
        id: 2,
        name: 'DJ KHALED!', // TODO: Fix not being able to pick this muthafucka up
        damage: 20,
        clues: [
             '"WE THE BEST MUSIC!!!!..."',
             '"Ive changed...... A LOT"',
             '"Say my name..."',
        ],
    },
    footBall: {
        id: 3,
        name: 'Football',
        damage: 20,
        clues: [
            '"GOOOAAALLL!!!..."',
            'Americans call it soccer...',
            '"PANNA..."',
        ],
    },
    recordingOfTramMan: {
        id: 4,
        name: 'Recording of tram man',
        damage: 20,
        clues: [
            '"Vergeet Uw straks niet uit te checken..."',
            '"Centraal Station, overstoppen op de lijnen..."',
            '"This door is not an entrance!!..."',
        ],
    },
    laserPointer: {
        id: 5,
        name: 'Laser Pointer',
        damage: 20,
        clues: [
            '"PEW PEW!!"',
            'WARNING: We are not responsible for the cats this will attract...',
            'It shoots a beam of light...',
        ],
    },
    munsterCheese: {
        id: 6,
        name: 'Munster Cheese',
        damage: 20,
        clues: [
            'The smell is worse than its taste...',
            'Due to bad breath after eating this, your Charisma will lower significantly...',
            'a very smelly product made from milk...',
        ],
    },
    rum: {
        id: 7,
        name: 'Rum',
        damage: 20,
        clues: [
            'Some argue that it is the essence of life...',
            '"WARNING: Might attract pirates..."',
            'Drinking this may make the game more difficult to play...',
        ],
    },
    car: {
        id: 8,
        name: 'Car',
        damage: 20,
        clues: [
            '"BEEP BEEP!"',
            '"Not reccomended to combine this item with Rum..."',
            'Like a horse drawn carriage but without the horse...',
        ],
    },
    surpriseTest: {
        id: 9,
        name: 'Surprise Test',
        damage: 20,
        clues: [
            'No one studies for this...',
            'Every high school students worst nightmare...',
            'One of the worst type of surprises...',
        ],
    },
    cat: {
        id: 10,
        name: 'Cat',
        damage: 20,
        clues: [
            '"Meow..."',
            '"WARNING: We are not responsible for any scratches caused by this item..."',
            'This item has fur, claws, and loves laser pointers...',
        ],
    },
    cdOfLatestEurovisionSingles: {
        id: 11,
        name: 'CD of latest Eurovision singles',
        damage: 20,
        clues: [
            'This item has all the greatist songs known to man (At least according to Europe)...',
            'After listening to this item you have decided to never listen to music again...',
            'On the back of this item you see that its about "Love, Unity, and Terrible English Lyrics..."',
        ],
    },
    yearBook: {
        id: 12,
        name: 'Year Book',
        damage: 20,
        clues: [
            'This item has all the most embarrassing pictures of the whole school...',
            'Its always a big competition to see who gets the most people to sign the back of this item in some schools...',
            'You go to this item when your kids asked what you looked like when you where a kid...',
        ],
    },
    faxMachine: {
        id: 13,
        name: 'Fax Machine',
        damage: 20,
        clues: [
            '"EERT! EEEIII! KRXNXX!..."',
            'This ancient item was once used to send documents and messages to people long before they had e-mails and other modern technologies...',
            'Very few people use this to send messages anymore as its very loud, old, and inconvenient to use...',
        ],
    },
    clock: {
        id: 14,
        name: 'Clock',
        damage: 20,
        clues: [
            '"TICK TOCK..."',
            'It has a face and two hands but no arms or legs...',
            'It usually hangs on the wall...',
        ],
    },
};

module.exports = itemsLookup;
