import {
  getMedlem,
  createMedlem,
  deleteMedlem,
  updateMedlem,
} from "./rest-service.js";

let medlem;
window.addEventListener("load", initApp);

async function initApp() {
  console.log("app.js is runningg 🎉");
  updateMedlemGrid();
  document
    .querySelector("#btn-create-medlem")
    .addEventListener("click", showCreateMedlemDialog);
  document
    .querySelector("#form-create-medlem")
    .addEventListener("submit", createMedlemClicked);

  document
    .querySelector("#form-update-medlem")
    .addEventListener("submit", updateMedlemClicked);
  document
    .querySelector("#form-delete-medlem")
    .addEventListener("submit", deleteMedlemClicked);
  document
    .querySelector("#form-delete-medlem .btn-cancel")
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

function showMedlemmer(listOfMedlem) {
  document.querySelector("#medlem").innerHTML = ""; // reset the content of section#posts

  for (const medlem of listOfMedlem) {
    showMedlem(medlem); // for every post object in listOfPosts, call showPost
  }
}

async function showMedlem(medlemObject) {
  const html = /*html */ `
  
  <article class="grid-item">
        <div class="avatar">
              <div>
                    <h3><b>Navn:</b> ${medlemObject.navn}</h3>
                    <p><b>medlemskabstype:</b> ${medlemObject.medlemskabstype} <br> <b>Alder:</b>  ${medlemObject.alder}</p>
              </div>
        </div>
        <div>
            <img src="${medlemObject.billede}" />
            <h3>${medlemObject.aktivitetsform}</h3>
            <p>${medlemObject.svømmedisciplin}</p>
        <div class="btns">
              <button class="btn-delete">Delete</button>
              <button class="btn-update">Update</button>
        </div>
    </article> 
  
  `;

  document.querySelector("#medlem").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  document
    .querySelector("#medlem article:last-child .btn-delete")
    .addEventListener("click", () => deleteClicked(medlemObject));
  document
    .querySelector("#medlem article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(medlemObject));
}

async function updateMedlemGrid() {
  medlem = await getMedlem(); // get posts from rest endpoint and save in variable
  showMedlemmer(medlem); // show all posts (append to the DOM) with posts as argument
}

async function createMedlemClicked(event) {
  console.log(event);
  event.preventDefault();

  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const navn = form.navn.value;
  const billede = form.billede.value;
  const alder = form.alder.value;
  const aktivitetsform = form.aktivitetsform.value;
  const medlemskabstype = form.medlemskabstype.value;
  const svømmedisciplin = form.svømmedisciplin.value;

  const response = await createMedlem(
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin
  ); // use values to create a new post
  // check if response is ok - if the response is successful
  if (response.ok) {
    console.log("New medlem succesfully added to Firebase 🔥");
    form.reset(); // reset the form (clears inputs)
    updateMedlemGrid();
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
    medlem.sort(compareAktivitetsform);
  } else if (selectedValue === "konkurrencesvømmer") {
    medlem.sort(compareKonkurrencesvømmer);
  }

  showMedlemmer(medlem);
}

function compareAktivitetsform(medlem1, medlem2) {
  return medlem1.aktivitetsform.localeCompare(medlem2.aktivitetsform);
}

function compareKonkurrencesvømmer(medlem1, medlem2) {
  return medlem1.konkurrencesvømmer.localeCompare(medlem2.konkurrencesvømmer);
}

//function search(searchValue) {
//searchValue = searchValue.toLowerCase();

//const results = age.filter(age);

//function checkAge(age) {
//const age = Age.age.toLowerCase();
//return age.includes(searchValue);
//}

//return results;
//}

function inputSearchChanged(event) {
  const value = event.target.value;
  const medlemToShow = searchMedlem(value);
  showMedlemmer(medlemToShow);
}

function searchMedlem(searchValue) {
  searchValue = searchValue.toLowerCase();
  const results = medlem.filter((medlem) =>
    medlem.navn.toLowerCase().includes(searchValue)
  );
  return results;
}

function showCreateMedlemDialog() {
  document.querySelector("#dialog-create-medlem").showModal(); // show create dialog
}

function showErrorMessage(message) {
  document.querySelector(".error-message").textContent = message;
  document.querySelector(".error-message").classList.remove("hide");
}

function hideErrorMessage() {
  document.querySelector(".error-message").textContent = "";
  document.querySelector(".error-message").classList.add("hide");
}

function updateClicked(medlem) {
  const updateForm = document.querySelector("#form-update-medlem"); // reference to update form in dialog
  updateForm.navn.value = medlem.navn; // set title input in update form from post title
  updateForm.billede.value = medlem.billede; // set body input in update form post body
  updateForm.alder.value = medlem.alder; // set image input in update form post image
  updateForm.aktivitetsform.value = medlem.aktivitetsform; // set title input in update form from post title
  updateForm.medlemskabstype.value = medlem.medlemskabstype; // set body input in update form post body
  updateForm.svømmedisciplin.value = medlem.svømmedisciplin; // set image input in update form post image
  updateForm.setAttribute("data-id", medlem.id); // set data-id attribute of post you want to update (... to use when update)
  document.querySelector("#dialog-update-medlem").showModal(); // show update modal
}

function deleteClicked(medlem) {
  document.querySelector("#dialog-delete-medlem-title").textContent =
    medlem.navn; // show title of post you want to delete
  document
    .querySelector("#form-delete-medlem")
    .setAttribute("data-id", medlem.id); // set data-id attribute of post you want to delete (... to use when delete)
  document.querySelector("#dialog-delete-medlem").showModal(); // show delete dialog
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-medlem").close(); // close dialog
}

async function deleteMedlemClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  const response = await deleteMedlem(id); // call deletePost with id

  if (response.ok) {
    console.log("New medlem succesfully deleted from Firebase 🔥");
    updateMedlemGrid();
  }
}

async function updateMedlemClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const navn = form.navn.value;
  const billede = form.billede.value;
  const alder = form.alder.value;
  const aktivitetsform = form.aktivitetsform.value;
  const medlemskabstype = form.medlemskabstype.value;
  const svømmedisciplin = form.svømmedisciplin.value;

  const id = form.getAttribute("data-id"); // get id of the post to update - saved in data-id
  const response = await updateMedlem(
    id,
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin
  ); // call updatePost with arguments

  if (response.ok) {
    console.log("medlem succesfully updated in Firebase 🔥");
    updateMedlemGrid();
  }
}
