// Store some relevant inputs
let search_inputs = ['Gimli','Elrond','Frodo','Aragorn'];

// Search for the given input, at the time that the search bar element is stored as an object. This function is called
// when the document object with ID "search-button" is clicked. Line 83 of index file.
function search() {
    console.log("I'm being clicked");
    // Store the element containing the input
    let searchbar = document.getElementById ('search-bar');
    // Use alert to return case-insensitive matches (when we search for "frodo", we still want it to be recognized as "Frodo")
    alert(search_inputs.filter( a => a.toLowerCase().indexOf(searchbar.value.toLowerCase()) !== -1));
}