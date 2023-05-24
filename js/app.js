import {
  getMedlem,
  createMedlem,
  deleteMedlem,
  updateMedlem,
  getResults,
} from "./rest-service.js";

let medlem;

window.addEventListener("load", initApp);

async function initApp() {
  console.log("app.js is runningg 🎉");
  updateMedlemGrid();
  updateMembersTable();

  document
    .querySelector("#restance-filter")
    ?.addEventListener("change", cashierFilterByRestance);

  document
    .querySelector("#input-search-cashier")
    ?.addEventListener("keyup", inputSearchChangedForCashier);
  document
    .querySelector("#input-search-button-for-cashier")
    ?.addEventListener("search", inputSearchChangedForCashier);

  document
    .querySelector("#btn-create-medlem")
    ?.addEventListener("click", showCreateMedlemDialog);
  document
    .querySelector("#form-create-medlem")
    ?.addEventListener("submit", createMedlemClicked);

  document
    .querySelector("#form-update-medlem")
    ?.addEventListener("submit", updateMedlemClicked);
  document
    .querySelector("#form-delete-medlem")
    ?.addEventListener("submit", deleteMedlemClicked);
  document
    .querySelector("#form-delete-medlem .btn-cancel")
    ?.addEventListener("click", deleteCancelClicked);
  document
    .querySelector("#select-sort-by")
    ?.addEventListener("change", sortByChanged);
  document
    .querySelector("#input-search")
    ?.addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    ?.addEventListener("search", inputSearchChanged);
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
  showMedlemmer(medlem);

  // show all posts (append to the DOM) with posts as argument
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
  } else if (selectedValue === "svømmedisciplin") {
    medlem.sort(compareSvømmedisciplin);
  }

  showMedlemmer(medlem);
}

function compareAktivitetsform(medlem1, medlem2) {
  return medlem1.aktivitetsform.localeCompare(medlem2.aktivitetsform);
}

function compareSvømmedisciplin(medlem1, medlem2) {
  return medlem1.svømmedisciplin.localeCompare(medlem2.svømmedisciplin);
}

//function searchMedlemsskabstype(searchValue) {
//searchValue = searchValue.toLowerCase();

//const results = medlemsskabstype.filter(checkMedlemsskabstype);

//function checkMedlemsskabstype(medlemsskabstype) {
//const medlemsskabstype = medlemsskabstype.medlemsskabstype.toLowerCase();
//return medlemsskabstype.includes(searchValue);
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
  updateForm.aktivitetsforms.value = medlem.aktivitetsform; // set title input in update form from post title
  updateForm.medlemskabstypes.value = medlem.medlemskabstype; // set body input in update form post body
  updateForm.svømmedisciplins.value = medlem.svømmedisciplin; // set image input in update form post image
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

let memberInRestance;
// ========== Cashier functions ========== //

function showMembersForCashier(membersList) {
  //#cashier-members-tbody sættes til en variable kaldt "table"
  const table = document.querySelector("#cashier-members-tbody");
  table.innerHTML = "";

  insertAccountingResults();

  //alle rows i tabel nulstilles til tom string
  document.querySelector("#cashier-members-tbody").textContent = "";

  //en row skabes i table for hvert medlem i members array
  for (const medlem of membersList) {
    showMemberForCashier(medlem);
  }
}

//function for creating row member element
function showMemberForCashier(medlemObject) {
  const restance = correctRestance(medlemObject);

  const htmlCashier = /*html*/ `
                    <tr>
                      <td>${medlemObject.navn}</td>
                      <td>${medlemObject.alder}</td>
                      <td>${medlemObject.medlemsskabsstart}</td>
                      <td>${medlemObject.medlemsskabsslut}</td>
                      <td>${restance}</td>
                    </tr>
  `;

  document
    .querySelector("#cashier-members-tbody")
    .insertAdjacentHTML("beforeend", htmlCashier);

  // adding evenlistener for showing dialog view on table row subject
  document
    .querySelector("#cashier-members-tbody tr:last-child")
    .addEventListener("click", cashierMemberClicked);

  //function for creating dialog view(cashier)
  function cashierMemberClicked(event) {
    event.preventDefault;

    // adding evenlistener for close btn in dialog view
    document
      .querySelector("#cashier-dialog-btn-close")
      .addEventListener("click", closeCashierDialog);

    // setting textcontent value equal to clicked member
    document.querySelector(
      "#cashier-dialog-navn"
    ).textContent = `Navn: ${medlemObject.navn}`;
    document.querySelector(
      "#cashier-dialog-alder"
    ).textContent = `Alder: ${medlemObject.alder}`;
    document.querySelector(
      "#cashier-dialog-medlemskabsstart"
    ).textContent = `Tilmeldt: ${medlemObject.medlemsskabsstart}`;
    document.querySelector(
      "#cashier-dialog-medlemskabsslut"
    ).textContent = `Medlemskab ophører: ${medlemObject.medlemsskabsslut}`;
    document.querySelector(
      "#cashier-dialog-restance"
    ).textContent = `Restance: ${medlemObject.restance}`;

    // show modal/dialog
    document.querySelector("#cashier-dialog").showModal();
  }
}

