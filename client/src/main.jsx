import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import UploadProvider from "./contexts/UploadContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <UploadProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UploadProvider>
    </AuthProvider>
  </React.StrictMode>
);