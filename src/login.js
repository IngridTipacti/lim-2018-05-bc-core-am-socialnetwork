//Declración de Variables:
const inputMailRecord = document.getElementById('emailR');
const inputPasswordRecord = document.getElementById('passwordrR');
 const resgisterLink = document.getElementById('registerLink');
const btnSignUp = document.getElementById('btn-signup');
const inputMailAccess = document.getElementById('email');
const inputPasswordAccess = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const containerText = document.getElementById('container-text');
const signUp = document.getElementById('signUp');
const signIn = document.getElementById('signIn');
const wall = document.getElementById('wall');
const btnSignOff = document.getElementById('sign-off');
const status = document.getElementById('status');
const btnLoginGoogle = document.getElementById('btn-login-google');
const btnLoginFacebook = document.getElementById('btn-login-facebook');
let userHtml = document.getElementById('user_name');
const returnToLogin = document.getElementById('return');
const btnPost = document.getElementById('btn-post');

//Validar estado de usuario - Observador
window.onload = () => {

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        showResult(user);
    } else {
      containerText.innerHTML='';
      containerText.innerHTML=`<p>Valide su cuenta ${user.email} para logearse`;
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
    document.getElementById('container-signup').innerHTML='';
    document.getElementById('container-signup').innerHTML = `<p>Se ha enviado un correo de validación</p>`;
    console.log(user);
    // Email sent.
  }).catch((error) => {
    document.getElementById('container-signup').innerHTML='';
    document.getElementById('container-signup').innerHTML = `<p>Ha ocurrido un error</p>`;
  
  });
}


btnSignUp.addEventListener('click', registrar => {
  //Obtener email y pass
  let registrationMail = inputMailRecord.value;
  let registrationPassword = inputPasswordRecord.value;
  firebase.auth().createUserWithEmailAndPassword(registrationMail, registrationPassword)
    .then(() => {
      checkEmail();
    })
    .catch((error) => {
      // Handle Errors here.
      document.getElementById('container-sigup').innerHTML= `<p>${error.code}:${error.message} </p>` 
      containerText.innerHTML = 'Verfique los datos de registro: ' + error.code + ':' + error.message;
    });
    clearContent([inputMailRecord, inputPasswordRecord]);
});

btnLogin.addEventListener('click', login = () => {
    //Obtener email y pass registrados
    let accessMail = inputMailAccess.value;
    let accessPassword = inputPasswordAccess.value;
  
    firebase.auth().signInWithEmailAndPassword(accessMail, accessPassword)
      .then(() => {
        wall.style.display = 'block';
        signUp.style.display = 'none';
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
btnSignOff.addEventListener('click', signOff => {
  firebase.auth().signOut()
    .then(() => {
      wall.style.display = 'none';
      sign.style.display = 'block';
      //console.log('Cerrando sesión de red social');
    })
    .catch((error) => {
      //console.log('error al cerrar sesión');
    })
});



const  writeUserData = (userId, name, email, imageUrl) =>{
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}
const writeNewPost = (uid, body)=> {
    // A post entry.
    var postData = {
        uid: uid,
        body: body,
    };
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    firebase.database().ref().update(updates);
    return newPostKey;
}

btnPost.addEventListener('click', () => {
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
      console.log('El usuario esta eliminando  successfully!');
      // reload_page();
    });
  
    btnUpdate.addEventListener('click', () => {
      const newUpdate = document.getElementById(newPost);
      const nuevoPost = {
        body: newUpdate.value,
      };
      var updatesUser = {};
      var updatesPost = {};
      updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
      updatesPost['/posts/' + newPost] = nuevoPost;
      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
    });
  });
returnToLogin.addEventListener('click', () =>{
  signIn.style.display = 'block';
  signUp.style.display = 'none';
})
const showResult = (user) => {
  if (user.emailVerified) {
    `wall.style.display="block"`
    wall.style.display = 'block';
        sign.style.display = 'none';
    status.innerHTML = `
        <p>Se validó que su correo si existe, Bienvenid@, usuario se encuentra activo</p>
        `
  }else{
      console.log('No logearse');
  }

}


  resgisterLink.addEventListener('click', newAccount=() => {
    signIn.style.display = 'none';
    signUp.style.display = 'block';
    // inputMailRecord.style.display='block';
    // inputPasswordRecord.style.display='block';
  });

//Autentificación con Google
btnLoginGoogle.addEventListener('click', handleAuth => {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log(result);
      userHtml.innerHTML = `Bienvenida ${result.user.displayName}`;
      wall.style.display = 'block';
      sign.style.display = 'none';
    }).catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
      //console.log(`Error ${error.message}`);
      //console.log("no ha iniciado sesión")
    });
})

//Autentificación con Facebook
btnLoginFacebook.addEventListener('click', () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      userHtml.innerHTML = `${result.user.displayName}`;
      wall.style.display = 'block';
      sign.style.display = 'none';
    })
    .catch((error) => {
      //console.log(error.code + error.message)
    });
  
});