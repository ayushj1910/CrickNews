export function fetchFormdata() {
  var formData = {};
  formData["name"] = document.getElementById("name").value;
  formData["match"] = Number(document.getElementById("match").value);
  formData["runs"] = Number(document.getElementById("runs").value);
  formData["wickets"] = Number(document.getElementById("wickets").value);
  return formData;
}

export function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("match").value = "";
  document.getElementById("runs").value = "";
  document.getElementById("wickets").value = "";
}
export function setSelectedDiv() {
  selectedDiv = null;
}
export function onEdit(div) {
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

export function updateCard(formData) {
  selectedDiv[0].innerHTML = formData.name;
  selectedDiv[1].children[0].innerText = formData.runs;
  selectedDiv[1].children[2].innerText = formData.match;
  selectedDiv[1].children[4].innerText = formData.wickets;
}

export function onDelete(div) {
  selectedDiv = div.parentElement;
  selectedDiv.parentElement.parentElement.remove();
  addTotal();
}

// export {
//   fetchFormdata,
//   resetForm,
//   setSelectedDiv,
//   onEdit,
//   onDelete,
//   updateCard,
// };
