const say = require('say');

const delayBetweenProcessingInMilliseconds = 100;
const defaultVoice = 'Ellen'; // TODO: Change this later
const defaultSpeed = 1;
const queue = []; // Each item looks like this: { sentence, voice, voiceSpeed }

const processVoiceQueue = () => {
  const processNextQueueItem = () => setTimeout(processVoiceQueue, delayBetweenProcessingInMilliseconds);
  if (!queue.length) {
     processNextQueueItem();
     return;
  }
  const firstItemInTheQueue = queue.shift();
  const voice = firstItemInTheQueue.voice || defaultVoice;
  const speed = firstItemInTheQueue.voiceSpeed || defaultSpeed;
  say.speak(firstItemInTheQueue.sentence, voice, speed, processNextQueueItem);
};
setTimeout(processVoiceQueue, delayBetweenProcessingInMilliseconds);

const addSentenceToSpeechQueue = (speechOptions) => {
  queue.push(speechOptions);
};

const sampleVoicesWrapper = (game) => () => { // TODO REFACTOR: Move this into a new voice.utility.js file
  const voices = [
    'Agnes',
    'Albert',
    'Alex',
    'Alice',
    'Alva',
    'Amelie',
    'Anna',
    'Bad News',
    'Bahh',
    'Bells',
    'Boing',
    'Bruce',
    'Bubbles',
    'Carmit',
    'Cellos',
    'Damayanti',
    'Daniel',
    'Deranged',
    'Diego',
    'Ellen',
    'Fiona',
    'Fred',
    'Good news',
    'Hysterical',
    'Ioana',
    'Joana',
    'Jorge',
    'Juan',
    'Kanya',
    'Karen',
    'Kate',
    'Kathy',
    'Kyoko',
    'Laura',
    'Lee',
    'Lekha',
    'Luca',
    'Luciana',
    'Maged',
    'Mariska',
    'Mei-Jia',
    'Melina',
    'Milena',
    'Moira',
    'Monica',
    'Nora',
    'Oliver',
    'Paulina',
    'Pipe Organ',
    'Princess',
    'Ralph',
    'Samantha',
    'Sara',
    'Satu',
    'Serena',
    'Sin-ji',
    'Tessa',
    'Thomas',
    'Ting-Ting',
    'Trinoids',
    'Veena',
    'Vicki',
    'Victoria',
    'Whisper',
    'Xander',
    'Yelda',
    'Yuna',
    'Yuri',
    'Zarvox',
    'Zosia',
    'Zuzana'
  ];

  const sampleVoice = (index = 0) => {
    const voice = voices[index];
    if (!voice) {
      return;
    }
    game.consoleOutPut({ text: `DEBUG: sampleVoice() voice: ${voice}` }); //TODO: Kill this line
    const speakSampleSentence2 = (voice) => {
      const sampleSentence2 = 'blah blah blah';
      say.speak(sampleSentence2, voice, 1, () => sampleVoice(index + 1));
    };
    const speakSampleSentence1 = (voice) => {
      const sampleSentence = `This is a sample sentence for the game. La la la la! Ma ma ma ma! Ra ra Ba ba pa pa, fa fa fa fa fa

              These three skis through the trees to my knees but without all those tricky tricky stinky slinky bees. Who? Why? What! OK! whatever

              `;
      say.speak(sampleSentence, voice, 1, () => sampleVoice(index + 1));
    };
    const speakSampleSentenceForVoice = () => {
      speakSampleSentence1(voice);
    };
    const speakAnnouncement = () => {
      say.speak(`Sample voice for: ${voice}`, 'Samantha', 1, speakSampleSentenceForVoice);
    };
    speakAnnouncement();
  };
  const speakGreeting = () => {
    say.speak(`OK, now I'm going to list all of the possible voices for you: `, 'Samantha', 1, () => sampleVoice());
  };
  speakGreeting();
};

const api = {
  sampleVoicesWrapper,
  addSentenceToSpeechQueue,
};
module.exports = api;
