/*
Variables can be used to store literals (among other things).
The keywords used to create variables are 'let' and 'const'.
*/

// Declaration
let a; // undefined

// Definition
const C = 299792458; // Number
let year = 2; // Number
let fullname = 'David Bauer'; // String
let graduated = false; // Boolean

// More advanced... list, object.
let shoppingList = ['bananas', 'avocados', 'boba'];
let profile = {
    name: 'Alan Turing',
    born: 1912,
    cool: true,
};

// Template literals
let message = `Hi, this is ${fullname}, and I'm in year ${year} of my program.`;


// Quiz - What will the following lines do? Will there be errors?
fullname = 'Lukas';
year = 3;
year = 'one';

console.log(shoppingList);
console.log(shoppingList[2]);
console.log(shoppingList[3]);

profile.almaMater = 'University of Cambridge';
console.log(profile.name);
console.log(profile['born']);