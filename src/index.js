import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RewardStopWatch} from './rewardStopWatch';
import Header from './header';

// const root = ReactDOM.render(document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Header />
    <RewardStopWatch />
  </React.StrictMode>
, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
