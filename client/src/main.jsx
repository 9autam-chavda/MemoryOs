import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import UploadProvider from "./contexts/UploadProvider";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <UploadProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UploadProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);