function filterTalkerByName(array, query) {
  return array.filter((talker) => talker.name.toLowerCase().includes(query.toLowerCase()));
}

function filterTalkerByRate(array, rate) {
  const numericRate = Number(rate);

  return array.filter((talker) => talker.talk.rate === numericRate);
}

module.exports = {
  filterTalkerByName,
  filterTalkerByRate,
};