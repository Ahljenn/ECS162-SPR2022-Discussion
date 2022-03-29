// Store some relevant inputs
let search_inputs = ['Gimli','Elrond','Frodo','Aragorn'];

// Search for the given input
function search() {
    console.log("I'm being clicked");
    // Store the element containing the input
    let searchbar = document.getElementById ('search-bar');
    // Use alert to return case-insensitive matches
    alert(search_inputs.filter( a => a.toLowerCase().indexOf(searchbar.value.toLowerCase()) !== -1));
}