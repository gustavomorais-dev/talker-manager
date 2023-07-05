function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidDate(date) {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
}

function isValidName(name) {
  return name.length >= 3;
}

function isValidAge(age) {
  return typeof age === 'number' && Number.isInteger(age) && age >= 18;
}

function isValidTalk(talk) {
  return typeof talk === 'object';
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidDate,
  isValidName,
  isValidAge,
  isValidTalk,
}
