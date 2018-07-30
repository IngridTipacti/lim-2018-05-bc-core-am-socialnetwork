<<<<<<< HEAD
=======
const string = document.getElementById('navOne');

>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
//Evento para seguridad de contraseña de registro
$("#passwordR").on('keyup', () => {
    let mayus = new RegExp('^(?=.*[A-Z])');
    let special = new RegExp('^(?=.*[!%@#$&*])');
    let number = new RegExp('^(?=.*[0-9])');
    let lower = new RegExp('^(?=.*[a-z])');
    let len = new RegExp('^(?=.{8,})');
    //Arreglos
    let regExp = [mayus, special, number, lower, len];
    let elements = [$('#mayus'), $('#special'), $('#number'), $('#lower'), $('#len')];
  
    let registrationPassword = $('#passwordR').val();
    for (let i = 0; i < 5; i++) {
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
    console.log(registrationPassword);
    console.log(confirmPassword);
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
  
              alert("Se ha enviado un correo de validación")
  
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
const validateLogin = () => {
    expresionLogin = /\w+@\w+\.+[a-z]/;
    let accessMail = getID('mail-access').value;
    let accessPassword = getID('password-access').value;
    if (accessMail === '' || accessPassword === '') {
      alert('Todos los campos son obligatorios');
      return false;
    }
    //Usando expresiones regulares: evaluar cadena de caracteres
    //Evaluando que cumpla con la expresion regular
    else if (!expresionLogin.test(accessMail)) {
      alert('El formato del correo no es válido');
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
<<<<<<< HEAD
      window.location = '/';
=======
      window.location = 'index.html';
>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
    }
  }
  
  const authWithEmailAndPassword = (email, password) => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .then(function (response) {
        processAuthResult(response, true);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#container-text').html('error message: ' + errorMessage);
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
  
  //login with google
  const authWithOAuth = (socialNetwork) => {
    let authProvider = getAuthProvider(socialNetwork);
    authProvider.setCustomParameters({
      'display': 'popup'
    });
<<<<<<< HEAD
=======
 
>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase.auth().signInWithPopup(authProvider);
      })
<<<<<<< HEAD
=======
 
>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
      .then((response) => {
        processAuthResult(response);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#container-text').html('error message: ' + errorMessage);
      });
<<<<<<< HEAD
=======


>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
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
          checkEmail();
  
  
        })
        .catch(function (error) {
          // Handle Errors here.
          getID('container-text').innerHTML = `<p>No se encuentra registrado ${error.code}:${error.message}</p>`
        });
    } else {
      alert('error')
  
    }
    clearContent([getID('mail-access'), getID('password-access')]);
  
  
  });
  