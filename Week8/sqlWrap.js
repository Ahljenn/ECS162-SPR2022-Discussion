'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const db = new sql.Database("characters.db");

// check if databases exist
let checkCharacterTable = " SELECT name FROM sqlite_master WHERE type='table' AND name='CharacterTable' ";
let checkProfileTable = " SELECT name FROM sqlite_master WHERE type='table' AND name='ProfileTable' "

db.get(checkCharacterTable, function (err, val) {
  if (val == undefined) {
        console.log("No character table - creating one");
        createCharacterTable();
  } else {
        console.log("Character table found");
  }
});

db.get(checkProfileTable, function (err, val) {
  if (val == undefined) {
        console.log("No profile table - creating one");
        createProfileTable();
  } else {
        console.log("Profile table found");
  }
});

// called to create table if needed
function createCharacterTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE CharacterTable (rowIdNum INTEGER PRIMARY KEY, name TEXT, guessed INTEGER)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// called to create table if needed
function createProfileTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ProfileTable (rowIdNum INTEGER PRIMARY KEY, userid INTEGER, fname TEXT)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

// empty all data from db
db.deleteEverything = async function() {
  await db.run("delete from CharacterTable");
  db.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = db;
