const chalk = require('chalk');
const boxen = require('boxen');
const CFonts = require('cfonts');
const chalkAnimation = require('chalk-animation');

const basicCFontOptions = {
  font: 'simple3d'
};

const basicBoxOptions = {
  padding: 1,
  borderStyle: {
    topLeft: '@',
    topRight: '@',
    bottomLeft: '@',
    bottomRight: '@',
    horizontal: '\\',
    vertical: '/'
  }
};

const flashScreenRed = (text) => { // TODO: Finish implementing this
  // TODO: Fix the fact that it's replacing the prompt
  // const pulseDelayInMilliseconds = 200;
  const animationDurationInMilliseconds = 800; // TODO: Figure out how to make the prompt come back right after this is done, instead of waiting
  const pulse = chalkAnimation.pulse(text);
  const stopAnimation = () => console.log('');
  setTimeout(stopAnimation, animationDurationInMilliseconds);
  // const stopPulsing = () => { pulse.stop(); };
  // const startPulsing = () => { pulse.start(); };
  //
  // const performFlashing = (countOfFlashes) => {
  //     const flash = (isStarted, currentFlashCount = 1) => setTimeout(() => {
  //         if (currentFlashCount > countOfFlashes) { return; }
  //         if (!isStarted) {
  //             pulse.start();
  //             flash(true, currentFlashCount);
  //             return;
  //         }
  //         pulse.stop();
  //         flash(false, currentFlashCount + 1);
  //     }, pulseDelayInMilliseconds);
  //     flash(false);
  // };
  // performFlashing(1);
};

const getTextColorBasedOnCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const result = {
    color: 'green',
    bgColor: 'bgBlack',
    greeting: '',
  };
  switch (true) { //TODO: Add more holidays and think of color combos to go with them
    case ((currentMonth === 3) && (currentDay === 27)):
      result.color = 'yellow';
      result.greeting = 'Fijne koningsdag!';
      break;
    case (currentHour < 12):
      result.greeting = 'Good morning';
      break;
    case((currentHour >= 12) && (currentHour < 18)):
      result.color = 'cyan';
      result.greeting = 'Good Afternoon';
      break;
    case((currentHour >= 18) && (currentHour <= 24)):
      result.color = 'white';
      result.greeting = 'Good evening';
      break;
  }
  return result;
};

const consoleOutPut = ({text, color, chalkSetting = 'reset', boxenSettings, bgColor}) => {
  const colorToUse = color || getTextColorBasedOnCurrentTime().color;
  const bgColorToUse = bgColor || getTextColorBasedOnCurrentTime().bgColor;
  if (boxenSettings) {
     console.log(boxen(chalk[chalkSetting][colorToUse][bgColorToUse](text), boxenSettings)); ; //TODO: Fix the backgroundColor
     return;
  }
  console.log(chalk[chalkSetting][colorToUse][bgColorToUse](text));
};

const clearScreenWrapper = (game) => () => {
  game.consoleOutPut({ text: '\x1Bc' });
};

const api = {
  flashScreenRed,
  clearScreenWrapper,
  basicBoxOptions,
  basicCFontOptions,
  consoleOutPut,
  getTextColorBasedOnCurrentTime,
};
module.exports = api;
