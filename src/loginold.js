//Declración de Variables:
const inputMailRecord = document.getElementById('emailR');
const inputPasswordRecord = document.getElementById('passwordR');
const inputMailAccess = document.getElementById('mail-access');
const inputPasswordAccess = document.getElementById('password-access');
const containerText = document.getElementById('container-text');
const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const wall = document.getElementById('wall');
const status = document.getElementById('status');
let userHtml = document.getElementById('user_name');


const showResult = (user) => {
  if (user.emailVerified) {
    `wall.style.display="block"`
    wall.style.display = 'block';
        sign.style.display = 'none';
    containerText.innerHTML = `
        <p>Se validó que su correo si existe, Bienvenid@, usuario se encuentra activo</p>
        `
  }else{
      console.log('No logearse');
  }
}

//Validar estado de usuario - Observador
window.onload = () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      showResult(user);
    } else {
      containerText.innerHTML = '';
      containerText.innerHTML = `<p>Valide su cuenta ${user.email} para logearse`;
    }
  });
}
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

//Enviar un mensaje de verificación al usuario
const checkEmail = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => {
    document.getElementById('container-sigup').innerHTML = '';
    document.getElementById('container-sigup').innerHTML = `<p>Se ha enviado un correo de validación</p>`;
    console.log(user);
    // Email sent.
  }).catch((error) => {
    document.getElementById('container-sigup').innerHTML = '';
    document.getElementById('container-sigup').innerHTML = `<p>Ha ocurrido un error</p>`;

  });
}

//Registrar nuevo usuario con correo y contraseña
$('#registerLink').click(() => {
  signIn.style.display = 'none';
  signUp.style.display = 'block';
});

$('#btn-signup').click(registrar = () => {
  //Obtener email y pass
  let registrationMail = inputMailRecord.value;
  let registrationPassword = inputPasswordRecord.value;
  firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
    .then(() => {
      checkEmail();
    })
    .catch((error) => {
      // Handle Errors here.
      document.getElementById('container-sigup').innerHTML = `<p>${error.code}:${error.message} </p>`
    });
  clearContent([inputMailRecord, inputPasswordRecord]);
});

$('#btn-login').click(login = () => {
    //Obtener email y pass registrados
    let accessMail = inputMailAccess.value;
    let accessPassword = inputPasswordAccess.value;
  
    firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
      .then(() => {
        //wall.style.display = 'block';
        //sign.style.display = 'none';
        var user = firebase.auth.currentUser;
        userHtml.innerHTML = user.email;
      })
  
      .catch(function (error) {
        // Handle Errors here.
        // ...
        containerText.innerHTML = `<p>No se encuentra registrado ${error.code}:${error.message}</p>`
      });
  
    clearContent([inputMailAccess, inputPasswordAccess]);
  });

//Cerrar sesión
  $('#sign-off').click(()=> {
  firebase.auth().signOut()
    .then(() => {
      wall.style.display = 'none';
      sign.style.display = 'block';
    })
    .catch((error) => {
    })
});

$('#return').click(() =>{
  signIn.style.display = 'block';
  signUp.style.display = 'none';
})

//Escribir en la base de datos
const writeUserData = (userId, name, email, imageUrl) => {
  firebase.database().ref('users/' + userId)
  .set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}
const writeNewPost = (uid, message) => {
  // A post entry.
  let postData = {
    uid: uid,
    message: message,
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

$('#btn-post').click(()=> {
    var userId = firebase.auth().currentUser.uid;
    const newPost = writeNewPost(userId, post.value);
    posts.innerHTML += `
      <div>
          <textarea id="${newPost}">${post.value}</textarea>
          <button id ="update" type="button">Update</button>
          <button id="delete" type="button">Delete</button>
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
  $('#btn-login-google').click(()=> {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      userHtml.innerHTML = `${result.user.displayName}`;
      $('#photo').text('');
      $('#photo').append("<img src='"+result.user.photoURL+"' />");
      wall.style.display = 'block';
      sign.style.display = 'none';
    })
    .catch((error) => {
      console.log('yyyyyyyyyyyyyyy');
      // Handle Errors here.
/*       const errorCode = error.code;
      const errorMessage = error.message; */
      // The email of the user's account used.
      // const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
    });
});

//Autentificación con Facebook
  $('#btn-login-facebook').click(()=> {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      userHtml.innerHTML = `${result.user.displayName}`;
      $('#photo').text('');
      $('#photo').append("<img src='"+result.user.photoURL+"' />");
      wall.style.display = 'block';
      sign.style.display = 'none';
    })
    .catch((error) => {
      console.log('yyyyyyyyyyyyyyy');
      //console.log(error.code + error.message)
    });

})
