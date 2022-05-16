// Assign button click function to execute fetch
let plansButton = document.getElementById("plans-button");
plansButton.addEventListener("click",getTokenAndTransmitPlans);

// Fetch to server endpoint /csrf
async function getTokenAndTransmitPlans() {
  let data = { plans: "We're taking the ring to Mt. Doom." };
  let response = await fetch('/csrf');
  let token = await response.json();

  // log the token so we can see it in client console
  console.log(token);

  let result = await fetch('/plans', {
    credentials: 'same-origin', // <-- includes cookies in the request
    headers: {
      'CSRF-Token': token, // <-- is the csrf token as a header
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  });
}