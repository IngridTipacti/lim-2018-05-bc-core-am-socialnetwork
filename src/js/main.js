//Evento para seguridad de contraseña de registro
$("#passwordR").on('keyup', () => {
  let mayus = new RegExp('^(?=.*[A-Z])');
  let len = new RegExp('^(?=.{8,})');
  //Arreglos
  let regExp = [mayus, len];
  let elements = [$('#mayus'), $('#len')];

  let registrationPassword = $('#passwordR').val();
  for (let i = 0; i < 2; i++) {
    if (regExp[i].test(registrationPassword)) {

      elements[i].attr("class", "icon-checkmark");

    } else {
      elements[i].attr("class", "icon-cross");
    }
  }

})



//Validar formulario de registro
const validateSignUp = () => {
  expresion = /\w+@\w+\.+[a-z]/;
  let registrationMail = $('#emailR').val();
  let registrationPassword = $('#passwordR').val();
  let confirmPassword = $('#confirm-password').val();
  if (!expresion.test(registrationMail)) {
    alert('El formato de correo es invalido');
    return false;
  } else if (registrationMail === '' || registrationPassword === '') {
    alert('Todos los campos deben llenarse')
    return false;
  } else if (registrationPassword != confirmPassword) {

    alert('Las contraseñas no coinciden');
    return false;
  }
  return true;
};

//Enviar un mensaje de verificación al usuario
const checkEmail = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification()
    .then(() => {

      alert("Se ha enviado un correo de validación");


    }).catch((error) => {

      alert("Ha ocurrido un error");

    });
}

$('#form-signup').submit(registrar = (e) => {
  e.preventDefault();
  //Obtener email y pass
  let registrationMail = getID('emailR').value;
  let registrationPassword = getID('passwordR').value;

  if (validateSignUp()) {
    firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification()
          .then(() => {
            checkEmail();

            // Email sent.
          }).catch((error) => {

            alert("Ha ocurrido un error")

          });
      })
  } else {
    alert('error');
  }

  clearContent([getID('emailR'), getID('passwordR'), getID('confirm-password')]);
});





//Validar formulario de login
window.validateLogin = () => {
  expresionLogin = /\w+@\w+\.+[a-z]/;
  expresionPassword = /^(?=.*[A-Z])([a-zA-Z0-9_-]){8,}$/;
  let accessMail = getID('mail-access').value;
  let accessPassword = getID('password-access').value;
  //Arreglos
  let regExp = [mayus, len];
  let elements = [$('#mayus'), $('#len')];
  if (accessMail === '' || accessPassword === '') {
    alert('Todos los campos son obligatorios');
    return false;
  }
  //Usando expresiones regulares: evaluar cadena de caracteres
  //Evaluando que cumpla con la expresion regular
  else if (!expresionLogin.test(accessMail)) {
    alert('El formato del correo no es válido');
    return false;
  } else if (!expresionPassword.test(accessPassword)) {
    alert('El formato de la contraseña no es válida');
    return false;
  }
  return true;
}


const processAuthResult = (authResult, needsEmailVerified = false) => {
  if (needsEmailVerified && !authResult.user.emailVerified) {
    logout(false);
    alert('Aún no ha activado su cuenta. Por favor ingrese a su correo para verificarla');
  } else {
    //redirect to home
    window.location = 'index.html';
  }
}

const authWithEmailAndPassword = (email, password) => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .then((response) => {
      processAuthResult(response, true);
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert('error');
    });
}

const getAuthProvider = (socialNetwork) => {
  switch (socialNetwork) {
    case 'google':
      return new firebase.auth.GoogleAuthProvider();
    case 'facebook':
      return new firebase.auth.FacebookAuthProvider();
    default:
      throw new Error("No valid auth provider");
  }
}

//login with google and fb
const authWithOAuth = (socialNetwork) => {
  let authProvider = getAuthProvider(socialNetwork);
  authProvider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => {
      return firebase.auth().signInWithPopup(authProvider);
    })
    .then((response) => {
      processAuthResult(response);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert('No pudo loguearse');
    });
}

//Autentificación con Google
$('#btn-login-google').click(() => {
  authWithOAuth('google');
});

//Autentificación con Facebook
$('#btn-login-facebook').click(() => {
  authWithOAuth('facebook');
});

$('#form-login').submit(login = (e) => {
  e.preventDefault();
  //Obtener email y pass registrados
  let accessMail = getID('mail-access').value;
  let accessPassword = getID('password-access').value;
  if (validateLogin()) {
    console.log('hola');
    firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
      .then(() => {
        authWithEmailAndPassword(accessMail, accessPassword);
      })
      .catch(function (error) {
        // Handle Errors here.
        alert('No se encuentra registrado');
      });
  } else {

  }
  clearContent([getID('mail-access'), getID('password-access')]);


});
