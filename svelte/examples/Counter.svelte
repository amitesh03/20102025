<script>
  let count = 0;
  
  function increment() {
    count += 1;
  }
  
  function decrement() {
    count -= 1;
  }
  
  function reset() {
    count = 0;
  }
  
  // Reactive declaration
  $: doubled = count * 2;
</script>

<style>
  .counter {
    text-align: center;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .count {
    font-size: 2em;
    margin: 20px 0;
    color: #ff3e00;
  }
  
  .doubled {
    font-size: 1.2em;
    color: #676778;
    margin-bottom: 20px;
  }
  
  button {
    margin: 0 10px;
    padding: 10px 20px;
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  button:hover {
    background-color: #cc3200;
  }
  
  .reset {
    background-color: #676778;
  }
  
  .reset:hover {
    background-color: #4a4a5a;
  }
</style>

<div class="counter">
  <h1>Svelte Counter</h1>
  <div class="count">{count}</div>
  <div class="doubled">Doubled: {doubled}</div>
  
  <button on:click={decrement}>-</button>
  <button on:click={increment}>+</button>
  <button class="reset" on:click={reset}>Reset</button>
</div>