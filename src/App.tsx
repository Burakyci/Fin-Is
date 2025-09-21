import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation/Navigation";

import {
  LazyHome,
  LazyLogin,
  LazyRegister,
  LazyAccount,
  LazyCreditApplication,
  LoadingSpinner,
} from "./components/LazyComponents";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navigation />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LazyHome />} />
                <Route path="/login" element={<LazyLogin />} />
                <Route path="/register" element={<LazyRegister />} />
                <Route path="/account" element={<LazyAccount />} />
                <Route
                  path="/credit-application"
                  element={<LazyCreditApplication />}
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