//close cashier dialog
function closeCashierDialog() {
  document.querySelector("#cashier-dialog").close();
}

//correcting restance to yes/no instead of true/false
function correctRestance(medlemObject) {
  const noRestance = "0 dkk";
  const priceYouth = "1000 dkk";
  const priceSenior = "1600 dkk";
  const pricePensionist = "1200 dkk";
  const pricePassive = "500 dkk";

  if (medlemObject.restance && medlemObject.age < 18 && medlemObject.active) {
    return priceYouth;
  } else if (
    medlemObject.restance &&
    medlemObject.age >= 18 &&
    medlemObject.age < 60 &&
    medlemObject.active
  ) {
    return priceSenior;
  } else if (
    medlemObject.restance &&
    medlemObject.age >= 60 &&
    medlemObject.active
  ) {
    return pricePensionist;
  } else if (medlemObject.restance && !medlemObject.active) {
    return pricePassive;
  } else {
    return noRestance;
  }
}

//inserting html article element for accounting overview
function insertAccountingResults() {
  let kontingenter = calculateAllSubscriptions(medlem);
  let restance = calculateRestance(medlem);
  let samlet = kontingenter - restance;
  document.querySelector("#kontingenter").textContent = kontingenter;
  document.querySelector("#restance").textContent = restance;
  document.querySelector("#samlet").textContent = samlet;
}

//calculating sum of all subscriptions
function calculateAllSubscriptions(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (element.active && element.age < 18) {
      // active u18 =+ 1000,-
      result += 1000;
    } else if (element.active && element.age >= 18 && element.age <= 60) {
      // active 18+ =+ 1600,-
      result += 1600;
    } else if (element.active && element.age > 60) {
      // active 60+ = (1600 * 0,75) = 1200,-
      result += 1200;
    } else if (!element.active) {
      // inactive = 500,-
      result += 500;
    }
  }

  return result;
}

//calculating sum of members in restance
function calculateRestance(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (element.restance && element.active && element.age < 18) {
      // active u18 =+ 1000,-
      result += 1000;
    } else if (
      element.restance &&
      element.active &&
      element.age >= 18 &&
      element.age <= 60
    ) {
      // active 18+ =+ 1600,-
      result += 1600;
    } else if (element.restance && element.active && element.age > 60) {
      // active 60+ = (1600 * 0,75) = 1200,-
      result += 1200;
    } else if (element.restance && !element.active) {
      // inactive = 500,-
      result += 500;
    }
  }

  return result;
}

//filtering cashiers list by restance
function cashierFilterByRestance() {
  const restance = document.querySelector("#restance-filter");

  console.log("...");
  if (restance.checked) {
    memberInRestance = medlem.filter(checkRestance);
    showMembersForCashier(memberInRestance);
  } else {
    showMembersForCashier(medlem);
  }

  function checkRestance(medlem) {
    if (medlem.restance) {
      return medlem;
    }
  }
}

async function updateMembersTable() {
  const tableBody = document.querySelector("#membersTableBody");
  tableBody.innerHTML = "";
  results = await getResults();
  console.log(medlem);
  console.log(results);
  showMembersForCashier(medlem);
  showCompetitiveMembers(results, medlem);
}

function sortByForTræner(event) {
  const value = event.target.value;

  if (value === "none") {
    updateMembersTable();
  } else if (value === "age" && !isFilterOn) {
    results.sort(compareAge);
    showCompetitiveMemberLoop(results);
  } else if (value === "age" && isFilterOn) {
    filterList.sort(compareAge);
    showCompetitiveMemberLoop(filterList);
  } else if (value === "time" && !isFilterOn) {
    results.sort(compareTime);
    showCompetitiveMemberLoop(results);
  } else if (value === "time" && isFilterOn) {
    filterList.sort(compareTime);
    showCompetitiveMemberLoop(filterList);
  }

  function compareAge(result1, result2) {
    return result1.member.age - result2.member.age;
  }

  function compareTime(result1, result2) {
    return result1.timeMiliSeconds - result2.timeMiliSeconds;
  }
}

// ========== filter ========== //
async function filterforCoach() {
  const top5 = document.querySelector("#coachFilterTop5");
  const junior = document.querySelector("#coachFilterJunior");
  const senior = document.querySelector("#coachFilterSenior");

  if (junior.checked) {
    filterList = results.filter(isJunior);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (senior.checked) {
    filterList = results.filter(isSenior);
    isFilterOn = true;
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else if (top5.checked) {
    filterList = results.sort(top5Results).slice(); // .slice bliver brugt til at lave en copy results, som splice går ind og ændre.
    isFilterOn = true;
    filterList.splice(5);
    console.log(filterList);
    showCompetitiveMemberLoop(filterList);
  } else {
    filterList = results;
    isFilterOn = false;
    showCompetitiveMemberLoop(results);
  }
}

function top5Results(result1, result2) {
  return result1.timeMiliSeconds - result2.timeMiliSeconds;
}

function isJunior(result) {
  return (
    result.member.age < 18 && result.member.aktivitetsform === "svømmedisciplin"
  );
}
function isSenior(result) {
  return (
    result.member.age >= 18 &&
    result.member.aktivitetsform === "svømmedisciplin"
  );
}
export { showCompetitiveMembers };
