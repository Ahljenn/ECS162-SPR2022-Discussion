// Add some constant encoding for fantasy zip codes.
const zip_codes = new Map();
zip_codes.set('Erebor', '95814'); // Sacramento
zip_codes.set('Gondor', '94102'); // San Francisco
zip_codes.set('Isengard', '90014'); // Los Angeles
zip_codes.set('Shire', '95616'); // Davis
zip_codes.set('Mordor', '92328'); // Death Valley

// Assign callbacks for the various fantasy location buttons
for (let weatherButton of document.getElementById('weather').children) {
  let location = weatherButton.value;
  weatherButton.onclick = () => {
    console.log("I'm being clicked: " + location);
    getWeatherByLocation(location);
  }
}

// Function to get weather by location
async function getWeatherByLocation(location) {
  // Get zip associated with location from mapping
  let zip = zip_codes.get(location);

  // Send request to origin server at appropriate endpoint
  let api_url = `weather/${zip}`;
  let response = await fetch(api_url);

  // Wait for origin server to send back JSON object
  let json = await response.json();

  // Sanity check the contents of the JSON
  console.log(json);

  // Update text for the locations
  updateSummary(location, json);
}

function updateSummary(location, json) {
  let el = document.getElementById(`${location.toLowerCase()}-summary`);
  el.textContent = `Current air quality in ${location} is ${json[0].AQI}`; 
}