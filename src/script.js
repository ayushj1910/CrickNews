console.log("Hello");

//--------------------------Teams Array-------------------------------------------
// Add string to array with same name as json file to create a tab and report
//Do not use spaces while naming a file
const teams = [
  "Mumbai-Indians",
  "Rajasthan-Royals",
  "Delhi-Capitals",
  "Gujrat-Titans",
  "Punjab-Kings",
];

//----------------------------Global Variables------------------------------------
let container;
let selectedTeam = teams[0];
let selectedDiv = null;

//--------------------Starter functions-----------------------------------------

//Load HTML elements
createNavbar();
createAlert();
formModal();

//Data loaders ( Starter functions call)
appendNavTabs();
appendNavTabContent();
teamBtn();
processTeamData();
//calling this to set form ID for team-0 to set environment for first team in the array  of teams
formId(teams[0]);

//------------------Functions related to Nav-tabs----------------------------------------------

//This function creates and appends nav tabs in myTab div
function appendNavTabs() {
  const navTabs = document.getElementById("myTab");
  teams.forEach(function (team, index) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.setAttribute("role", "presentation");

    li.innerHTML = `<button
    class="nav-link"
    id="team-${index}"
    data-bs-toggle="tab"
    data-bs-target="#${team}"
    type="button"
    role="tab"
    aria-controls="${team}"
    aria-selected="true"
  >${team}</button>`;
    navTabs.appendChild(li);
  });
  document.getElementById("team-0").classList.add("active");
}

//This function creates structure where all the data will be appened
function appendNavTabContent() {
  const tabDiv = document.getElementById("myTabContent");
  teams.forEach(function (team, index) {
    const wrapperDiv = document.createElement("div");
    setTabDivAttributes(wrapperDiv, team, index);

    const tabContent = document.createElement("div");
    tabContent.classList.add("tabcontent");
    tabContent.setAttribute("id", `${team}`);
    tabContentInnerHtml(tabContent, team, index);

    tabDiv.appendChild(wrapperDiv).appendChild(tabContent);
  });
  document.getElementById(teams[0]).classList.add("active");
  document.getElementById(teams[0]).classList.add("show");
}

//This sets innerHTML in appendNavTabContent function
function tabContentInnerHtml(tabContent, team, index) {
  tabContent.innerHTML = `<h1 class="${team}_team-name team-name p-3"></h1>
  <div class="row p-2 pt-0 status">
    <div class="col-4 bg-success bg-gradient">
      <h2 class="${team}_win"></h2>
    </div>
    <div class="col-4 bg-danger bg-gradient">
      <h2 class="${team}_lost"></h2>
    </div>
    <div class="col-4 bg-secondary bg-gradient">
      <h2 class="${team}_tie"></h2>
    </div>
  </div>
  <div id="tile-${index}" class="row tiles ${team}_tiles"></div>
  <h1 class="${team}_total total p-3"></h1>`;
}

//Set attributes to the wrapperDiv in appendNavTabContent
function setTabDivAttributes(div, team, index) {
  div.setAttribute("class", "tab-pane fade");
  div.setAttribute("id", `${team}`);
  div.setAttribute("role", "tabpanel");
  div.setAttribute("aria-labelledby", `team-${index}`);
}

//This function add event handlers to all the created nav-tabs
function teamBtn() {
  teams.forEach(function (team, index) {
    const btn = document.getElementById(`team-${index}`);
    btn.addEventListener("click", function () {
      btn.innerText = team;
      selectedTeam = team;
      formId(team);
      container = document.getElementById(`tile-${index}`);
    });
  });
}

//-------------Form function--------------------------------------

//This function is used to set ID for the form for a praticular team
function formId(team) {
  document.querySelector(".name").setAttribute("id", `${team}_name`);

  document
    .querySelector(".addCardBtn")
    .setAttribute("onclick", `resetForm('${team}'); setSelectedDiv()`);
  document
    .querySelector(".close")
    .setAttribute("onclick", `resetForm('${team}')`);
}

//--------------------AJAX function to process data for all teams-----------------------------------
function processTeamData() {
  teams.forEach(function (team, index) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        container = document.getElementById(`tile-${index}`);
      }
    };
    xhttp.open("GET", `../data/${team}.json`, true);
    xhttp.onload = function () {
      try {
        const datanew = JSON.parse(this.responseText);
        AddBtn(datanew, team);
        headerElems(datanew, team);
        createCards(datanew, team);
        addTotal(team);
        container = document.getElementById("tile-0");
      } catch (error) {
        console.log(error);
      }
    };
    xhttp.send();
  });
}

