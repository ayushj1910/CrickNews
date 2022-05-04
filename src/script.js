console.log("Hello");

let mydata = fetch("../data/MI.json");
let selectedDiv = null;

mydata
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    AddBtn(data);
    headerElems(data);
    createCards(data);
    addTotal();
  })
  .catch(function (err) {
    console.log(err);
  });

function headerElems(data) {
  document.querySelector(".team-name").innerText = data.team;
  document.querySelector(".win").innerText = `Wins - ${data.wins}`;
  document.querySelector(".lost").innerText = `Lost - ${data.lost}`;
  document.querySelector(".tie").innerText = `Tie - ${data.tie}`;
}

function addTotal() {
  let cards = document.getElementsByClassName("card");
  let sum = 0;
  let scored = document.getElementsByClassName("scored");
  for (let i = 0; i < cards.length; i++) {
    sum = sum + Number(scored[i].innerText);
  }
  document.querySelector(".total").innerHTML = "Total Runs - " + sum;
}

function createCards(data) {
  var container = document.getElementById("tile");

  for (var i = 0; i < data.squad.length; i++) {
    let div = createElement();
    let cardBody = createElement();
    let cardName = createElement();
    let score = createElement();

    setClass(div, cardBody, cardName, score, i);
    setAttribute(cardName);
    setInnerHtml(data, cardBody, cardName, score, i);

    container

      .appendChild(div)
      .appendChild(cardBody)
      .appendChild(cardName)
      .appendChild(score);
  }

  ranked();
}
function createElement() {
  const div = document.createElement("div");
  return div;
}
function setClass(div, cardBody, cardName, score, i) {
  div.className += `col-lg-4 col-md-3 col-sm-12 p-2 card card${[i]}`;
  cardBody.classList.add("card-body");
  cardName.classList.add("card-title");
  score.classList.add("card-subtitle");
}

function setAttribute(cardName) {
  cardName.setAttribute("data-bs-toggle", "modal");
  cardName.setAttribute("type", "submit");
  cardName.setAttribute("data-bs-target", "#exampleModal");
  cardName.setAttribute("onclick", "onEdit(this)");
}

function setInnerHtml(data, cardBody, cardName, score, i) {
  cardBody.innerHTML = `<div class="rankdiv"><span class="rank${i} rankings"></span></div><div><i onclick="onDelete(this);" class="fa fa-times-circle icon${i} icon" aria-hidden="true"></i></div>
  `;
  cardName.innerHTML = `<span class="player-name">${data.squad[i].name}</span>`;

  score.innerHTML =
    data.squad[i].runs === null && data.squad[i].wickets === null
      ? `Runs - <span class="run${i} scored">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`
      : data.squad[i].wickets === null
      ? `Runs - <span class="run${i} scored">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`
      : data.squad[i].runs === null
      ? `Runs - <span class="run${i} scored">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`
      : `Runs - <span class="run${i} scored">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`;
}

function AddBtn(data) {
  const addbtn = document.querySelector(".add");

  addbtn.addEventListener("click", function () {
    if (selectedDiv == null) {
      event.preventDefault();
      const formData = fetchFormdata();
      if (formData.name) {
        data.squad.push(formData);
        document.getElementById("tile").innerHTML = "";
        createCards(data);

        document.querySelector(".total").innerHTML = "";
        addTotal();
        resetForm();
        ranked();

        const alert = document.getElementById("alert");
        alert.classList.add("alert-display");
      } else {
        const alert = document.getElementById("alert");
        alert.classList.remove("alert-display");
      }
    } else {
      let formData = fetchFormdata();
      event.preventDefault();

      updateCard(formData);
      ranked();
      addTotal();
    }
  });
}

function fetchFormdata() {
  let formData = {};
  formData["name"] = document.getElementById("name").value;
  formData["match"] = Number(document.getElementById("match").value);
  formData["runs"] = Number(document.getElementById("runs").value);
  formData["wickets"] = Number(document.getElementById("wickets").value);
  return formData;
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("match").value = "";
  document.getElementById("runs").value = "";
  document.getElementById("wickets").value = "";
}

function setSelectedDiv() {
  selectedDiv = null;
}

function onEdit(div) {
  selectedDiv = div.children;
  document.getElementById("name").value = selectedDiv[0].innerHTML;
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

function updateCard(formData) {
  selectedDiv[0].innerHTML = formData.name;
  selectedDiv[1].children[0].innerText = formData.runs;
  selectedDiv[1].children[2].innerText = formData.match;
  selectedDiv[1].children[4].innerText = formData.wickets;
  return formData;
}

function onDelete(div) {
  selectedDiv = div.parentElement;
  selectedDiv.parentElement.children[2].children[1].children[0].innerHTML = 0;
  ranked();
  selectedDiv.parentElement.parentElement.style.display = "none";
  addTotal();
}

function ranked() {
  let runs = getRuns();
  let finalRanks = getRanks(runs);
  setRanks(finalRanks);
}

function getRuns() {
  let cards = document.getElementsByClassName("card");
  let scored = document.getElementsByClassName("scored");
  let runs = [];
  for (let i = 0; i < cards.length; i++) {
    let ranker = Number(scored[i].innerText);
    runs.push(ranker);
  }
  return runs;
}

function getRanks(ranks) {
  const sorted = [...new Set(ranks)].sort((a, b) => b - a);
  const rank = new Map(sorted.map((x, i) => [x, i + 1]));
  let finalRanks = ranks.map((x) => rank.get(x));

  return finalRanks;
}

function setRanks(finalRanks) {
  finalRanks.forEach((element, index) => {
    document.querySelector(`.rank${index}`).innerHTML = `${element}`;
  });
}
