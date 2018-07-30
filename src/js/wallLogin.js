document.getElementById("wallHome").addEventListener('click', () => {


  posts.innerHTML = `

<<<<<<< HEAD
=======
  <div class="card w-100" id="add-post-wrapper">
  <div id="container-post" class="card-body">

    <form id="add-form-post">

      <label for="postTextArea">Publicación</label>
        <textarea class="form-control" name="postContent" id="postTextArea" rows="5" placeholder="¿Qué deseas publicar?"></textarea>
        <input type="checkbox" name="privatePost" value="private" />Privado
        <button class="btn btn-primary" id="btn-add-post">Publicar</button>


    </form>

  </div>
</div>
>>>>>>> a7b1c5e5cd3fec0670b6977c48f90edadef1ebeb
 `;
  posts.innerHTML += `
 <div style="display: none">
 <form id="form-edit-post" class="card w-50">
   <fieldset>
     <input type="hidden" name="idPost" />
     <textarea name="postContent" required></textarea>
     <input type="checkbox" name="privatePost" value="private" />Privado
     <br/>
     <button type="submit" id="btn-edit-post">Editar</button>
   </fieldset>
 </form>
</div>

<div id="my-posts-wrappers">

 <br>
 <ul id="user-posts-lst">
 </ul>
</div>`

})
