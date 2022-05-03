for (let menuItem of document.getElementById('menu').children) {
  menuItem.onclick = () => {
    menuItemSelected(menuItem.id);
  }
}

function menuItemSelected(id) {
  let name = id.split('-')[1];

  for (let menuItem of document.getElementById('menu').children) {
    if (menuItem.id == id){
      menuItem.classList.add('selected');
    } else {
      menuItem.classList.remove('selected');
    }
  }

  for (let detailItem of document.getElementById('details').children) {
    if (detailItem.id == name){
      detailItem.style.display = 'flex';
    } else {
      detailItem.style.display = 'none';
    }
  }
}