//--------------------Functions creating the cards and ranking-------------------------------
//This function sets headers for all the teams - Team name, win, lost, tie
function headerElems(data, team) {
  document.querySelector(`.${team}_team-name`).innerText = data.team;
  document.querySelector(`.${team}_win`).innerText = `Wins - ${data.wins}`;
  document.querySelector(`.${team}_lost`).innerText = `Lost - ${data.lost}`;
  document.querySelector(`.${team}_tie`).innerText = `Tie - ${data.tie}`;
}

//This function sums up all the runs of a particular team.
function addTotal(team) {
  let cards = document.getElementsByClassName(`${team}_card`);
  let sum = 0;
  let scored = document.getElementsByClassName(`${team}_scored`);
  for (let i = 0; i < cards.length; i++) {
    sum = sum + Number(scored[i].innerText);
  }
  document.querySelector(`.${team}_total`).innerHTML = "Total Runs - " + sum;
}

//This function create cards for all the players of a particular team and append them in their respective containers
function createCards(data, team) {
  for (var i = 0; i < data.squad.length; i++) {
    let div = createElement();
    let cardBody = createElement();
    let cardName = createElement();
    let score = createElement();

    setClass(div, cardBody, cardName, score, i, team);
    setAttribute(cardName, team);
    setInnerHtml(data, cardBody, cardName, score, i, team);

    container

      .appendChild(div)
      .appendChild(cardBody)
      .appendChild(cardName)
      .appendChild(score);
  }
  ranked(team);
}

//Creates element for createCard function
function createElement() {
  const div = document.createElement("div");
  return div;
}

//Gives class to the elements created in createCard function
function setClass(div, cardBody, cardName, score, i, team) {
  div.className += `col-lg-4 col-md-6 col-sm-12 p-2 card ${team}_card card${[
    i,
  ]}`;
  cardBody.classList.add("card-body");
  cardName.classList.add("card-title");
  score.classList.add("card-subtitle");
}

//Sets attributes for elements in createCard function
function setAttribute(cardName, team) {
  cardName.setAttribute("data-bs-toggle", "modal");

  cardName.setAttribute("type", "submit");
  cardName.setAttribute("data-bs-target", "#exampleModal");
  cardName.setAttribute("onclick", `onEdit(this, '${team}')`);
}

//sets InnerHTML for elements created in createCard function
function setInnerHtml(data, cardBody, cardName, score, i, team) {
  cardBody.innerHTML = `<div class="rankdiv"><span class="${team}_rank${i} rankings"></span></div><div><i onclick="onDelete(this,'${team}');" class="fa fa-times-circle hey icon${i} icon" aria-hidden="true"></i></div>
  `;
  cardName.innerHTML = `<span class="player-name">${data.squad[i].name}</span>`;

  score.innerHTML =
    data.squad[i].runs === null && data.squad[i].wickets === null
      ? `Runs - <span class="run${i} ${team}_scored">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`
      : data.squad[i].wickets === null
      ? `Runs - <span class="run${i} ${team}_scored">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`
      : data.squad[i].runs === null
      ? `Runs - <span class="run${i} ${team}_scored">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`
      : `Runs - <span class="run${i} ${team}_scored">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`;
}

//Event handler function for add buttton present in Form
function AddBtn(data, team) {
  const addbtn = document.querySelector(".add");

  addbtn.addEventListener("click", function () {
    if (selectedTeam == team)
      if (selectedDiv == null) {
        //This will be executed when the user tries creates a new card
        event.preventDefault();
        const formData = fetchFormdata(team);

        if (formData.name) {
          //Pushing entered data into the main data
          data.squad.push(formData);

          container.innerHTML = "";
          createCards(data, team);

          document.querySelector(`.${team}_total`).innerHTML = "";
          addTotal(team);
          resetForm(team);
          ranked(team);

          const alert = document.getElementById("alert");
          alert.classList.add("alert-display");
        } else if (team) {
          //Shows alert on top if player name is missing
          const alert = document.getElementById("alert");
          alert.classList.remove("alert-display");
        }
      } else {
        //This executes when the user is editing the existing cards
        const formData = fetchFormdata(team);
        event.preventDefault();

        updateCard(formData);
        ranked(team);
        addTotal(team);
      }
  });
}

//Fetching data entered by user in the form and creating an object from that data
function fetchFormdata(team) {
  let formData = {};
  let playerName = document.getElementById(`${team}_name`);
  if (playerName) {
    formData["name"] = playerName.value;
    formData["match"] = Number(document.getElementById("match").value);
    formData["runs"] = Number(document.getElementById("runs").value);
    formData["wickets"] = Number(document.getElementById("wickets").value);
  }

  return formData;
}

