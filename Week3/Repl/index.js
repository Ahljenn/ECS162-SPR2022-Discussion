// A static server using Node and Express
const express = require("express");
const app = express();

// make all the files in 'Example' available on the Web
app.use(express.static("Example"));

// a module to use instead of older body-parser; not needed yet, but very useful!
app.use(express.json());


// when there is nothing following the slash in the url, return the main page of the app.
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/Example/index.html");
});

// This is where the server recieves and responds to POST requests
app.post('/submissions', function(request, response, next) {
  console.log("Server recieved a post request at", request.url);
  console.log(request.body);
  console.log(typeof request.body);

  // Make sure that the server sends a response back to the browser. That code would go here.
});


// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
