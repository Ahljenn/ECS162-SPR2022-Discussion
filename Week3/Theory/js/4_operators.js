/*
Operators like +, -, *, / can be used to construct new values.
*/

// Arithmetic
let a = 1 + 3;
let b = 2 * 6;
let c = (1 + 3) * 2;
let d = (1 * 100) + (6 * 10) + (2 * 1);
let e = 10**3;

let course = 'ECS' + '162';
course = 'ECS' + 162;
course = `ECS${d}`;

// Bitwise
let f = 0x0FF & 0x00F; // AND -> 0x00F
let g = 0x0F0 | 0x00F; // OR -> 0x0FF
let h = 0xFF0 ^ 0x0FF; // XOR -> 0xF0F
let i = ~0xFF0 // NOT -> 0x00F
let j = 0x01 << 2 // SL -> 0x04
let k = 0x04 >> 2 // SR -> 0x01