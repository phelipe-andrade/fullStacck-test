function currentTime() {
  const date = new Date();
  const fullTime = {
    date: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
  };
  return fullTime;
}

module.exports = currentTime;
