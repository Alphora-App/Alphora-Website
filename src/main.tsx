// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig
      transition={{ duration: 0.5, ease: "easeOut" }} // default for all motions
      reducedMotion="user" // respects prefers-reduced-motion
    >
      <App />
    </MotionConfig>
  </React.StrictMode>
);
