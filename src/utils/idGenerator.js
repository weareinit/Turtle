// will create a uniqueID of a specified length
const createId = N => {
  return `${Math.random().toString(36)}00000000000000000`.slice(2, N + 2);
}
const createAvatar = () => {
   return Math.abs(Math.floor(((Math.random() * (1 - 7) + 1))));
};

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export default {createId, createAvatar, makeid};
