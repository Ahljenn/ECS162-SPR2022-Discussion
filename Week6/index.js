'use strict'

// A static server using Node and Express
const express = require("express");
const { validationResult, body } = require('express-validator');

// Promises-wrapped version of sqlite3
const db = require('./sqlWrap');
// our database operations
const dbo = require('./databaseOps');

const app = express();

// Import node implementation of fetch API
const fetch = require("node-fetch");

// make all the files in 'static' available on the Web
app.use(express.static("static"));

// a module to use instead of older body-parser; not needed yet, but very useful!
app.use(express.json());

// when there is nothing following the slash in the url, return the main page of the app.
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/static/index.html");
});

app.post("/characters/guess", [
  body('name').exists().trim().isAlphanumeric()
],
  async function(request, response) {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name;
    console.log(`Got a guess: ${name}`);
    let result = await dbo.get_char(name);
    if (result != null) {
      if (result.guessed === 1) {
        response.status(200).end();
      } else {
        await dbo.update_char(name);
        let updated_result = await dbo.get_char(name);
        console.log(updated_result);
        response.status(200).end();
      }
    } else {
      console.log('Character not found.');
    }
  })

app.post("/characters/add", [
  body('name').exists().trim().isAlphanumeric()
],
  async function(request, response) {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name;
    console.log(`Adding character ${name}`);
    await dbo.post_char(name).then(() => {
      response.status(200).end();
    });
  })

app.get("/characters/reset", async function (request, response) {
  console.log('Resetting character DB');
  await dbo.delete_all();
  let results = await dbo.get_all();
  console.log(results);
  response.send(results);
})

// Handle AirNow API requests
app.get("/weather/:zip", async (request, response) => {
  let zip = request.params.zip;
  // Construct the API url we are going to fetch
  let api_url = `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip}&date=2021-04-29&distance=25&API_KEY=${process.env['API_KEY']}`;
  
  console.log("received request at /weather");

  // Handle request to the AirNow API server
  let fetch_response = await fetch(api_url);
  let json = await fetch_response.json();

  // Send the JSON object retrieved from the fetch back to the browser
  response.json(json);
})

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});

// call the async test function for the database
// this fills the db with test data
// in your system, you can delete this. 
dbo.testDB().catch(
  function (error) {
    console.log("error:",error);}
);
