import React from "react";
import { createRoot } from "react-dom/client"; // Named import
import "./index.css";
import App from "./App"; // Make sure this imports correctly
import store from "./app/store"; // Ensure store is exported correctly
import { Provider } from "react-redux";

import { worker } from "./api/server";

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: "bypass" });
  // Render the app after the mock server starts
}

start()
  .catch((error) => {
    console.error("Error starting the app:", error);
  })
  .finally(() => {
    let root = createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  });
