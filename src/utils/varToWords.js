/**
 * Converts Variable name to regular words
 * @param {String} key - variable name
 */
const toWords = key => {
  let capWords = key;
  capWords = key.charAt(0).toUpperCase() + key.substring(1);
  const words = capWords.replace(/([A-Z]+)/g, " $1");
  return words;
};
export default toWords;
