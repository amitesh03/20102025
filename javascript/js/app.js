const heading=document.getElementById("main-heading");
const nameInput=document.getElementById("nameInput");
const greenBtn=document.getElementById("nameInput");
const output=document.getElementById("output");
const colorBox=document.getElementById("colorBox");
const colorBtn=document.getElementById("colorBtn");

heading.textContent="Welcome to DOM Manipulation!";
heading.style.color="blue";

greetBtn.addEventListener('click',function(){
    const name=nameInput.value.trim();
    if(name){
        output.textContent=`Hello!, ${name}`;
    }else{
        output.textContent="Please enter your name.";
    }
});

let isPink=false;
colorBtn.addEventListener('click',function(){
    const color=colorBox.style.background;
    if(color!='pink'){
        colorBox.style.background='pink'
        isPink=true
    }else{
        colorBox.style.background='lightgray'
        isPink=false
    }
})
