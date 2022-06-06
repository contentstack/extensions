import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import ConfigScreen from "./Config";
import RTE from "./RTE";

/** HomeRedirectHandler - component to nandle redirect based on the window location pathname,
    as react Router does not identifies pathname if the app is rendered in an iframe.
*/
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

/* App - The main app component that should be rendered */
const App: React.FC = function () {
  // console.log("APP RENDERED")
  return (
    <div>
      <ConfigScreen />
        {/* <HashRouter>
          <Routes>
          <Route path="/" element={<HomeRedirectHandler />} />
            <Route path="/rte" element={<RTE />} />
           <Route path="/config" element={<ConfigScreen />} />
          </Routes>
        </HashRouter> */}
    </div>
  );
};

export default App;


// contentstack web : url: http//localhost:3000
//when http://localhost:3000/rte -> fetch(`url/fetch`) -> js code -> state -> 