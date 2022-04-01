// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
// import MainRouter from './MainRouter'
// import {BrowserRouter} from 'react-router-dom'
// import { ThemeProvider } from '@material-ui/styles'
// import theme from './theme'

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );

import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

hydrate(<App/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
