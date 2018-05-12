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

const api = {
  addSentenceToSpeechQueue,
};
module.exports = api;
