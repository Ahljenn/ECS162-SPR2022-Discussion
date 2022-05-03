// Add enter key event listener
document.getElementById('characters-name').onkeydown = (event) => {
  if (event.key == 'Enter') {
    guessName();
  }
}
// Add button event listener
document.getElementById('characters-guess-button').onclick = () => {
  guessName();
}

// Update at first run
// updateNames();
// Periodically update for remote changes
// setInterval(updateNames, 5000);

function guessName() {
  // Get input
  let nameInput = document.getElementById('characters-name');
  let name = nameInput.value;

  // Reset input field
  nameInput.value = '';
  
  // Sanitize input
  if (name == '')
    return;

  api.guess(name);
  // api.guess(name).then(response => {
  //   updateNames();
  // })
}

// function updateNames() {
//   api.get().then(response => {
//     response.json().then(data => {
//       let charactersList = document.getElementById('characters-list');

//       charactersList.textContent = '';
//       for (let name of data) {
//         let child = document.createElement('span');
//         child.textContent = name
//         charactersList.appendChild(child);
//       }
//     })
//   })
// }