function outer(){
    let msg="hi there!"
    function inner(){
        console.log(msg);
    }
    return inner;
}

const greet=outer();
greet();

console.log(thing);
var thing='surprise';

function Animal(name){
    this.name=name;
}
Animal.prototype.speak=function(){
    return this.name+" makes a sound.";
};
const dog=new Animal("Fido");
console.log(dog.speak());

const person={
    name:"Zara",
    greet(){
        console.log("Hi, "+this.name);
    }
};
setTimeout(person.greet.bind(person),500);//Use .bind() to always keep this as person in greet(). (Hint: setTimeout(person.greet.bind(person), 1500))
setTimeout(()=>person.greet(),1000);

console.log('Start');
setTimeout(()=>console.log('Timeout'),0);
Promise.resolve().then(()=>console.log('Promise'));
console.log('End');

// function twice(fn){
//     return function(x){
//         return fn(fn{x});
//     };
// }
// const plusOne=x=>x+1;
// const plusTwo=twice(plusOne);
// console.log(plusTwo(5));

const nums=[1,2,3,4,5];
const squares=nums.map(n=>n*n);
const odds=nums.filter(n=>n%2);
const sum=nums.reduce((a,b)=>a+b,0);
console.log({squares,odds,sum});

const person1={name:"Kim",age:31};
const {name,...rest}=person1;
console.log(name,rest);

try {
    throw new Error("Oops!");
}catch(e){
    console.log("Caught:",e.message);
}

async function bad(){
    throw new Error("fail");
}
(async()=>{
    try{
        await bad();
    }catch(e){
        console.log("Handled async:",e.message);
    }
})();

console.log('5'==5);
console.log('5'===5);
let x;
console.log(x===undefined);
console.log(null==undefined);

// const greet=(name='World')=>`Hello, ${name}!`;
// console.log(greet());
// console.log(greet('Alex'));

let timeout;
document.onmousemove=function(){
    clearTimeout(timeout);
    timeout=setTimeout(()=>{
        console.log('Mouse stopped moving!');
    },500);
};

let n=0;
let interval=setInterval(()=>{
    console.log('tick',++n);
    if(n==3){
        clearInterval(interval);
    }
},1000);

