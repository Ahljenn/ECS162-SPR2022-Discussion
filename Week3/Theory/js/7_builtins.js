/*
Here are some useful built-in functions that you can use.
There are many more so feel free to expore!
*/

// Math
Math.floor(3.4);
Math.random();
Math.PI;


// DOM
document.body;
let el = document.getElementById('element1');
el.textContent = 'Hello World!';
el.innerHTML = 'Same as Hello World!';
el.style.fontFamily = 'sans-serif';

// DOM Events
let btn = document.getElementById('button1');
btn.onclick = () => {
    el.textContent = 'Button was clicked!';
}
el.onmouseenter = () => {
    el.style.backgroundColor = 'red';
}
el.onmouseout = () => {
    el.style.backgroundColor = 'transparent';
}

// Timers and Intervals
setTimeout(() => {
    console.log('This is printed after 1000 milliseconds!');
}, 1000);

let handle = setInterval(() => {
    console.log('This is printed periodically every second!');
}, 1000);

setTimeout(() => clearInterval(handle), 5000);