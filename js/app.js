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
  document.querySelector("#medlem").innerHTML = ""; 

  for (const medlem of listOfMedlem) {
    showMedlem(medlem); 
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

  document.querySelector("#medlem").insertAdjacentHTML("beforeend", html); 

  document
    .querySelector("#medlem article:last-child .btn-delete")
    .addEventListener("click", () => deleteClicked(medlemObject));
  document
    .querySelector("#medlem article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(medlemObject));
}

async function updateMedlemGrid() {
  medlem = await getMedlem();
  showMedlemmer(medlem);

}

async function createMedlemClicked(event) {
  console.log(event);
  event.preventDefault();

  const form = event.target; 
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
  );
  if (response.ok) {
    console.log("New medlem succesfully added to Firebase 🔥");
    form.reset(); 
    updateMedlemGrid();
    event.target.parentNode.close(); 
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
  document.querySelector("#dialog-create-medlem").showModal(); 

function showErrorMessage(message) {
  document.querySelector(".error-message").textContent = message;
  document.querySelector(".error-message").classList.remove("hide");
}

function hideErrorMessage() {
  document.querySelector(".error-message").textContent = "";
  document.querySelector(".error-message").classList.add("hide");
}

function updateClicked(medlem) {
  const updateForm = document.querySelector("#form-update-medlem"); 
  updateForm.navn.value = medlem.navn; 
  updateForm.billede.value = medlem.billede; 
  updateForm.alder.value = medlem.alder; 
  updateForm.aktivitetsforms.value = medlem.aktivitetsform; 
  updateForm.date.value = medlem.medlemsskabsstart; 
  updateForm.Enddate.value = medlem.medlemsskabsslut; 
  updateForm.svømmedisciplins.value = medlem.svømmedisciplin;
  updateForm.setAttribute("data-id", medlem.id); 
  document.querySelector("#dialog-update-medlem").showModal();
}

function deleteClicked(medlem) {
  document.querySelector("#dialog-delete-medlem-title").textContent =
    medlem.navn;
  document
    .querySelector("#form-delete-medlem")
    .setAttribute("data-id", medlem.id); 
  document.querySelector("#dialog-delete-medlem").showModal();
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-medlem").close();
}

async function deleteMedlemClicked(event) {
  const id = event.target.getAttribute("data-id"); 
  const response = await deleteMedlem(id); 

  if (response.ok) {
    console.log("New medlem succesfully deleted from Firebase 🔥");
    updateMedlemGrid();
  }
}

async function updateMedlemClicked(event) {
  const form = event.target; 
  const navn = form.navn.value;
  const billede = form.billede.value;
  const alder = form.alder.value;
  const aktivitetsform = form.aktivitetsform.value;
  const medlemskabstype = form.medlemskabstype.value;
  const svømmedisciplin = form.svømmedisciplin.value;

  const id = form.getAttribute("data-id"); 
  const response = await updateMedlem(
    id,
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin
  ); 

  if (response.ok) {
    console.log("medlem succesfully updated in Firebase 🔥");
    updateMedlemGrid();
  }
}

let memberInRestance;

function showMembersForCashier(membersList) {
  const table = document.querySelector("#cashier-members-tbody");
  table.innerHTML = "";

  insertAccountingResults();

  document.querySelector("#cashier-members-tbody").textContent = "";

  for (const medlem of membersList) {
    showMemberForCashier(medlem);
  }
}

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

 
  document
    .querySelector("#cashier-members-tbody tr:last-child")
    .addEventListener("click", cashierMemberClicked);
}
  function cashierMemberClicked(event) {
    event.preventDefault;

    document
      .querySelector("#cashier-dialog-btn-close")
      .addEventListener("click", closeCashierDialog);

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

    document.querySelector("#cashier-dialog").showModal();
  }


function closeCashierDialog() {
  document.querySelector("#cashier-dialog").close();
}

function correctRestance(medlemObject) {
  console.log("yaaay");
  const noRestance = "0 dkk";
  const priceYouth = "1000 dkk";
  const priceSenior = "1600 dkk";
  const pricePensionist = "1200 dkk";
  const pricePassive = "500 dkk";

  if (
    medlemObject.restance &&
    medlemObject.alder < 18 &&
    medlemObject.aktivitetsform === "aktiv"
  ) {
    return priceYouth;
  } else if (
    medlemObject.restance &&
    medlemObject.alder >= 18 &&
    medlemObject.alder < 60 &&
    medlemObject.aktivitetsform === "aktiv"
  ) {
    return priceSenior;
  } else if (
    medlemObject.restance &&
    medlemObject.age >= 60 &&
    medlemObject.aktivitetsform === "aktiv"
  ) {
    return pricePensionist;
  } else if (
    medlemObject.restance &&
    medlemObject.aktivitetsform === "passiv"
  ) {
    return pricePassive;
  } else {
    return noRestance;
  }
}

function insertAccountingResults() {
  let kontingenter = calculateAllSubscriptions(medlem);
  let restance = calculateRestance(medlem);
  let samlet = kontingenter - restance;
  document.querySelector("#kontingenter").textContent = kontingenter;
  document.querySelector("#restance").textContent = restance;
  document.querySelector("#samlet").textContent = samlet;
}

function calculateAllSubscriptions(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (element.aktivitetsform === "aktiv" && element.alder < 18) {
      result += 1000;
    } else if (
      element.aktivitetsform === "aktiv" &&
      element.alder >= 18 &&
      element.alder <= 60
    ) {
      result += 1600;
    } else if (element.aktivitetsform === "aktiv" && element.alder > 60) {
      result += 1200;
    } else if (element.aktivitetsform === "passiv") {
      result += 500;
    }
  }

  return result;
}

function calculateRestance(membersList) {
  let result = 0;

  for (let i = 0; i < membersList.length; i++) {
    const element = membersList[i];
    if (
      element.restance &&
      element.aktivitetsform === "aktiv" &&
      element.alder < 18
    ) {
      result += 1000;
    } else if (
      element.restance &&
      element.aktivitetsform === "aktiv" &&
      element.alder >= 18 &&
      element.alder <= 60
    ) {
      result += 1600;
    } else if (
      element.restance &&
      element.aktivitetsform === "aktiv" &&
      element.alder > 60
    ) {
      result += 1200;
    } else if (element.restance && element.aktivitetsform === "passiv") {
      result += 500;
    }
  }

  return result;
}

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

let filterList;
let isFilterOn;

async function showCompetitiveMembers(results, medlemmer) {
  document
    .querySelector("#coachFilterJunior")
    .addEventListener("change", filterforCoach);
  document
    .querySelector("#coachFilterSenior")
    .addEventListener("change", filterforCoach);

  for (const result of results) {
    const medlem = medlemmer.find((medlem) => medlem.id === result.medlemId);
    result.medlem = medlem;
    console.log(result);
    console.log(medlemmer);
  }

  showCompetitiveMemberLoop(results);
}

async function filterforCoach() {
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
  } else {
    filterList = results;
    isFilterOn = false;
    showCompetitiveMemberLoop(results);
  }
}

function isJunior(result) {
  return (
    result.medlem.alder < 18 &&
    result.medlem.svømmedisciplin === "konkurrencesvømmer"
  );
}
function isSenior(result) {
  return (
    result.medlem.alder >= 18 &&
    result.medlem.svømmedisciplin === "konkurrencesvømmer"
  );

  }
}
