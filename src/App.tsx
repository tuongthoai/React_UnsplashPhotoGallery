import React from "react";
import { Route, Routes } from "react-router-dom";
import PhotoList from "./pages/PhotoList";
import PhotoDetails from "./pages/PhotoDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PhotoList />} />
      <Route path="/photos/:id" element={<PhotoDetails />} />
    </Routes>
  );
};

export default App;
