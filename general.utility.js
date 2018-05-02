
const getRandomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const api = {
  getRandomArrayItem,
};
module.exports = api;
