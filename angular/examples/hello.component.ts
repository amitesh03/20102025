import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `
    <div class="hello-container">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      
      <div class="counter-section">
        <h3>Counter: {{ count }}</h3>
        <button (click)="increment()" [disabled]="count >= maxCount">
          Increment
        </button>
        <button (click)="decrement()" [disabled]="count <= 0">
          Decrement
        </button>
        <button (click)="reset()">Reset</button>
      </div>
      
      <div class="input-section">
        <input 
          type="text" 
          [(ngModel)]="inputText" 
          placeholder="Type something..."
        />
        <p>You typed: {{ inputText }}</p>
      </div>
      
      <div class="list-section" *ngIf="items.length > 0">
        <h3>Items:</h3>
        <ul>
          <li *ngFor="let item of items; let i = index">
            {{ i + 1 }}. {{ item }}
          </li>
        </ul>
        <button (click)="addItem()">Add Item</button>
      </div>
    </div>
  `,
  styles: [`
    .hello-container {
      padding: 20px;
      font-family: Arial, sans-serif;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .counter-section, .input-section, .list-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    button {
      margin: 5px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    input {
      padding: 8px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100%;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
    }
    
    li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class HelloComponent implements OnInit {
  title = 'Angular Hello Component';
  message = 'Welcome to Angular!';
  count = 0;
  maxCount = 10;
  inputText = '';
  items = ['First item', 'Second item'];

  constructor() { }

  ngOnInit(): void {
    console.log('Hello component initialized');
  }

  increment(): void {
    if (this.count < this.maxCount) {
      this.count++;
    }
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  reset(): void {
    this.count = 0;
  }

  addItem(): void {
    const newItem = `Item ${this.items.length + 1}`;
    this.items.push(newItem);
  }
}