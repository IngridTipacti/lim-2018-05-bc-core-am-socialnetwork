
document.getElementById("wallHome").addEventListener('click', () => {


  posts.innerHTML = `


  <div class="card w-100" id="add-post-wrapper">
  <div id="container-post" class="card-body">

    <form id="add-form-post">

      <label for="postTextArea">Publicación</label>
        <textarea class="form-control" name="postContent" id="postTextArea" rows="5" placeholder="¿Qué deseas publicar?"></textarea>
        <input type="checkbox" name="privatePost" value="private" />Privado
        <button class="btn btn-primary" id="btn-add-post">Publicar</button>


    </form>

  </div>
</div>`
})
