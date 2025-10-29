//Callback

function loadData(callback) {
    setTimeout(() => {
        callback("Data loaded!");
    }, 1000);
}

loadData(result => {
    console.log(result);
})

//Promises

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise worked!");
    }, 1000);
});

myPromise.then(result => {
    console.log(result);
})

//Async/Await

function asyncTask() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Done!"), 1000);
    })
}

async function go() {
    const result = await asyncTask();
    console.log(result);
}
go();

fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(response => response.json())
    .then(data => console.log(data));

console.log("A");
setTimeout(() => {console.log('B'), 0})
console.log('C');

