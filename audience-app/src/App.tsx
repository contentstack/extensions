import React from "react";
import ConfigScreen from "./Config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomField } from "./Custom field";

const App: React.FC = function () {
  return (
    <Router>
      <Routes>
        <Route path="/app-config" element={<ConfigScreen />} />
        <Route path="/custom-field" element={<CustomField />} />
      </Routes>
    </Router>
  );
};

export default App;
