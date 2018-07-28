//Declaración de Variables:
const status = document.getElementById('status');

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAB7icNPz-tO88wVkgcCeNmlz9H1xd8OTU",
  authDomain: "login-e3b98.firebaseapp.com",
  databaseURL: "https://login-e3b98.firebaseio.com",
  projectId: "login-e3b98",
  storageBucket: "login-e3b98.appspot.com",
  messagingSenderId: "857338189328"
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();

const clearContent = (elements) => {
  elements.forEach(element => {
    clearElement(element);
  });
}

const clearElement = (element) => {
  if (element.value) {
    element.value = '';
  }
  element.innerHTML = '';
}

const getID = (id) => {
  return document.getElementById(id);
}


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

const showResult = (user) => {
  if (user.emailVerified) {
    alert("Se validó que su correo si existe, Bienvenid@, usuario se encuentra activo")

  } else {
    console.log('No logearse');
  }
}

//Validar estado de usuario - Observador
window.onload = () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      showResult(user);
    } else {

      console.log(user);
    }
  });
}


//Enviar un mensaje de verificación al usuario
const checkEmail = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification()
    .then(() => {

      alert("Se ha enviado un correo de validación")


    }).catch((error) => {

      alert("Ha ocurrido un error")

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


//Cerrar sesión
$('#sign-off').click(() => {

  firebase.auth().signOut()
    .then(() => {
      console.log("sesión cerrada");
      getID('user_name').innerHTML = '';
      getID('photo').innerHTML = '';

    })
    .catch((error) => { })
});


//Escribir en la base de datos
const writeUserData = (userId, name, email, imageUrl) => {
  firebase.database().ref('users/' + userId)
    .set({
      username: name,
      email: email,
      profile_picture: imageUrl
    });
}

const formPost = getID('form-post');

//window.onload = () => {
const inicializar = () => {
  $('#form-post').submit(getFirebase = (e) => {
    e.preventDefault();
    //$('#form-post').submit(getFirebase, false);
    //firebase.database().ref();
  });
}
//}



const writeNewPost = (uid, message) => {
  // A post entry.
  let postData = {
    uid: uid,
    message: message

  };
  // Get a key for a new Post.
  let newPostKey = firebase.database().ref().child('posts').push().key;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  firebase.database().ref().update(updates);
  return newPostKey;
}

/* function toggleStar(postRef, uid) {
  postRef.transaction(function(post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    console.log(post);
    return post;
  });
} */

$('#btn-post').click(() => {
  var userId = firebase.auth().currentUser.uid;
  const newPost = writeNewPost(userId, post.value);
  posts.innerHTML += `
 <div>
 <textarea id="${newPost}">${post.value}</textarea>
 <div id="${posts}"><button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
 •
</button>            <div class="dropdown-menu dropdown-menu-right">
<button class="dropdown-item" type="button">Editar</button>
<button class="dropdown-item" type="button">Eliminar</button>
</div>
</div>
 </div>`

  const btnUpdate = document.getElementById('update');
  const btnDelete = document.getElementById('delete');
  btnDelete.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();
    while (posts.firstChild) posts.removeChild(posts.firstChild);
    // reload_page();
  });

  btnUpdate.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
      message: newUpdate.value,
    };
    var updatesUser = {};
    var updatesPost = {};
    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost] = nuevoPost;
    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);
  });
});


//Autentificación con Google
$('#btn-login-google').click(() => {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      getID('user_name').innerHTML = `${result.user.displayName}`;
      $('#photo').text('');
      $('#photo').append("<img src='" + result.user.photoURL + "' />");
      /*       getID('wall').style.display = 'block';
            sign.style.display = 'none'; */
    })
    .catch((error) => {
      console.log('yyyyyyyyyyyyyyy');
      // Handle Errors here.
      /* const errorCode = error.code;
       const errorMessage = error.message; */
      // The email of the user's account used.
      // const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
    });
});

//Autentificación con Facebook
$('#btn-login-facebook').click(() => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      getID('user_name').innerHTML = `${result.user.displayName}`;
      $('#photo').text('');
      $('#photo').append("<img src='" + result.user.photoURL + "' />");
      getID('wall').style.display = 'block';
      // $('#modalLogin').modal('hide')

    })
    .catch((error) => {
      console.log('yyyyyyyyyyyyyyy');
      //console.log(error.code + error.message)
    });

})