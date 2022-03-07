const validator = (email) => {
  const emailREgExp = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  return emailREgExp.test(email);
};


module.exports = validator;