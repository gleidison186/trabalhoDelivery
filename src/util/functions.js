const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  console.log(process.env.JWT_SECRET);
  process.env.JWT_SECRET = Math.random().toString(36).slice(-20);
  console.log(process.env.JWT_SECRET);
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
  console.log(token);
  return token;
}

exports.passwordValidation = (password) => {
  if (password.length < 8) {
    return "Senha deve ter no mínimo 8 caracteres";
  } else if (!password.match(/[a-zA-Z]/g)) {
    return "Senha deve ter no mínimo uma letra";
  } else if (!password.match(/[0-9]+/)) {
    return "Senha deve ter no mínimo um número";
  } else if (!password.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)) {
    return "Senha deve ter no mínimo um caractere especial";
  } else {
    return "OK";
  }
}