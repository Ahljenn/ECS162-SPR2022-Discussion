// Find our button element and attach an event listener to it
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", submit);

// Define the function that will submit a POST request to the server
function submit() {
    let input = document.getElementById("search-bar").value;
    console.log(`Searched for: ${input}`);
    const data = { input };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };

    fetch('/submissions', options);
};