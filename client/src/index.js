import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./context/Context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);


root.render(
  <ContextProvider>
    <App />
    <ToastContainer className="mobile-toastify" autoClose={10000} />
  </ContextProvider>
);
