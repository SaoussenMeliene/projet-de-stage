
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Import des outils de debug en développement
/*if (import.meta.env.DEV) {
  import('./debug-api.js').then(({ debugAPI }) => {
    window.debugAPI = debugAPI;
    console.log('🔧 Debug API disponible: window.debugAPI()');
  });
}*/


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

