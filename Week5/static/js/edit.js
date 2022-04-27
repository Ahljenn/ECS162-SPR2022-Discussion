// Add enter key event listener
document.getElementById('edit-name').onkeydown = (event) => {
  if (event.key == 'Enter') {
    addName();
  }
}
// Add button event listeners
document.getElementById('edit-add-button').onclick = () => {
  addName();
}
document.getElementById('edit-reset-button').onclick = () => {
  resetNames();
}

function addName() {
  // Get status text
  let status = document.getElementById('edit-status');

  // Get input
  let nameInput = document.getElementById('edit-name');
  let name = nameInput.value;

  // Reset input field
  nameInput.value = '';

  // Sanitize input
  if (name == '')
    return;

  api.add(name).then(response => {
    
    status.textContent = `Successfully, added "${name.toUpperCase()}"`;
    status.style.opacity = 1.0;
    setTimeout(() => {
      status.style.opacity = 0.0;
    }, 1500)
    // updateNames();
  })
}

function resetNames() {
  // Get status text
  let status = document.getElementById('edit-status');

  api.reset().then(response => {
    // updateNames();
    status.textContent = 'Successfully, cleared all names';
    status.style.opacity = 1.0;
    setTimeout(() => {
      status.style.opacity = 0.0;
    }, 1500)
  })
}