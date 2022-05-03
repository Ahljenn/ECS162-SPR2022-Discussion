'use strict'

// database operations.
// Async operations can always fail, so these are all wrapped in try-catch blocks
// so that they will always return something
// that the calling function can use. 

// Export functions that will be used in other files.
module.exports = {
  testDB: testDB, //adds test entries to the DB
  post_char: post_char,
  get_char: get_char,
  delete_char: delete_char,
  update_char: update_char,
  get_all: get_all,
  delete_all: delete_all,
}

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// SQL commands for CharacterTable
const insertChar = "INSERT INTO CharacterTable (name, guessed) values (?,?)"
const getChar = "SELECT * FROM CharacterTable WHERE name = ?";
const deleteChar = "DELETE FROM CharacterTable WHERE name = ?";
const getAllChars = "SELECT * FROM CharacterTable";
const updateChar = "UPDATE CharacterTable SET guessed = true WHERE name = ?";

// Testing function loads some data into DB. 
// Is called when app starts up to put fake 
// data into db for testing purposes.
// Can be removed in "production". 
async function testDB () {
  // all DB commands are called using await
  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();
  
  let dbData = [
    {
      name: 'Frodo',
      guessed: false,
    },
    {
      name: 'Aragorn',
      guessed: false,
    },
    {
      name: 'Gimli',
      guessed: false,
    },
  ]
  
  for(const entry of dbData) {
    await db.run(insertChar,[entry.name, entry.guessed]);
  }

  // some examples of getting data out of database
  
  // look at an item we just inserted
  let result = await db.get(getChar,["Frodo"]);
  console.log("sample single db result",result);
  
  // get multiple items as a list
  result = await db.all(getAllChars);
  console.log("sample multiple db result",result);
}

/**
 * Insert char into the database
 */
async function post_char(name) {
  try {
    await db.run(insertChar,[name, false]);
  } catch (error) {
    console.log("error", error)
  }
}

/**
 * Search database for char by name and return it
 */
async function get_char(name) {
  try {
    let result = await db.get(getChar,[name]);
    return (result != null) ? result : null;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Delete char by name from database
 */
async function delete_char(name) {
  try {
    await db.run(deleteChar, [name]);
  }
  catch (error) {
    console.log(error);
  }
}

/**
 * Update a char's guessed value by name
 */
async function update_char(name) {
  try {
    await db.run(updateChar, [name]);
  }
  catch (error) {
    console.log(error);
  }
}

// Dumps whole table; useful for debugging
async function get_all() {
  try {
    let results = await db.all("select * from CharacterTable", []);
    return results;
  } 
  catch (error) {
    console.log(error);
    return [];
  }
}

// Deletes all entries in database
async function delete_all() {
  try {
    await db.deleteEverything();
  }
  catch (error) {
    console.log(error);
  }
}