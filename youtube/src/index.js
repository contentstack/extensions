import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
// ContentstackUIExtension.init().then(function (extension) {
//   // var stack = extension.stack;
//   // var stackData = stack.getData();
//   // console.log('####', stackData);
//   ReactDOM.render(
//     <React.StrictMode>
//       <App extension={extension} />
//     </React.StrictMode>,
//     document.getElementById("root")
//   );
//   extension.window.updateHeight(500);
//   extension.window.enableResizing();
// });
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
