// src/main.jsx
// Drizzle bootstrap for the optional Drizzle lesson
// Install deps in your Vite React project:
//   npm i drizzle drizzle-react drizzle-react-components web3
//
// This file wires Drizzle into React, using options from drizzleOptions.js

import React from "react";
import ReactDOM from "react-dom/client";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import { drizzleOptions } from "./drizzleOptions";
import App from "./App.jsx";

const store = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { initialized } = drizzleContext;
        if (!initialized) return <div>Loading web3, accounts, and contracts...</div>;
        return <App />;
      }}
    </DrizzleContext.Consumer>
  </DrizzleContext.Provider>
);