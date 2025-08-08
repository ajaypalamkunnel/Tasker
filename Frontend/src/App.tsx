import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoutes";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
