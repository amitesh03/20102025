const cap = (n) => n > 15 ? 15 : n
console.log(cap(10))
console.log(cap(15))

const name = "Sam";
const score = 88;
console.log(`Hello, ${name}! Your score is ${score}. `);

//Destructuring

const user = { id: 1, email: "test@example.com" }
const { id, email } = user;
console.log(id);
console.log(email);

// Spread and Rest Operator
//Spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5];
const combined = [...arr1, ...arr2];
console.log(combined);
//Rest
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b);
}

console.log(sum(1, 2, 3, 4));

//Closures

function outer() {
    let message = "Hello!";
    function inner() {
        console.log(message);
        message = "Updated!";
    }
    return inner;
}

const greet = outer();
greet()
greet()

//Hoisting

showMsg();
function showMsg() {
    console.log("Hi!");
}

console.log(foo);
var foo = "bar";

try {
    let x = JSON.parse("invalid json");
} catch (error) {
    console.log("Error caught:", error.message);
}

//OOP

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}
const rect = new Rectangle(4, 5);
console.log(rect.area());

// Prototype

const animal = {
    eats: true,
    walk() {
        return "Walking!";
    }
};

const rabbit = { jumps: true };
