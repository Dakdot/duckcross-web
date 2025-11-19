import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "ldrs/react/LineSpinner.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomePage } from "./routes/home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
