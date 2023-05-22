import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from "./rest-service.js";

let posts;
window.addEventListener("load", initApp);

async function initApp() {
  console.log("app.js is runningg 🎉");
  updatePostsGrid();
  document
    .querySelector("#btn-create-post")
    .addEventListener("click", showCreatePostDialog);
  document
    .querySelector("#form-create-post")
    .addEventListener("submit", createPostClicked);

  document
    .querySelector("#form-update-post")
    .addEventListener("submit", updatePostClicked);
  document
    .querySelector("#form-delete-post")
    .addEventListener("submit", deletePostClicked);
  document
    .querySelector("#form-delete-post .btn-cancel")
    .addEventListener("click", deleteCancelClicked);
  document
    .querySelector("#select-sort-by")
    .addEventListener("change", sortByChanged);
  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
}

function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

  for (const post of listOfPosts) {
    showPost(post); // for every post object in listOfPosts, call showPost
  }
}

async function showPost(postObject) {
  const html = /*html */ `
  
  <article class="grid-item">
        <div class="avatar">
                <img src=${postObject.billede} />
              <div>
                    <h3>${postObject.navn}</h3>
                    <p>${postObject.medlemskabstype}</p>
              </div>
        </div>
        <div>
            <img src="${postObject.billede}" />
            <h3>${postObject.aktivitetsform}</h3>
            <p>${postObject.svømmedisciplin}</p>
        <div class="btns">
              <button class="btn-delete">Delete</button>
              <button class="btn-update">Update</button>
        </div>
    </article>
  
  `;

  document.querySelector("#posts").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  document
    .querySelector("#posts article:last-child .btn-delete")
    .addEventListener("click", () => deleteClicked(postObject));
  document
    .querySelector("#posts article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(postObject));
}

async function updatePostsGrid() {
  posts = await getPosts(); // get posts from rest endpoint and save in variable
  showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

async function createPostClicked(event) {
  event.preventDefault();

  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const navn = form.navn.value;
  const billede = form.billede.value;
  const alder = form.alder.value;
  const aktivitetsform = form.aktivitetsform.value;
  const medlemskabstype = form.medlemskabstype.value;
  const svømmedisciplin = form.svømmedisciplin.value;

  const response = await createPost(
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin
  ); // use values to create a new post
  // check if response is ok - if the response is successful
  if (response.ok) {
    console.log("New post succesfully added to Firebase 🔥");
    form.reset(); // reset the form (clears inputs)
    updatePostsGrid();
    event.target.parentNode.close(); // the dialog
    hideErrorMessage();
  } else {
    showErrorMessage("Something went wrong. Please, try again!");
  }
}

function sortByChanged(event) {
  console.log("yaaay");
  const selectedValue = event.target.value;

  if (selectedValue === "aktivitetsform") {
    posts.sort(compareAktivitetsform);
  }

  showPosts(posts);
}

function compareAktivitetsform(post1, post2) {
  return post1.aktivitetsform.localeCompare(post2.aktivitetsform);
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const postsToShow = searchPosts(value);
  showPosts(postsToShow);
}

function searchPosts(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = posts.filter((post) =>
    post.navn.toLowerCase().includes(searchValue)
  );
  return results;
}

function showCreatePostDialog() {
  document.querySelector("#dialog-create-post").showModal(); // show create dialog
}

function showErrorMessage(message) {
  document.querySelector(".error-message").textContent = message;
  document.querySelector(".error-message").classList.remove("hide");
}

function hideErrorMessage() {
  document.querySelector(".error-message").textContent = "";
  document.querySelector(".error-message").classList.add("hide");
}

function updateClicked(post) {
  const updateForm = document.querySelector("#form-update-post"); // reference to update form in dialog
  updateForm.navn.value = post.navn; // set title input in update form from post title
  updateForm.billede.value = post.billede; // set body input in update form post body
  updateForm.alder.value = post.alder; // set image input in update form post image
  updateForm.aktivitetsform.value = post.aktivitetsform; // set title input in update form from post title
  updateForm.medlemskabstype.value = post.medlemskabstype; // set body input in update form post body
  updateForm.svømmedisciplin.value = post.svømmedisciplin; // set image input in update form post image
  updateForm.setAttribute("data-id", post.id); // set data-id attribute of post you want to update (... to use when update)
  document.querySelector("#dialog-update-post").showModal(); // show update modal
}

function deleteClicked(post) {
  document.querySelector("#dialog-delete-post-title").textContent = post.navn; // show title of post you want to delete
  document.querySelector("#form-delete-post").setAttribute("data-id", post.id); // set data-id attribute of post you want to delete (... to use when delete)
  document.querySelector("#dialog-delete-post").showModal(); // show delete dialog
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-post").close(); // close dialog
}

async function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  const response = await deletePost(id); // call deletePost with id

  if (response.ok) {
    console.log("New post succesfully deleted from Firebase 🔥");
    updatePostsGrid();
  }
}

async function updatePostClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const navn = form.navn.value;
  const billede = form.billede.value;
  const alder = form.alder.value;
  const aktivitetsform = form.aktivitetsform.value;
  const medlemskabstype = form.medlemskabstype.value;
  const svømmedisciplin = form.svømmedisciplin.value;

  const id = form.getAttribute("data-id"); // get id of the post to update - saved in data-id
  const response = await updatePost(
    id,
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin
  ); // call updatePost with arguments

  if (response.ok) {
    console.log("Post succesfully updated in Firebase 🔥");
    updatePostsGrid();
  }
}
