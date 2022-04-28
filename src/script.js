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
    processCards(data);
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
  let deleteBtn = document.getElementsByClassName("card").length;
  let sum = 0;
  let runed = document.getElementsByClassName("runed");
  for (let i = 0; i < deleteBtn; i++) {
    sum = sum + Number(runed[i].innerText);
  }
  document.querySelector(".total").innerHTML = "Total Runs - " + sum;
}

function processCards(data) {
  var container = document.getElementById("tile");
  for (var i = 0; i < data.squad.length; i++) {}

  for (var i = 0; i < data.squad.length; i++) {
    var div = document.createElement("div");
    div.className += `col-lg-4 col-md-3 col-sm-12 p-2 card card${[i]}`;

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.innerHTML = `<div class="rankdiv"><span class="rank${i} rankings"></span></div><div><i onclick="onDelete(this);" class="fa fa-times-circle icon${i} icon" aria-hidden="true"></i></div>
    `;
    var cardName = document.createElement("div");
    cardName.classList.add("card-title");
    var score = document.createElement("div");
    score.classList.add("card-subtitle");
    cardName.setAttribute("data-bs-toggle", "modal");
    cardName.setAttribute("type", "submit");
    cardName.setAttribute("data-bs-target", "#exampleModal");
    cardName.setAttribute("onclick", "onEdit(this)");
    cardName.innerHTML = `<span class="player-name">${data.squad[i].name}</span>`;
    if (data.squad[i].runs === null && data.squad[i].wickets === null) {
      score.innerHTML = `Runs - <span class="run${i} runed">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`;
    } else if (data.squad[i].wickets === null) {
      score.innerHTML = `Runs - <span class="run${i} runed">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>0</span> <br>`;
    } else if (data.squad[i].runs === null) {
      score.innerHTML = `Runs - <span class="run${i} runed">0</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`;
    } else {
      score.innerHTML = `Runs - <span class="run${i} runed">${data.squad[i].runs}</span> <br>  Match - <span>${data.squad[i].match}</span> <br> Wickets - <span>${data.squad[i].wickets}</span> <br>`;
    }

    container

      .appendChild(div)
      .appendChild(cardBody)
      .appendChild(cardName)
      .appendChild(score);
  }

  ranked();
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

function AddBtn(data) {
  const addbtn = document.querySelector(".add");

  addbtn.addEventListener("click", function () {
    if (selectedDiv == null) {
      event.preventDefault();
      const formData = fetchFormdata();
      if (formData.name) {
        let newData = data.squad.push(formData);
        document.getElementById("tile").innerHTML = "";
        processCards(data);

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

function onDelete(div, data) {
  selectedDiv = div.parentElement;
  selectedDiv.parentElement.parentElement.remove();
  processCards(data);
  addTotal();
  ranked();
}

function ranked() {
  let deleteBtn = document.getElementsByClassName("card").length;
  let ranks = [];

  let runed = document.getElementsByClassName("runed");
  for (let i = 0; i < deleteBtn; i++) {
    let ranker = Number(runed[i].innerText);
    ranks.push(ranker);
  }
  console.log(ranks);

  const sorted = [...new Set(ranks)].sort((a, b) => b - a);
  const rank = new Map(sorted.map((x, i) => [x, i + 1]));
  let finalRanks = ranks.map((x) => rank.get(x));

  console.log(finalRanks);
  finalRanks.forEach((element, index) => {
    document.querySelector(`.rank${index}`).innerHTML = `${element}`;
  });

  return finalRanks;
}
