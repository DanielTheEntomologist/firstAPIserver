const randomId = (idLength) => {
  let id = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charsAmount = characters.length;
  for (let i = 0; i < idLength; i++) {
    id += characters.charAt(Math.floor(Math.random() * charsAmount));
  }
  return id;
};

export default randomId;
// module.exports = randomId;
