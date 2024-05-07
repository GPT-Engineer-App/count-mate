import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <Router>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Index />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            }
          />
          <Route
            path="/settings"
            element={
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            }
          />
        </Routes>
        <button onClick={toggleSettings} style={{ position: "fixed", bottom: 20, right: 20 }}>
          {isSettingsOpen ? "Close Settings" : "Open Settings"}
        </button>
        {isSettingsOpen && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50vh",
              backgroundColor: "white",
              transition: "transform 0.5s",
              transform: isSettingsOpen ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <Settings />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
