import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Providers from "@/Providers.jsx";
import App from "@/App.jsx";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </Providers>
    </BrowserRouter>
  </StrictMode>,
);