//Resets form data entered by user after a card is being created or edited
function resetForm(team) {
  document.getElementById(`${team}_name`).value = "";
  document.getElementById("match").value = "";
  document.getElementById("runs").value = "";
  document.getElementById("wickets").value = "";
}

//Sets selectedDiv(Global variable) to null to create a card instead of updation
function setSelectedDiv() {
  selectedDiv = null;
}

//Function used to retrieve data of selected card to the form so that user can make changes
function onEdit(div, team) {
  selectedDiv = div.children;
  const playerName = document.getElementById(`${team}_name`);
  if (playerName) {
    playerName.value = selectedDiv[0].innerHTML;
    document.getElementById("runs").value = Number(
      selectedDiv[1].children[0].innerText
    );
    document.getElementById("match").value = Number(
      selectedDiv[1].children[2].innerText
    );
    document.getElementById("wickets").value = Number(
      selectedDiv[1].children[4].innerText
    );
  }
  const alert = document.getElementById("alert");
  alert.classList.add("alert-display");
}

//Updates the data edited by user for the selected card
function updateCard(formData) {
  selectedDiv[0].innerHTML = formData.name;
  selectedDiv[1].children[0].innerText = formData.runs;
  selectedDiv[1].children[2].innerText = formData.match;
  selectedDiv[1].children[4].innerText = formData.wickets;

  return formData;
}

//function which is triggered when the red cross is clicked
function onDelete(div, team) {
  selectedDiv = div.parentElement;
  selectedDiv.parentElement.children[2].children[1].children[0].innerHTML = 0;
  ranked(team);
  selectedDiv.parentElement.parentElement.style.display = "none";
  addTotal(team);
}

//Main ranking function to rank the players
function ranked(team) {
  let runs = getRuns(team);
  let finalRanks = getRanks(runs);
  setRanks(finalRanks, team);
}

//This function gets all the runs present in every card on the page and push into an array
function getRuns(team) {
  let cards = document.getElementsByClassName(`${team}_card`);
  let scored = document.getElementsByClassName(`${team}_scored`);
  let runs = [];
  for (let i = 0; i < cards.length; i++) {
    let ranker = Number(scored[i].innerText);
    runs.push(ranker);
  }
  return runs;
}

//This function organise the ranks in a ascending order.
//It gives same rank if the runs are same for any player
function getRanks(runs) {
  const sorted = [...new Set(runs)].sort((a, b) => b - a);
  const rank = new Map(sorted.map((x, i) => [x, i + 1]));
  let finalRanks = runs.map((x) => rank.get(x));

  return finalRanks;
}

//Sets final ranks in the rank div present on the edge of card
function setRanks(finalRanks, team) {
  finalRanks.forEach((element, index) => {
    document.querySelector(`.${team}_rank${index}`).innerHTML = `${element}`;
  });
}

//----------------------HTML elememts loader fucntions------------------------------

//Creates navigation bar fixed at top of the page
function createNavbar() {
  const navbar = document.getElementById("navbar");
  navbar.innerHTML = `
  <nav class="navbar fixed navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">CrickNews</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="dashboard" href="#">Dashbaord</a>
          </li>
          
        </ul>
        <button
          onclick="setSelectedDiv()"
          class="btn btn-outline-light addCardBtn"
          type="submit"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Card
        </button>
      </div>
    </div>
  </nav>`;
}

//Creates an alert message when the user tries to create a new card without name
function createAlert() {
  const alert = document.getElementById("nameAlert");
  alert.innerHTML = `<div class="alert alert-danger alert-display" id="alert" role="alert">
  Name Field is requierd to add a card!
</div>`;
}

//Creates a modal window which has a form to add new player details
function formModal() {
  const formModal = document.getElementById("formModal");
  formModal.innerHTML = `<div
  class="modal fade"
  id="exampleModal"
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">
          Player Details
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <form class="add-form" autocomplete="off" on>
          <div class="mb-3">
            <label for="name" class="form-label" required>Name</label>
            <input
              type="text"
              class="form-control name"
              id="name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="match" class="form-label">Mactch</label>
            <input type="number" class="form-control" id="match" />
          </div>
          <div class="mb-3">
            <label for="runs" class="form-label">Runs</label>
            <input type="number" class="form-control" id="runs" />
          </div>
          <div class="mb-3">
            <label for="wickets" class="form-label">Wickets</label>
            <input type="number" class="form-control" id="wickets" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger close"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              value="submit"
              class="btn btn-success add"
              data-bs-dismiss="modal"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>`;
}
