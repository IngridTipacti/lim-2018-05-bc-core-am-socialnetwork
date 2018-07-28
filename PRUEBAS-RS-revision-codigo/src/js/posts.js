// first
$(document).ready(function () {
    firebase.auth().onAuthStateChanged((user) => {
        listPosts();
    });
});

const getDataBase = () => {
    return firebase.database();
}

//esta función determina si el post debe ser mostrado o no
const shouldDisplayPost = (currentUser, post) => {
    // si es un post propio mostrar siempre
    if (currentUser.uid === post.userId) {
        return true;
    } else {
        return !post.private;
    }
}

//esta función muestra el post en pantalla, lo agrega a la lista de posts
const showPost = (post) => {
    let currentUser = getLoggedUser();
    if (shouldDisplayPost(currentUser, post)) {
        let postWrapper = `<li data-id="${post.idPost}">`
            + `<div class="post">`
            + `<span>${post.content}</span><br/>`;
        //si son mis propios posts, se agrega las opciones de edición y eliminar
        if (post.userId === currentUser.uid) {
            postWrapper = postWrapper + `<span><a href="#" class="edit-post" onClick="editPost('${post.idPost}')" data-post="${post.idPost}">Editar</a>`
                + `<br/>`
                + `<a href="#" class="delete-post" onClick="removePost('${post.idPost}')" data-post="${post.idPost}">Eliminar</a></span>`
        }
        //sin son posts de otras personas 
        else {
            postWrapper = postWrapper + `<span>autor:${post.author}</span>`
        }

        postWrapper = postWrapper + `</div></li>`;
        //agregar post a la lista
        $('#user-posts-lst').append(postWrapper);
    }
}

const getAllPosts = (callback) => {
    getDataBase().ref('/posts/').once('value', callback);
}

const getPostByUserAndId = (userId, postId, callback) => {
    console.log(userId, postId);
    getDataBase().ref('/user-posts/' + userId + '/' + postId).once('value', callback);
}

const addNewPost = (post) => {
    let uid = post.userId;
    // Get a key for a new Post.
    var postKey = getDataBase().ref().child('posts').push().key;
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + postKey] = post;
    updates['/user-posts/' + uid + '/' + postKey] = post;

    post.idPost = postKey;
    getDataBase().ref().update(updates);

    return post;
}

const updatePost = (post) => {
    console.log(post);
    var updates = {};
    updates['/posts/' + post.idPost] = post;
    updates['/user-posts/' + post.userId + '/' + post.idPost] = post;
    getDataBase().ref().update(updates).then(() => {
        //
        alertify.success('Se ha actualizado el post');
        //load posts again
        listPosts(post.userId);
    });

}

const deletePost = (userId, idPost) => {
    getDataBase().ref().child('posts/' + idPost).remove();
    getDataBase().ref().child('/user-posts/' + userId + '/' + idPost).remove().then(() => {
        //
        alertify.success('Se ha elminado el post');
        //load posts again
        listPosts(userId);
    });
}


const editPost = (idPost) => {
    let currentUser = getLoggedUser();

    alertify.genericDialog || alertify.dialog('genericDialog', function () {
        return {
            main: function (content) {
                this.setContent(content);
            },
            setup: function () {
                return {
                    focus: {
                        element: function () {
                            return this.elements.body.querySelector(this.get('selector'));
                        },
                        select: true
                    },
                    options: {
                        basic: true,
                        maximizable: false,
                        resizable: false,
                        padding: false
                    }
                };
            },
            settings: {
                selector: undefined
            }
        };
    });

    let callbackEdit = (snapshot) => {
        let post = snapshot.val();
        let $editForm = $('#form-edit-post');
        $editForm.find('textarea[name="postContent"]').val(post.content);
        $editForm.find('input[name="idPost"]').val(post.idPost);
        $editForm.find('input[name="privatePost"]').prop('checked', post.private)
        alertify.genericDialog($editForm[0]).set('selector', 'textarea[name="postContent"]');
    }

    getPostByUserAndId(currentUser.uid, idPost, callbackEdit);
}

const removePost = (idPost) => {

    let question = document.createElement('span');
    question.innerHTML = '¿Seguro que desea eliminar el Post?';

    //show confirm diaglo
    alertify.confirm(question,
        //if YES
        () => {
            let currentUser = getLoggedUser();
            let userId = currentUser.uid;
            deletePost(userId, idPost);
        },
        //if NO
        () => {
            //Do nothing
        }
    )
        .set(
            { labels: { ok: 'Sí', cancel: 'No' }, padding: true, title: 'Red Social - Dorelly' }
        );
}

const getPostToEdit = () => {
    let $form = $('#form-edit-post');
    let content = $form.find('textarea[name="postContent"]').val();
    let idPost = $form.find('input[name="idPost"]').val();

    if (content.trim().length == 0) {
        throw new Error("El post debe tener contenido");
    }

    let isPrivate = $form.find('input[name="privatePost"]').prop('checked');
    let currentUser = getLoggedUser();

    let post = {};
    post.idPost = idPost;
    post.author = currentUser.email;
    post.userId = currentUser.uid;
    post.content = content;
    post.private = isPrivate;
    post.edited = true;

    return post;
}

const getPost = () => {
    let $form = $('#add-form-post');
    let content = $form.find('textarea[name="postContent"]').val();

    if (content.trim().length == 0) {
        throw new Error("El post debe tener contenido");
    }

    let isPrivate = $form.find('input[name="privatePost"]').prop('checked');
    let currentUser = getLoggedUser();

    let post = {};
    post.author = currentUser.email;
    post.userId = currentUser.uid;
    post.content = content;
    post.private = isPrivate;
    post.edited = false;

    return post;
}

const listPosts = () => {
    $('#user-posts-lst').html('<p>Cargando posts...</p>');
    let callback = (snapshot) => {
        $('#user-posts-lst').html('');
        snapshot.forEach(function (child) {
            showPost(child.val());
        })
    };
    getAllPosts(callback);
}

$('#add-form-post').submit((e) => {
    e.preventDefault();
    try {
        let post = getPost();
        post = addNewPost(post);
        showPost(post);
    } catch (error) {
        alert(error.message);
    }

});

$('#form-edit-post').submit((e) => {
    e.preventDefault();
    try {
        let post = getPostToEdit();
        updatePost(post);
        alertify.closeAll();
    } catch (error) {
        alert(error.message);
    }
});

$('#logout-lnk').click((e) => {
    logout();
});