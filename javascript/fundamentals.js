console.log("Hello,World!");

var age=25;  //old style - function scope
let name="Alice";//block scope
const pi=3.14;//block scope

console.log(age);
console.log(name);
console.log(pi);

let str="hello";
let num=43;
let isAdmin=false;
console.log(typeof str)
console.log(typeof num)
console.log(typeof isAdmin)

let arr=[1,2,3]
let obj={
    key:"value"
}
console.log(arr[0])
console.log(obj.key)

let sum=2+3
let product=2*3

console.log(5>2)
console.log(5=="5")
console.log(5==="5")

console.log(true && false)
console.log(true || false)
console.log(!true)

let hour=10;
if(hour<12){
    console.log("Good,Morning!")
}else{
    console.log("Good,Afternoon!")
}

let fruit="apple";
switch(fruit){
    case "apple":
        console.log("Apple Pie");
        break;

    case "banana":
        console.log("Banana Bread");
        break;
}

for(let i=0;i<3;i++){
    console.log(i);
}

let n=0;
while(n<2){
    console.log(n);
    n++;
}

function add(a,b){
    return a+b;
}
console.log(add(1,2))

let arr1=[1,2,3,4];
let doubled=arr1.map(item=>item*2)
console.log(doubled)
let evens=arr1.filter(x=>x%2==0)
console.log(evens)

let sum1= arr1.reduce((total,num)=>total+num,0);
console.log(sum1)

let user={
    name:"Alice",
    age:20,
    greet:function(){return "Hi!";}
}

console.log(user.name)
console.log(user.greet())

let order={id:123,
    item:{
    name:"Laptop",
    price:40000 
    },
}

console.log(name,age)
console.log(order.item.name);

let num1="10";
let newnum1=Number(num1)
console.log(typeof newnum1)