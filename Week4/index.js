// Database
const Database = require("@replit/database")
const db = new Database()

// A static server using Node and Express
const express = require("express");
const { validationResult, body } = require('express-validator');
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
  (request, response) => {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name.toLowerCase();
    console.log(`Got a guess: ${name}`);
    db.get(name).then(value => {
      if (value == null) {
        response.status(500).end();
      } else if (value == true) {
        response.status(200).end();
      } else {
        db.set(name, true).then(() => {
          response.status(200).end();
        })
      }
    })
  })

app.post("/characters/add", [
  body('name').exists().trim().isAlphanumeric()
],
  (request, response) => {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name.toLowerCase();
    console.log(`Adding character ${name}`);
    db.set(name, false).then(() => {
      response.status(200).end();
    });

  })

app.get("/characters/get", (request, response) => {
  db.list().then(keys => {
    let names = [];
    let promises = [];
    for (let key of keys) {
      promises.push(db.get(key))
    }

    Promise.all(promises).then((values) => {

      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          names.push(keys[i].toUpperCase());
        } else {
          names.push('___');
        }
      }
      response.send(names);
    });
  });
})

app.get("/characters/get/:key", (request, response) => {
  console.log(`Getting character ${request.params.key}`);
  try {
    db.get(request.params.key)
    .then(value => {
      if (value != null)
        response.send(value);
      else
        throw 'No value found';
    })
  } catch {
    response.status(500).send('Character not found');
  }
})

app.get("/characters/reset", (request, response) => {
  console.log('Resetting character DB');
  db.list().then(keys => {
    let promises = [];
    for (let key of keys) {
      promises.push(db.delete(key));
    }

    Promise.all(promises).then(() => response.status(200).end());
  });
})

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
