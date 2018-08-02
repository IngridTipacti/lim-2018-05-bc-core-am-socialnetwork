window.validateLogin = (accessMail) => {
  const expression = /\w+@\w+\.+[a-z]/;
  return expression.test(accessMail);

}

window.passwordLength = (accessPassword) => {
    const expressionPassword =/^(?=.*[A-Z])([a-zA-Z0-9_-]){8,}$/;
    return expressionPassword.test(accessPassword);

}

